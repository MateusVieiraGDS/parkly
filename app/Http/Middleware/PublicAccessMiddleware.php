<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PublicAccessMiddleware
{
    /**
     * Chave de API esperada.
     * Você pode armazenar essa chave no arquivo .env para maior segurança.
     */
    private $apiKey;

    public function __construct()
    {
        // Defina a chave de API no arquivo .env, por exemplo:
        // EXTERNAL_API_KEY=seu_chave_de_api_aqui
        $this->apiKey = env('PUBLIC_API_KEY');
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Verifique se a chave de API está presente nos headers
        $providedApiKey = $request->header('X-API-KEY');

        if (!$providedApiKey || $providedApiKey !== $this->apiKey) {
            return response()->json(['error' => 'Chave de API inválida ou ausente.'], 403);
        }

        return $next($request);
    }
}
