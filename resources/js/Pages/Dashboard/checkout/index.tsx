import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginationComponent } from "./components/paginate";

const DashboardPayment = ({ tickets }: any) => {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketId, setTicketId] = useState("");

  console.log(tickets);

  const handleExitTicket = () => {
    console.log("Saída de Ticket ID:", ticketId);
    setTicketId("");
    setIsExitModalOpen(false);
  };

  const handleShowDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center w-full h-full">
        <Button className="mt-4 w-full text-lg py-4" onClick={() => setIsExitModalOpen(true)}>
          SAÍDA DE TICKET
        </Button>

        {/* Tabela de Tickets */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Valor Hora</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Data de Entrada</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.data.map((ticket: any) => (
                <tr key={ticket.id}>
                  <td className="px-4 py-2">{ticket.id}</td>
                  <td className="px-4 py-2">R$ {ticket.valor_hora}</td>
                  <td className="px-4 py-2">{new Date(ticket.created_at).toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-2">
                    <Button size="sm" onClick={() => handleShowDetails(ticket)}>
                      Ver Mais
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>          
        </div>
        <PaginationComponent links={tickets?.links ?? []} />
      </div>

      {/* Modal de Saída de Ticket */}
      <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saída de Ticket</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Digite o ID do Ticket"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="border p-2 rounded"
            />
            <Button onClick={handleExitTicket}>Confirmar Saída</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Ticket */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="flex flex-col gap-4">
              <img
                src={selectedTicket.image?.pathname}
                alt="Imagem do Veículo"
                className="w-full h-48 object-cover rounded"
              />
              <p><strong>ID:</strong> {selectedTicket.id}</p>
              <p><strong>Valor Hora:</strong> R$ {selectedTicket.valor_hora}</p>
              <p><strong>Data de Entrada:</strong> {new Date(selectedTicket.created_at).toLocaleString("pt-BR")}</p>
              <p><strong>Data de Saída:</strong> {selectedTicket.saida ? new Date(selectedTicket.saida).toLocaleString("pt-BR") : "Não registrado"}</p>
              <p><strong>Imagem ID:</strong> {selectedTicket.image_id}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

DashboardPayment.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true} />;

export default DashboardPayment;
