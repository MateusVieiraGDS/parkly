<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use function App\Helpers\onlyNumber;
use function App\Helpers\toSqlDate;

class CCCadastroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'dadosPessoais@cpf' => onlyNumber($this->input('dadosPessoais@cpf')),
            'dadosPessoais@rg' => onlyNumber($this->input('dadosPessoais@rg')),
            'dadosEnderecoContato@telefone' => onlyNumber($this->input('dadosEnderecoContato@telefone')),
            'dadosEnderecoContato@cep' => onlyNumber($this->input('dadosEnderecoContato@cep')),
            'dadosPessoais@dataNasc' => toSqlDate($this->input('dadosPessoais@dataNasc')),
            'dadosCongregacaoBatismo@dataBatismo' => toSqlDate($this->input('dadosCongregacaoBatismo@dataBatismo')),
            'dadosPessoais@estadoCivil' => strtoupper($this->input('dadosPessoais@estadoCivil'))
        ]);        
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'dadosPessoais@nome' => [
                'required',
                'string',
                'max:100',
                'min:3'
            ],
            'dadosEnderecoContato@email' => [
                'nullable',
                'email',
                'unique:users,email'
            ],
            'dadosPessoais@imageFile34' => [
                'nullable',
                'file'
            ],
            'dadosPessoais@dataNasc' => [
                'required',
                'date_format:Y-m-d',
                'before:today'
            ],
            'dadosPessoais@sexo' => [
                'required',
                'in:MASCULINO,FEMININO'
            ],
            'dadosPessoais@cpf' => [
                'required',
                'digits:11',
                'unique:membros,cpf'
            ],
            'dadosPessoais@rg' => [
                'required',
                'min:4',
                'max:10'
            ],
            'dadosPessoais@rgUf' => [
                'required',
                'exists:states,uf'
            ],
            'dadosPessoais@estado' => [
                'required',
                'exists:states,uf'
            ],
            'dadosPessoais@cidade' => [
                'required',
                'exists:cities,id'
            ],
            'dadosPessoais@nomeMae' => [
                'nullable',
                'string',
                'min:3'
            ],
            'dadosPessoais@nomePai' => [
                'nullable',
                'string',
                'min:3'
            ],
            'dadosPessoais@imageFileDoc' => [
                'required',
                'file'
            ],
            'dadosPessoais@imageFileNasc' => [
                'nullable',
                'file'
            ],
            'dadosPessoais@imageFileCas' => [
                'nullable',
                'file'
            ],
            'dadosPessoais@imageFileDiv' => [
                'nullable',
                'file'
            ],
            'dadosPessoais@imageFileObt' => [
                'nullable',
                'file'
            ],
            'dadosPessoais@estadoCivil' => [
                'required',
                'string',
                'in:SOLTEIRO,CASADO,DIVORCIADO,VIUVO'
            ],
            'dadosEnderecoContato@rua' => [
                'required',
                'string',
                'min:3'
            ],
            'dadosEnderecoContato@numero' => [
                'nullable',
                'integer'
            ],
            'dadosEnderecoContato@bairro' => [
                'required',
                'string',
                'min:3'
            ],
            'dadosEnderecoContato@cidade' => [
                'required',
                'exists:cities,id'
            ],
            'dadosEnderecoContato@uf' => [
                'required',
                'exists:states,uf'
            ],
            'dadosEnderecoContato@complemento' => [
                'nullable',
                'string',
                'min:1'
            ],
            'dadosEnderecoContato@cep' => [
                'nullable',
                'string',
                'min:8',
                'max:8'
            ],
            'dadosEnderecoContato@telefone' => [
                'required',
                'string',
                'min:10',
            ],
            'dadosCongregacaoBatismo@dataBatismo' => [
                'required',
                'date_format:Y-m-d',
                'before:today',
            ],
            'dadosCongregacaoBatismo@localBatismo' => [
                'required',
                'string',
                'min:3'
            ],
            'dadosCongregacaoBatismo@minisAnt' => [
                'nullable',
                'string',
                'min:3'
            ],
            'dadosCongregacaoBatismo@congregacao' => [
                'required',
                'exists:congregacoes,id'
            ],
            'dadosCongregacaoBatismo@grupo' => [
                'nullable',
                'exists:grupos,id'
            ],
            'dadosCongregacaoBatismo@certBatFile' => [
                'nullable',
                'file'
            ]
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'dadosPessoais@nome.required' => 'O nome é obrigatório.',
            'dadosPessoais@nome.string' => 'O nome deve ser uma string.',
            'dadosPessoais@nome.max' => 'O nome não pode ter mais de :max caracteres.',
            'dadosPessoais@nome.min' => 'O nome deve ter pelo menos :min caracteres.',
            
            'dadosEnderecoContato@email.email' => 'O email deve ser válido.',            
            'dadosEnderecoContato@email.unique' => 'Este endereço de e-mail já está registrado.',
            
            'dadosPessoais@imageFile34.file' => 'O arquivo deve ser um arquivo válido.',
            
            'dadosPessoais@dataNasc.required' => 'A data de nascimento é obrigatória.',
            'dadosPessoais@dataNasc.date_format' => 'A data de nascimento deve estar no formato Y-m-d.',
            'dadosPessoais@dataNasc.before' => 'A data de nascimento deve ser anterior à data atual.',
            
            'dadosPessoais@sexo.required' => 'O sexo é obrigatório.',
            'dadosPessoais@sexo.in' => 'O sexo deve ser MASCULINO ou FEMININO.',
            
            'dadosPessoais@cpf.required' => 'O CPF é obrigatório.',
            'dadosPessoais@cpf.digits' => 'O CPF deve ter :digits dígitos.',
            'dadosPessoais@cpf.unique' => 'Este CPF já está sendo utilizado por outro usuário.',
            
            'dadosPessoais@rg.required' => 'O RG é obrigatório.',
            'dadosPessoais@rg.min' => 'O RG deve ter no mínimo :min caracteres.',
            'dadosPessoais@rg.max' => 'O RG deve ter no máximo :max caracteres.',
            
            'dadosPessoais@rgUf.required' => 'O UF do RG é obrigatório.',
            'dadosPessoais@rgUf.exists' => 'O UF do RG selecionado é inválido.',
            
            'dadosPessoais@estado.required' => 'O estado é obrigatório.',
            'dadosPessoais@estado.exists' => 'O estado selecionado é inválido.',
            
            'dadosPessoais@cidade.required' => 'A cidade é obrigatória.',
            'dadosPessoais@cidade.exists' => 'A cidade selecionada é inválida.',
            
            'dadosPessoais@nomeMae.string' => 'O nome da mãe deve ser uma string.',
            'dadosPessoais@nomeMae.min' => 'O nome da mãe deve ter pelo menos :min caracteres.',
            
            'dadosPessoais@nomePai.string' => 'O nome do pai deve ser uma string.',
            'dadosPessoais@nomePai.min' => 'O nome do pai deve ter pelo menos :min caracteres.',
            
            'dadosPessoais@imageFileDoc.required' => 'O arquivo de documento é obrigatório.',
            'dadosPessoais@imageFileDoc.file' => 'O arquivo de documento deve ser um arquivo válido.',
            
            'dadosPessoais@imageFileNasc.file' => 'O arquivo deve ser um arquivo válido.',
            'dadosPessoais@imageFileCas.file' => 'O arquivo deve ser um arquivo válido.',
            'dadosPessoais@imageFileDiv.file' => 'O arquivo deve ser um arquivo válido.',
            'dadosPessoais@imageFileObt.file' => 'O arquivo deve ser um arquivo válido.',
            
            'dadosPessoais@estadoCivil.required' => 'O estado civil é obrigatório.',
            'dadosPessoais@estadoCivil.string' => 'O estado civil deve ser uma string.',
            'dadosPessoais@estadoCivil.in' => 'O estado civil selecionado é inválido.',
            
            'dadosEnderecoContato@rua.required' => 'A rua é obrigatória.',
            'dadosEnderecoContato@rua.string' => 'A rua deve ser uma string.',
            'dadosEnderecoContato@rua.min' => 'A rua deve ter pelo menos :min caracteres.',
            
            'dadosEnderecoContato@numero.integer' => 'O número deve ser um número inteiro.',
            
            'dadosEnderecoContato@bairro.required' => 'O bairro é obrigatório.',
            'dadosEnderecoContato@bairro.string' => 'O bairro deve ser uma string.',
            'dadosEnderecoContato@bairro.min' => 'O bairro deve ter pelo menos :min caracteres.',
            
            'dadosEnderecoContato@cidade.required' => 'A cidade é obrigatória.',
            'dadosEnderecoContato@cidade.exists' => 'A cidade selecionada é inválida.',
            
            'dadosEnderecoContato@uf.required' => 'O UF é obrigatório.',
            'dadosEnderecoContato@uf.exists' => 'O UF selecionado é inválido.',
            
            'dadosEnderecoContato@complemento.string' => 'O complemento deve ser uma string.',
            'dadosEnderecoContato@complemento.min' => 'O complemento deve ter pelo menos :min caracteres.',
            
            'dadosEnderecoContato@cep.string' => 'O CEP deve ser uma string.',
            'dadosEnderecoContato@cep.min' => 'O CEP deve ter :min caracteres.',
            'dadosEnderecoContato@cep.max' => 'O CEP deve ter :max caracteres.',
            
            'dadosEnderecoContato@telefone.required' => 'O telefone é obrigatório.',
            'dadosEnderecoContato@telefone.string' => 'O telefone deve ser uma string.',
            'dadosEnderecoContato@telefone.min' => 'O telefone deve ter pelo menos :min caracteres.',
            
            'dadosCongregacaoBatismo@dataBatismo.required' => 'A data de batismo é obrigatória.',
            'dadosCongregacaoBatismo@dataBatismo.date_format' => 'A data de batismo deve estar no formato Y-m-d.',
            'dadosCongregacaoBatismo@dataBatismo.before' => 'A data de batismo deve ser anterior à data atual.',
            
            'dadosCongregacaoBatismo@localBatismo.required' => 'O local de batismo é obrigatório.',
            'dadosCongregacaoBatismo@localBatismo.string' => 'O local de batismo deve ser uma string.',
            'dadosCongregacaoBatismo@localBatismo.min' => 'O local de batismo deve ter pelo menos :min caracteres.',
            
            'dadosCongregacaoBatismo@minisAnt.string' => 'O ministério anterior deve ser uma string.',
            'dadosCongregacaoBatismo@minisAnt.min' => 'O ministério anterior deve ter pelo menos :min caracteres.',
            
            'dadosCongregacaoBatismo@congregacao.required' => 'A congregação é obrigatória.',
            'dadosCongregacaoBatismo@congregacao.exists' => 'A congregação selecionada é inválida.',
            
            'dadosCongregacaoBatismo@grupo.exists' => 'O grupo selecionado é inválido.',
            
            'dadosCongregacaoBatismo@certBatFile.file' => 'O arquivo deve ser um arquivo válido.',
        ];
    }
}
