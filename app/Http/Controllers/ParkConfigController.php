<?php

namespace App\Http\Controllers;

use App\Models\ParkConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ParkConfigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Busca todas as configurações com paginação
        $configs = ParkConfig::orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Dashboard/parkConfig/index', [
            'configs' => $configs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validação dos dados de entrada
        $validator = Validator::make($request->all(), [
            'vagas' => 'required|integer|min:1',
            'valor_hora' => 'required|numeric|min:0',
            'abertura' => 'required|date_format:H:i',
            'fechamento' => 'required|date_format:H:i|after:abertura',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Se a nova configuração for ativa, desativa as outras
            if ($request->input('is_active')) {
                ParkConfig::where('is_active', true)->update(['is_active' => false]);
            }

            // Cria a nova configuração
            ParkConfig::create($request->only(['vagas', 'valor_hora', 'abertura', 'fechamento', 'is_active']));

            return redirect()->route('dashboard.configuracoes.index');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Erro ao criar a configuração.'])->withInput();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validação dos dados de entrada
        $validator = Validator::make($request->all(), [
            'vagas' => 'required|integer|min:1',
            'valor_hora' => 'required|numeric|min:0',
            'abertura' => 'required|date_format:H:i',
            'fechamento' => 'required|date_format:H:i|after:abertura',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            $config = ParkConfig::findOrFail($id);

            // Atualiza a configuração
            $config->update($request->only(['vagas', 'valor_hora', 'abertura', 'fechamento']));

            return redirect()->route('dashboard.configuracoes.index');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Erro ao atualizar a configuração.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $config = ParkConfig::findOrFail($id);

        // Impede a exclusão de uma configuração ativa
        if ($config->is_active) {
            return redirect()->route('dashboard.configuracoes.index')->withErrors(['error' => 'Não é possível excluir uma configuração ativa.']);
        }

        try {
            $config->delete();
            return redirect()->route('dashboard.configuracoes.index');
        } catch (\Exception $e) {
            return redirect()->route('dashboard.configuracoes.index')->withErrors(['error' => 'Erro ao excluir a configuração.']);
        }
    }

    /**
     * Ativa uma configuração e desativa as demais.
     */
    public function activate(string $id)
    {
        try {
            $config = ParkConfig::findOrFail($id);

            if ($config->is_active) {
                return redirect()->route('dashboard.configuracoes.index');
            }

            // Desativa todas as outras configurações
            ParkConfig::where('is_active', true)->update(['is_active' => false]);

            // Ativa a configuração selecionada
            $config->update(['is_active' => true]);

            return redirect()->route('dashboard.configuracoes.index');
        } catch (\Exception $e) {
            return redirect()->route('dashboard.configuracoes.index')->withErrors(['error' => 'Erro ao ativar a configuração.']);
        }
    }
}
