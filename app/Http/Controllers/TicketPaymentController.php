<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::with('payment', 'client', 'image', 'car')->orderBy('id', 'desc')
            ->paginate(17);

        return Inertia::render('Dashboard/checkout/index')
        ->with('tickets', $tickets);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ticket = Ticket::with('payment', 'client', 'image', 'car')->find($id);

        if (!$ticket) {
            return response()->json(['error' => 'Ticket não encontrado'], 404);
        }

        return response()->json($ticket);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $ticket = Ticket::findOrFail($id);

        $ticketHasPayment = TicketPayment::where('ticket_id', $ticket->id)->first();

        if($ticketHasPayment) {
            return redirect()->back()->withErrors(['ticket' => 'Esse ticket já foi pago']);
        }

        TicketPayment::create([
            'ticket_id' => $ticket->id,
        ]);

        return redirect()->back()->with('ticket', 'Ticket pago com sucesso');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
