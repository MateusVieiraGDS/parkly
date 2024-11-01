<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use DateTime;
use Exception;

use function App\Helpers\onlyNumber;

class ContactUpdateRequest extends FormRequest
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
            'telefone' => onlyNumber($this->input('telefone')),
            'cep' => onlyNumber($this->input('cep')),
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
                'email' => [
                'nullable',
                'email',
                'unique:users,email,' . $this->route('id') // Ignora o email do próprio usuário
            ],
           
            'rua' => [
                'required',
                'string',
                'min:3'
            ],
            'numero' => [
                'nullable',
                'integer'
            ],
            'bairro' => [
                'required',
                'string',
                'min:3'
            ],
            'cidade' => [
                'required',
                'exists:cities,id'
            ],
            'uf' => [
                'required',
                'exists:states,uf'
            ],
            'complemento' => [
                'nullable',
                'string',
                'min:1'
            ],
            'cep' => [
                'nullable',
                'string',
                'min:8',
                'max:8'
            ],
            'telefone' => [
                'required',
                'string',
                'min:10',
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
            
            'email.email' => 'O email deve ser válido.',            
            'email.unique' => 'Este endereço de e-mail já está registrado.',                       
            
            'rua.required' => 'A rua é obrigatória.',
            'rua.string' => 'A rua deve ser uma string.',
            'rua.min' => 'A rua deve ter pelo menos :min caracteres.',
            
            'numero.integer' => 'O número deve ser um número inteiro.',
            
            'bairro.required' => 'O bairro é obrigatório.',
            'bairro.string' => 'O bairro deve ser uma string.',
            'bairro.min' => 'O bairro deve ter pelo menos :min caracteres.',
            
            'cidade.required' => 'A cidade é obrigatória.',
            'cidade.exists' => 'A cidade selecionada é inválida.',
            
            'uf.required' => 'O UF é obrigatório.',
            'uf.exists' => 'O UF selecionado é inválido.',
            
            'complemento.string' => 'O complemento deve ser uma string.',
            'complemento.min' => 'O complemento deve ter pelo menos :min caracteres.',
            
            'cep.string' => 'O CEP deve ser uma string.',
            'cep.min' => 'O CEP deve ter :min caracteres.',
            'cep.max' => 'O CEP deve ter :max caracteres.',
            
            'telefone.required' => 'O telefone é obrigatório.',
            'telefone.string' => 'O telefone deve ser uma string.',
            'telefone.min' => 'O telefone deve ter pelo menos :min caracteres.',                       
        ];
    }
}
