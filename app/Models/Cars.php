<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cars extends Model
{
    use HasFactory;

    protected $table = 'cars';

    protected $fillable = [
        'plate',
        'name',
        'model',
        'year',
        'color',
        'api_plate_id',
    ];

    /**
     * Método para preencher o modelo Cars a partir da resposta da API.
     *
     * @param string $apiPlateId
     * @param array $data
     * @return void
     */
    public function fillFromApiResponse(string $apiPlateId, array $data): void
    {
        // Extrair a resposta da API e os dados extras
        $response = $data ?? [];
        $extra = $response['extra'] ?? [];

        // Preencher o modelo com os dados disponíveis e redundantes
        $this->api_plate_id = $apiPlateId;

        // Nome: usar o modelo completo, nome e submodelo, aproveitando as redundâncias
        $this->name = $response['MODELO'] ?? $response['modelo'] ?? $extra['marca_modelo']['modelo'] ?? $extra['marca_modelo']['marca'] . ' ' . ($extra['marca_modelo']['versao'] ?? '') ?? $response['SUBMODELO'] ?? null;

        // Modelo: usar a versão ou o modelo detalhado
        $this->model = $response['VERSAO'] ?? $extra['marca_modelo']['versao'] ?? $response['modelo'] ?? $extra['listamodelo'][0][1] ?? null;

        // Ano: pegar o ano do modelo ou da fabricação, tentando as diferentes fontes
        $this->year = $response['anoModelo'] ?? $extra['ano_modelo'] ?? $response['ano'] ?? $extra['ano_fabricacao'] ?? null;

        // Cor: buscar em diferentes fontes de cor
        $this->color = $response['cor'] ?? $extra['cor'] ?? $response['cor_veiculo']['cor'] ?? $extra['cor_veiculo']['cor'] ?? null;
    }
}
