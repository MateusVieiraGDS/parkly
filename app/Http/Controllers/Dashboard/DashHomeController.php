<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ParkConfig;
use App\Models\Ticket;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashHomeController extends Controller
{
    public function index()
    {
        Carbon::setLocale('pt_BR');

        $config = ParkConfig::where('is_active', true)->first();
        if (!$config) {
            throw new Exception("Configuração ativa do estacionamento não encontrada.");
        }
    
        // Configuração do estacionamento
        $vagas = $config->vagas;
        $abertura = Carbon::createFromTimeString($config->abertura);
        $fechamento = Carbon::createFromTimeString($config->fechamento);
        $valorHora = $config->valor_hora;
    
        // Receita do dia
        $receitaDoDia = Ticket::selectRaw("
                SUM(TIMESTAMPDIFF(HOUR, created_at, saida) * valor_hora) as receita_total
            ")
            ->whereDate('saida', Carbon::today())
            ->first()
            ->receita_total ?? 0;
    
        // Ocupação atual
        $vagasOcupadas = Ticket::whereNull('saida')
            ->whereDate('created_at', Carbon::today())
            ->count();
    
        // Ocupação por hora
        $ticketsHoje = Ticket::whereDate('created_at', Carbon::today())
            ->orWhereDate('saida', Carbon::today())
            ->get();
    
        $ocupacaoPorHora = [];
        for ($hora = $abertura->copy(); $hora->lt($fechamento); $hora->addHour()) {
            $proxHora = $hora->copy()->addHour();
    
            $ocupacao = $ticketsHoje->filter(function ($ticket) use ($hora, $proxHora) {
                $entrada = Carbon::parse($ticket->created_at);
                $saida = $ticket->saida ? Carbon::parse($ticket->saida) : Carbon::now();
    
                return $entrada->lt($proxHora) && $saida->gte($hora);
            })->count();
    
            $ocupacaoPorHora[] = [
                'hora' => $hora->format('H:i'),
                'ocupacao' => $ocupacao,
            ];
        }
    
        // Faturamento e ocupação diária dos últimos 30 dias
        $faturamentoMensal = Ticket::selectRaw("
                DATE(created_at) as dia,
                SUM(TIMESTAMPDIFF(HOUR, created_at, saida) * valor_hora) as faturamento,
                COUNT(*) as ocupacao
            ")
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('dia')
            ->orderBy('dia')
            ->get()
            ->map(function ($item) {
                return [
                    'dia' => Carbon::parse($item->dia)->format('d/m'),
                    'faturamento' => $item->faturamento ?? 0,
                    'ocupacao' => $item->ocupacao,
                ];
            });
    
        // Distribuição de clientes
        $mensalistas = Ticket::whereNotNull('client_id')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
    
        $avulsos = Ticket::whereNull('client_id')
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
    
        $totalClientes = $mensalistas + $avulsos;
        $distribuicaoClientes = [
            ['name' => 'Mensalistas', 'value' => $totalClientes > 0 ? round(($mensalistas / $totalClientes) * 100, 2) : 0],
            ['name' => 'Avulsos', 'value' => $totalClientes > 0 ? round(($avulsos / $totalClientes) * 100, 2) : 0],
        ];
    
        // Retornar dados para o frontend
        return Inertia::render('Dashboard/home/index', [
            'dashboard' => [
                'totalVagas' => $vagas,
                'vagasOcupadas' => $vagasOcupadas,
                'receitaDoDia' => $receitaDoDia,
                'valorHora' => $valorHora,
                'tempoParaFechar' => $fechamento->diffForHumans(),
                'ocupacaoPorHora' => $ocupacaoPorHora,
                'distribuicaoClientes' => $distribuicaoClientes,
                'faturamentoMensal' => $faturamentoMensal,
            ]
        ]);
    }
    

}
