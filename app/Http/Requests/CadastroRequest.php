<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use function App\Helpers\onlyNumber;
use function App\Helpers\toSqlDate;

class CadastroRequest extends FormRequest
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
            'cpf' => onlyNumber($this->input('cpf')),
            'rg' => onlyNumber($this->input('rg')),
            'dataNasc' => toSqlDate($this->input('dataNasc')),
            'estadoCivil' => strtoupper($this->input('estadoCivil'))
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
            'nome' => [
                'required',
                'string',
                'max:100',
                'min:3'
            ],
            'imageFile34' => [
                'nullable',
                'file'
            ],
            'dataNasc' => [
                'required',
                'date_format:Y-m-d',
                'before:today'
            ],
            'sexo' => [
                'required',
                'in:MASCULINO,FEMININO'
            ],
            'cpf' => [
                'required',
                'digits:11',
                'unique:membros,cpf'
            ],
            'rg' => [
                'required',
                'min:4',
                'max:10'
            ],
            'rgUf' => [
                'required',
                'exists:states,uf'
            ],
            'estado' => [
                'required',
                'exists:states,uf'
            ],
            'cidade' => [
                'required',
                'exists:cities,id'
            ],
            'nomeMae' => [
                'nullable',
                'string',
                'min:3'
            ],
            'nomePai' => [
                'nullable',
                'string',
                'min:3'
            ],
            'imageFileDoc' => [
                'required',
                'file'
            ],
            'imageFileNasc' => [
                'nullable',
                'file'
            ],
            'imageFileCas' => [
                'nullable',
                'file'
            ],
            'imageFileDiv' => [
                'nullable',
                'file'
            ],
            'imageFileObt' => [
                'nullable',
                'file'
            ],
            'estadoCivil' => [
                'required',
                'string',
                'in:SOLTEIRO,CASADO,DIVORCIADO,VIUVO'
            ],
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
            'nome.required' => 'O nome é obrigatório.',
            'nome.string' => 'O nome deve ser uma string.',
            'nome.max' => 'O nome não pode ter mais de :max caracteres.',
            'nome.min' => 'O nome deve ter pelo menos :min caracteres.',            
            
            'imageFile34.file' => 'O arquivo deve ser um arquivo válido.',
            
            'dataNasc.required' => 'A data de nascimento é obrigatória.',
            'dataNasc.date_format' => 'A data de nascimento deve estar no formato Y-m-d.',
            'dataNasc.before' => 'A data de nascimento deve ser anterior à data atual.',
            
            'sexo.required' => 'O sexo é obrigatório.',
            'sexo.in' => 'O sexo deve ser MASCULINO ou FEMININO.',
            
            'cpf.required' => 'O CPF é obrigatório.',
            'cpf.digits' => 'O CPF deve ter :digits dígitos.',
            'cpf.unique' => 'Este CPF já está sendo utilizado por outro usuário.',
            
            'rg.required' => 'O RG é obrigatório.',
            'rg.min' => 'O RG deve ter no mínimo :min caracteres.',
            'rg.max' => 'O RG deve ter no máximo :max caracteres.',
            
            'rgUf.required' => 'O UF do RG é obrigatório.',
            'rgUf.exists' => 'O UF do RG selecionado é inválido.',
            
            'estado.required' => 'O estado é obrigatório.',
            'estado.exists' => 'O estado selecionado é inválido.',
            
            'cidade.required' => 'A cidade é obrigatória.',
            'cidade.exists' => 'A cidade selecionada é inválida.',
            
            'nomeMae.string' => 'O nome da mãe deve ser uma string.',
            'nomeMae.min' => 'O nome da mãe deve ter pelo menos :min caracteres.',
            
            'nomePai.string' => 'O nome do pai deve ser uma string.',
            'nomePai.min' => 'O nome do pai deve ter pelo menos :min caracteres.',
            
            'imageFileDoc.required' => 'O arquivo de documento é obrigatório.',
            'imageFileDoc.file' => 'O arquivo de documento deve ser um arquivo válido.',
            
            'imageFileNasc.file' => 'O arquivo deve ser um arquivo válido.',
            'imageFileCas.file' => 'O arquivo deve ser um arquivo válido.',
            'imageFileDiv.file' => 'O arquivo deve ser um arquivo válido.',
            'imageFileObt.file' => 'O arquivo deve ser um arquivo válido.',
            
            'estadoCivil.required' => 'O estado civil é obrigatório.',
            'estadoCivil.string' => 'O estado civil deve ser uma string.',
            'estadoCivil.in' => 'O estado civil selecionado é inválido.',                        
        ];
    }
}
