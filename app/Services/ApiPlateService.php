<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Aws\Rekognition\RekognitionClient;
use Aws\Exception\AwsException;

class ApiPlateService
{
    /**
     * Consulta a API externa para obter os dados do veículo.
     *
     * @param string $plate
     * @return array
     */
    public static function fetchPlateData(string $plate): array|false
    {
        $bearerToken = env('API_PLATE_BEARER_TOKEN');
        $deviceToken = env('API_PLATE_DEVICE_TOKEN');
        $apiUrl = "https://gateway.apibrasil.io/api/v2/vehicles/base/000/dados";

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer $bearerToken",
                //'DeviceToken' => $deviceToken,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->get($apiUrl, [
                'placa' => $plate,
            ]);

            if ($response->successful() && !$response->json('error')) {
                return $response->json('data') ?? false;
            }

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }


    /**
     * Detecta a placa de um veículo em uma imagem usando o motor de detecção configurado.
     *
     * A função verifica qual motor de detecção está configurado na variável de ambiente `DETECT_PLATE_ENGINE`
     * e chama o método correspondente para processar a imagem. Os motores suportados são:
     * - `aws`: Usa o Amazon Rekognition para detecção de placas.
     * - `alpr`: Usa o OpenALPR ou Plate Recognizer para detecção de placas.
     * - `ollama`: Usa um motor de detecção customizado (OLLAMA).
     *
     * @param string $imagePath Caminho para a imagem local a ser processada.
     *
     * @return string|null Retorna o texto da placa detectada ou null se nenhuma placa for encontrada.
     *
     * @throws \Exception Se o motor de detecção configurado não for válido.
     */
    public static function detectLicensePlate($imagePath){
        $engine = env('DETECT_PLATE_ENGINE', 'ollama');

        if($engine == 'aws')
            return self::detectLicensePlateAWS($imagePath);
        else if($engine == 'alpr')
            return self::detectLicensePlateALPR($imagePath);
        else
            return self::detectLicensePlateOLLAMA($imagePath);

    }

    /**
     * Envia uma imagem para o Ollama para reconhecimento usando o modelo 'llama3.2-vision'.
     *
     * @param string $imagePath
     * @return string|null
     */
    private static function detectLicensePlateOLLAMA(string $imagePath): ?string
    {
        $ollamaUrl = 'http://172.26.10.234:11434/api/chat';
        $model = 'llama3.2-vision';

        //try {
            // Otimiza a imagem usando funções nativas do PHP
            $base64Image = self::optimizeImageNative($imagePath);

            // Monta o payload da requisição
            $payload = [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => 'Qual a placa do carro? me envie somente a placa, mas nenhum texto.',
                        'images' => [$base64Image],
                    ],
                ],
            ];

            // Faz a requisição para o Ollama
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->timeout(360)->post($ollamaUrl, $payload);

            // Lê o corpo da resposta como texto
            $ndjson = $response->body();

            // Inicializa uma variável para armazenar o texto reconhecido
            $recognizedText = '';

            // Processa cada linha de NDJSON
            $lines = explode("\n", trim($ndjson));
            foreach ($lines as $line) {
                if (!empty($line)) {
                    $json = json_decode($line, true);
                    if (isset($json['message']['content'])) {
                        $recognizedText .= $json['message']['content'];
                    }
                }
            }

            $recognizedText = str_replace([' ', '-'], ['', ''], strtoupper($recognizedText));

            return !empty($recognizedText) ? $recognizedText : null;
        /* } catch (\Exception $e) {
            Log::error("Erro ao enviar imagem para Ollama: " . $e->getMessage());
            return null;
        } */
    }    


    /**
     * Detecta a placa de um carro em uma imagem usando o Amazon Rekognition.
     *
     * @param string $imagePath Caminho para a imagem local.
     * @return string|null Retorna a placa detectada ou null se não encontrar.
     */
    private static function detectLicensePlateAWS($imagePath)
    {
        // Credenciais da AWS
        $accessKey = env('AWS_ACCESS_KEY_ID');
        $secretKey = env('AWS_SECRET_ACCESS_KEY');

        // Configurar o cliente do Rekognition
        $rekognition = new RekognitionClient([
            'version' => 'latest',
            'region'  => 'us-east-1',
            'credentials' => [
                'key'    => $accessKey,
                'secret' => $secretKey,
            ],
        ]);

        // Ler a imagem e codificar em base64
        $imageBytes = file_get_contents(Storage::disk('do')->url($imagePath));

        // Parâmetros da requisição
        $params = [
            'Image' => [
                'Bytes' => $imageBytes,
            ],
        ];

        try {
            // Chamar o Amazon Rekognition para detectar texto
            $result = $rekognition->detectText($params);
            // Analisar o resultado e buscar o padrão de placa (letras e números)
            foreach ($result['TextDetections'] as $text) {
                $detectedText = $text['DetectedText'];
                $detectedText = str_replace([' ', '-'], ['', ''], strtoupper($detectedText));
                // Padrão para placa de veículo brasileiro (ex: ABC1D23)
                
                if (preg_match('/^[A-Z]{3}\d[A-Z]\d{2}$/', $detectedText) 
                    || preg_match('/^[A-Z]{3}\d{4}$/', $detectedText)) {
                    
                    return $detectedText;
                }
            }
        } catch (AwsException $e) {
            // Tratar erro e exibir mensagem
            error_log('Erro ao detectar texto: ' . $e->getMessage());
            return null;
        }

        // Retorna null se nenhuma placa for encontrada
        return null;
    }

    /**
     * Detecta a placa de um veículo usando o serviço Plate Recognizer (ALPR).
     *
     * @param string $imagePath Caminho para a imagem local.
     * @return string|null Retorna o texto da placa detectada ou null se não encontrar.
     */
    private static function detectLicensePlateALPR($imagePath)
    {
        // URL da API do Plate Recognizer
        $url = 'https://api.platerecognizer.com/v1/plate-reader/';
        $apiKey = env('ALPR_API_KEY');

        // Faz a requisição para a API usando o Laravel Http Client
        $response = Http::withHeaders([
            'Authorization' => "Token $apiKey",
        ])->attach(
            'upload', file_get_contents($imagePath), basename($imagePath)
        )->post($url);

        // Verifica se a requisição foi bem-sucedida
        if ($response->successful()) {
            $data = $response->json();

            // Verifica se há resultados
            if (!empty($data['results'])) {
                // Pega a primeira placa detectada
                $plate = $data['results'][0]['plate'];
                return str_replace([' ', '-'], ['', ''], strtoupper($plate));
            }
        }

        // Retorna null se não encontrar nenhuma placa
        return null;
    }


    /**
     * Otimiza a imagem usando funções nativas do PHP, trabalhando apenas na memória.
     *
     * @param string $imagePath
     * @return string Imagem otimizada codificada em base64
     */
    private static function optimizeImageNative(string $imagePath): string
    {
        // Lê o conteúdo da imagem diretamente da URL (em memória)
        $imageContent = file_get_contents(Storage::disk('do')->url($imagePath));

        // Cria uma imagem a partir do conteúdo da memória
        $image = imagecreatefromstring($imageContent);

        // Verifica se a imagem foi criada com sucesso
        if (!$image) {
            throw new \Exception("Falha ao criar a imagem a partir do conteúdo.");
        }

        // Reduz a resolução para um máximo de 800x600
        $width = imagesx($image);
        $height = imagesy($image);
        $newWidth = 800;
        $newHeight = (int)(($height / $width) * $newWidth);

        $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
        imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Converte para tons de cinza
        imagefilter($resizedImage, IMG_FILTER_GRAYSCALE);

        // Aumenta o contraste (valores negativos para aumentar o contraste)
        imagefilter($resizedImage, IMG_FILTER_CONTRAST, -50);

        // Ajusta o brilho (valores positivos para aumentar o brilho)
        imagefilter($resizedImage, IMG_FILTER_BRIGHTNESS, 20);

        imagefilter($resizedImage, IMG_FILTER_SMOOTH, 5); // Aplica suavização


        // Inicia um buffer de saída em memória
        ob_start();
        // Salva a imagem no buffer com qualidade de 75%
        imagejpeg($resizedImage, null, 75);
        // Captura o conteúdo do buffer
        $optimizedImageContent = ob_get_clean();

        // Libera a memória
        imagedestroy($image);
        imagedestroy($resizedImage);

        // Codifica a imagem otimizada em base64
        return base64_encode($optimizedImageContent);
    }
}