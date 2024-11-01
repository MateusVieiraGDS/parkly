<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\UploadTrait;
use App\Http\Requests\CadastroRequest;
use App\Http\Requests\ContactUpdateRequest;
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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

use function App\Helpers\onlyNumber;
use function App\Helpers\toSqlDate;

class MembersController extends Controller
{
    use UploadTrait;
    /**
     * no enderecoContato falta trazer os campos preenchidos no momento que entrar na pagina, além de precisar fazer um método para upload dos dados pessoais ou ajustar
     * finalizei alguns ajustes no helpers e aparentemente está subindo certinho, ajustei o sonner também, agora é adicionar também os campos na migrate
     * para armazenar o certificado de casamento, divorcio e obito, alem do comprovante de residencia
     */
    public function index()
    {
        $states = State::all();
        return Inertia::render('Dashboard/members/index', [
            'states' => $states,
        ]);
    }

    public function create()
    {
        $states = State::with('cities')->get();
        return Inertia::render('Dashboard/members/create/index', [
            'states_cities' => $states,
        ]);
    }    

    public function edit($id){
        $user = User::with([
            'membro.fileCertNascimento',
            'membro.fileDocImage',
            'membro.fileFoto',
            'membro.CargoAtual',
            'membro.TodosCargos',
            'membro.Grupo',
            'membro.Congregacao',
            'membro.DadosComplmentar',
            'membro.Enderecos',
            'membro.Telefones',
            'membro.Disciplinas',
            'membro.Batismo',
            'membro.Casamentos',
            'membro.nat_state',
            'membro.nat_city',
            'membro.rg_state',
        ])->find($id);

        $states = State::with('cities')->get();
        return Inertia::render('Dashboard/members/edit/index', [
            'states_cities' => $states,
            'user' => $user,
        ]);
    }

    public function updateContact(ContactUpdateRequest $request, $id){
        $dataRequest = $request->validated();
        $user = User::find($id);
       
        try{
            
            DB::beginTransaction();
            
            $user->email = $dataRequest['email'];
            $user->save();
            
            $filesUploaded = $this->uploadManyFiles($request, [
                'imageFileResidencia'
            ]);     

            $member = $user->membro;

            $telefone = Telefone::where('membro_id', $member->id)->first();
            if($telefone){
                $telefone->numero = onlyNumber($dataRequest['telefone']);
                $telefone->save();
            }else{
                Telefone::create([
                    'membro_id' => $member->id,
                    'tipo' => 'celular',
                    'numero' => onlyNumber($dataRequest['telefone']),
                ]);
            }


            $stateEnd = State::where('uf', $dataRequest['uf'])->first();
            $cityEnd = City::find($dataRequest['cidade']);
            $endereco = Endereco::where('membro_id', $member->id)->first();

            if($endereco){
                $endereco->cep = onlyNumber($dataRequest['cep']);
                $endereco->rua = $dataRequest['rua'];
                $endereco->numero = $dataRequest['numero'];
                $endereco->complemento = $dataRequest['complemento'];
                $endereco->bairro = $dataRequest['bairro'];
                $endereco->city_id = $cityEnd->id;
                $endereco->state_id = $stateEnd->id;
                $endereco->save();
            }else{
                Endereco::create([
                    'membro_id' => $member->id,
                    'cep' => onlyNumber($dataRequest['cep']),
                    'rua' => $dataRequest['rua'],
                    'numero' => $dataRequest['numero'],
                    'complemento' => $dataRequest['complemento'],
                    'bairro' => $dataRequest['bairro'],
                    'city_id' => $cityEnd->id,
                    'state_id' => $stateEnd->id,
                ]);
            }
            
            DB::commit();

            return redirect(route("dashboard.membros.edit", ["id" => $user->id]));
        }catch(\Exception $e){             
            foreach($filesUploaded as $file)
                $this->deleteFile($file->pathname);                 
            DB::rollBack();
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }


    public function NewMember(CadastroRequest $request)
    {
        $dataRequest = $request->validated();

        try {
            // Executa a transação
            $user = DB::transaction(function () use ($dataRequest, $request) {
                // Criação do usuário
                $user = User::newUser(
                    $dataRequest['nome'],
                    "{$dataRequest['cpf']}@adtoyama.toyama",
                    Str::random(20),
                    4
                );

                // Upload dos arquivos
                
                $filesUploaded = $this->uploadManyFiles($request, [
                    'imageFile34', 
                    'imageFileDoc', 
                    'imageFileNasc',
                    'imageFileCas',
                    'imageFileDiv',
                    'imageFileObt',
                ]);

                // Obtenção dos dados de estado e cidade
                $stateNatur = State::where('uf', $dataRequest['estado'])->first();
                $cityNatur = City::find($dataRequest['cidade']);
                $stateDoc = State::where('uf', $dataRequest['rgUf'])->first();

                // Verificação de existência
                if (!$stateNatur || !$cityNatur || !$stateDoc) {
                    throw new \Exception('Erro: Estado ou cidade não encontrado.');
                }

                // Criação do membro
                $member = Membro::create([
                    'uuid' => Str::uuid(),
                    'rg' => onlyNumber($dataRequest['rg']),
                    'cpf' => onlyNumber($dataRequest['cpf']),
                    'nasc' => $dataRequest['dataNasc'],
                    'sexo' => $dataRequest['sexo'],
                    'estado_civil' => $dataRequest['estadoCivil'],
                    'nat_state_id' => $stateNatur->id,
                    'nat_city_id' => $cityNatur->id,
                    'rg_state_id' => $stateDoc->id,
                    'user_id' => $user->id,
                    'congregacao_id' => 1,
                    'file_cert_nascimento' => $filesUploaded['imageFileNasc']->id ?? null,
                    'file_doc_image' => $filesUploaded['imageFileDoc']->id ?? null,
                    'file_foto' => $filesUploaded['imageFile34']->id ?? null,
                ]);

                // Criação dos dados complementares
                DadosComplementar::create([
                    'membro_id' => $member->id,
                    'nome_pai' => $dataRequest['nomePai'],
                    'nome_mae' => $dataRequest['nomeMae'],
                ]);

                return $user;
            });

            return redirect(route("dashboard.membros.edit", ["id" => $user->id]));

        } catch (\Exception $e) {
            foreach($filesUploaded as $file)
                $this->deleteFile($file->pathname); 
            return redirect()->back()->withErrors(['create' => $e->getMessage()]);
        }
    }


    
    public function NewMember2(Request $request){       
        

        $dataRequest = $request->validated();
        dd($dataRequest);

        $filesUploaded = [];
        $filesUploadedConsagracao = [];

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
