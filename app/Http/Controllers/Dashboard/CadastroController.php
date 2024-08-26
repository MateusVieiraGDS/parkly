<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\UploadTrait;
use App\Models\Batismo;
use App\Models\City;
use App\Models\Consagracao;
use App\Models\DadosComplementar;
use App\Models\Endereco;
use App\Models\File;
use App\Models\Membro;
use App\Models\State;
use App\Models\Telefone;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

function onlyNumber($value)
{
    return preg_replace('/[^0-9]/', '', (string) $value);
}

function toSqlDate($date)
{
    $date = DateTime::createFromFormat('d/m/Y', $date);
    if ($date === false) 
        throw new Exception('Erro ao formatar a data.');
    $dataMySQL = $date->format('Y-m-d');
    return $dataMySQL;
}
class CadastroController extends Controller
{
    use UploadTrait;
    /**
     * estou finalizando o cadastro, estava fazendo o negocio do estado, falta testar e ve como ficou, tem a situação da imagem também,
     * para a edição e os componentes não controlados
     * 
     */

    
    public function NewMember(CadastroRequest $request){       
        

        $dataRequest = $request->validated();
        dd($dataRequest);

        $filesUploaded = [];
        $filesUploadedConsagracao = [];

        // Iniciar a transação para garantir integridade total do cadastro, caso algum erro ocorra desfaz tudo
        DB::beginTransaction();

        try{
            $user = User::newUser(
                $request->input('dadosPessoais@nome'),
                $request->input('dadosEnderecoContato@email'),
                Str::random(20),
                4
            );
            
            $filesUploaded = $this->uploadManyFiles($request, [
                'dadosPessoais@imageFile34', 
                'dadosPessoais@imageFileDoc', 
                'dadosPessoais@imageFileNasc',
                'dadosPessoais@imageFileCas',
                'dadosPessoais@imageFileDiv',
                'dadosPessoais@imageFileObt',
                'dadosCongregacaoBatismo@certBatFile',
            ]);     
            
            $stateNatur = State::where('uf', $request->input('dadosPessoais@estado'))->first();
            $cityNatur = City::find($request->input('dadosPessoais@cidade'));
            $stateDoc = State::where('uf', $request->input('dadosPessoais@rgUf'))->first();
            $member = Membro::create([
                'uuid' => Str::uuid(),
                'rg' => onlyNumber($request->input('dadosPessoais@rg')),
                'cpf' => onlyNumber($request->input('dadosPessoais@cpf')),
                'nasc' => toSqlDate($request->input('dadosPessoais@dataNasc')),
                'sexo' => $request->input('dadosPessoais@sexo'),
                'estado_civil' => $request->input('dadosPessoais@estadoCivil'),
                'nat_state_id' => $stateNatur->id,
                'nat_city_id' => $cityNatur->id,
                'rg_state_id' => $stateDoc->id,
                'user_id' => $user->id,
                'grupo_id' => $request->input('dadosCongregacaoBatismo@grupo'),
                'congregacao_id' => $request->input('dadosCongregacaoBatismo@congregacao'),
                'file_cert_nascimento' => $filesUploaded['dadosPessoais@imageFileNasc']->id ?? null,
                'file_doc_image' => $filesUploaded['dadosPessoais@imageFileDoc']->id ?? null,
                'file_foto'  => $filesUploaded['dadosPessoais@imageFile34']->id ?? null,
            ]);

            DadosComplementar::create([
                'membro_id' => $member->id,
                'nome_pai' => $request->input('dadosPessoais@nomePai'),
                'nome_mae' => $request->input('dadosPessoais@nomeMae'),
                'ministerio_anterior' => $request->input('dadosCongregacaoBatismo@minisAnt')
            ]);

            $bat_ministerio = $request->input('dadosCongregacaoBatismo@localBatismo');
            Batismo::create([
                'membro_id' => $member->id,
                'data_batismo' => toSqlDate($request->input('dadosCongregacaoBatismo@dataBatismo')),
                'ministerio' => $bat_ministerio == 'self' ? null : $bat_ministerio,
                'file_cert_batismo' => $filesUploaded['dadosCongregacaoBatismo@certBatFile']->id ?? null,
            ]);

            Telefone::create([
                'membro_id' => $member->id,
                'tipo' => 'celular',
                'numero' => onlyNumber($request->input('dadosEnderecoContato@telefone')),
            ]);


            $stateEnd = State::where('uf', $request->input('dadosEnderecoContato@uf'))->first();
            $cityEnd = City::find($request->input('dadosEnderecoContato@cidade'));
            Endereco::create([
                'membro_id' => $member->id,
                'cep' => onlyNumber($request->input('dadosEnderecoContato@cep')),
                'rua' => $request->input('dadosEnderecoContato@rua'),
                'numero' => $request->input('dadosEnderecoContato@numero'),
                'complemento' => $request->input('dadosEnderecoContato@compl'),
                'bairro' => $request->input('dadosEnderecoContato@bairro'),
                'city_id' => $cityEnd->id,
                'state_id' => $stateEnd->id,
            ]);

            $filesUploadedConsagracao = $this->processarConsagracoes($member->id, $request);
            
            //Confirma as operações no banco de dados
            DB::commit();

            return response()->json(['success' => 'Membro cadastrado com sucesso!']);            
        }catch(\Exception $e){   
            
            //Caso ocorra qualquer erro desfaz todas as alterações e apaga possíveis uploads            
            foreach($filesUploaded as $file)
                $this->deleteFile($file->pathname);            

            foreach($filesUploadedConsagracao as $file)
                $this->deleteFile($file);            

            DB::rollBack();

            return response()->json(['error' => $e->getMessage(), 'line' => $e->getLine(), 'file' => $e->getFile()], 500);
        }
    }

    private function uploadManyFiles(Request $request, array $filesNames){
        $files = [];
        foreach($filesNames as $filesName){
            if($request->hasFile($filesName)){
                $file = $request->file($filesName);
                $file_path = $this->upload($file);
                if($file_path)
                    $files[$filesName] = File::create([
                        'pathname' => $file_path,
                        'mime' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]);
            }
        }
        return $files;
    }

    private function processarConsagracoes(int $membroId, Request $request)
    {

        $data = $request->all();
        
        $consagracoes = [];

        $filesUploaded = [];

        foreach ($data as $key => $value) {
            if (preg_match('/dadosConsagracao@ARRAY_(\d+)@(\w+)/', $key, $matches)) {
                $index = $matches[1];
                $field = $matches[2];
                
                // Inicializa a estrutura se ainda não existir
                if (!isset($consagracoes[$index])) {
                    $consagracoes[$index] = [];
                }
                // Armazena a chave do valor no campo correspondente
                $consagracoes[$index][$field] = $key;
            }
        }

        // Processar cada consagração
        foreach ($consagracoes as $consagracao) {
            $cargoId = $request->input($consagracao['cargoId']) ?? null;
            $dataCon = $request->input($consagracao['dataCon']) ?? null;
            $ministerio = $request->input($consagracao['ministerio']) ?? null;
            $certConFile = $consagracao['certConFile'] ?? null;

            // Upload do arquivo se existir
            $fileCertConsagracao = null;
            if ($certConFile && $request->hasFile($certConFile)) {
                $file = $request->file($certConFile);
                $file_uploaded = $this->upload($file);
                $filesUploaded[] = $file_uploaded;

                $fileCertConsagracao = File::create([
                    'pathname' => $file_uploaded,
                    'mime' => $file->getMimeType(),
                    'size' => $file->getSize()
                ]);
            }            

            // Criar a entrada no banco de dados
            Consagracao::create([
                'data_consagracao' => toSqlDate($dataCon),
                'ministerio' => $ministerio == 'self' ? null : $ministerio,
                'membro_id' => $membroId,
                'cargo_id' => $cargoId,
                'file_cert_consagracao' => $fileCertConsagracao->id ?? null,
                'situacao' => 'ATIVO',
            ]);
        }

        return $filesUploaded;
    }
}
