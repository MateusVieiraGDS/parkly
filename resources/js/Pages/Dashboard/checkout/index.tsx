import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PaginationComponent } from "./components/paginate";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import axios from "axios";

// Função para formatar a data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DashboardPayment = ({ tickets }: any) => {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [exitTicket, setExitTicket] = useState<any>(null);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShowDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDetailsModalOpen(true);
  };

  const openExitModal = () => {
    setExitTicket(null);
    setTicketId("");
    setIsExitModalOpen(true);
  };

  const fetchTicketDetailsForExit = async () => {
    if (!ticketId) {
      toast.error("Por favor, insira o ID do ticket.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(route("dashboard.saidas.show", ticketId));
      setExitTicket(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao buscar o ticket.");
    } finally {
      setLoading(false);
    }
  };

  const calculateCharge = (ticket: any) => {
    if (!ticket || !ticket.created_at || !ticket.valor_hora) return "Dados insuficientes";

    const entrada = new Date(ticket.created_at);
    const saida = ticket.saida ? new Date(ticket.saida) : new Date();
    const horas = Math.ceil((saida.getTime() - entrada.getTime()) / (1000 * 60 * 60));
    const valorHora = parseFloat(ticket.valor_hora);

    return `R$ ${(horas * valorHora).toFixed(2)}`;
  };

  const handleExitTicket = () => {
    if (!exitTicket) {
      toast.error("Nenhum ticket selecionado.");
      return;
    }

    router.put(route("dashboard.saidas.update", exitTicket.id), {}, {
      onSuccess: () => {
        toast.success("Ticket de saída registrado com sucesso!");
        setExitTicket(null);
        setTicketId("");
        setIsExitModalOpen(false);
      },
      onError: (error: any) => {
        const ticketError = error?.response?.data?.ticket;
        if (ticketError) {
          toast.error(ticketError);
        } else {
          console.log(error);
          toast.error("Ocorreu um erro inesperado.");
        }
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center w-full h-full">
        <Button className="mt-4 w-full text-lg py-4" onClick={openExitModal}>
          SAÍDA DE TICKET
        </Button>

        <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Valor Hora</th>
              <th className="px-4 py-2 text-left font-semibold">Data de Entrada</th>
              <th className="px-4 py-2 text-left font-semibold">Status de Pagamento</th>
              <th className="px-4 py-2 text-left font-semibold">Status de Saída</th>
              <th className="px-4 py-2 text-left font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.data.map((ticket: any) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                {/* ID do Ticket */}
                <td className="px-4 py-2">{ticket.id}</td>

                {/* Valor Hora */}
                <td className="px-4 py-2">R$ {ticket.valor_hora}</td>

                {/* Data de Entrada */}
                <td className="px-4 py-2">{formatDate(ticket.created_at)}</td>

                {/* Status de Pagamento */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      ticket.payment ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ticket.payment ? "Pago" : "Não Pago"}
                  </span>
                </td>

                {/* Status de Saída */}
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      ticket.saida ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {ticket.saida ? "Saiu" : "Ainda no local"}
                  </span>
                </td>

                {/* Ações */}
                <td className="px-4 py-2">
                  <Button onClick={() => handleShowDetails(ticket)}>Ver Mais</Button>
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
          <input
            type="text"
            placeholder="Digite o ID do Ticket"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="border p-2 rounded"
          />
          <Button onClick={fetchTicketDetailsForExit}>Buscar Ticket</Button>
          {exitTicket && (
            <div className="flex flex-col gap-4">
              <p><strong>ID:</strong> {exitTicket.id}</p>
              <p><strong>Valor Hora:</strong> R$ {exitTicket.valor_hora}</p>
              <p><strong>Status de Pagamento:</strong> 
                <span className={`font-bold text-white  px-2 py-1 rounded-lg ml-2 ${exitTicket.payment ? 'bg-green-600' : 'bg-red-600'}`}>
                  {exitTicket.payment ? "Pago" : "Não Pago"}
                </span>
              </p>
              <p><strong>Data de Pagamento:</strong> {exitTicket.payment ? formatDate(exitTicket.payment.created_at) : <span className = "opacity-60">Sem Registro</span>}</p>
              <p><strong>Valor Total:</strong> {calculateCharge(exitTicket)}</p>
              <p><strong>Carro:</strong> {exitTicket.car ? `${exitTicket.car.name} - ${exitTicket.car.plate} (${exitTicket.car.color})` : <span className = "opacity-60">Sem Registro</span>}</p>
              <p><strong>Cliente:</strong> {exitTicket.client ? `${exitTicket.client.name} - ${exitTicket.client.telefone} (${exitTicket.client.cpf})` : <span className = "opacity-60">Sem Registro</span>}</p>
              <img src={exitTicket.image?.pathname} alt="Imagem do Veículo" className="w-full h-48 object-cover rounded" />
              {!exitTicket.payment && <Button onClick={handleExitTicket}>Confirmar Saída</Button>}
            </div>
          )}
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
              <p><strong>ID:</strong> {selectedTicket.id}</p>
              <p><strong>Valor Hora:</strong> R$ {selectedTicket.valor_hora}</p>
              <p><strong>Status de Pagamento:</strong> 
                <span className={`font-bold text-white  px-2 py-1 rounded-lg ml-2 ${selectedTicket.payment ? 'bg-green-600' : 'bg-red-600'}`}>
                  {selectedTicket.payment ? "Pago" : "Não Pago"}
                </span>
              </p>
              <p><strong>Data de Pagamento:</strong> {selectedTicket.payment ? formatDate(selectedTicket.payment.created_at) : <span className = "opacity-60">Sem Registro</span>}</p>
              <p><strong>Valor Total:</strong> {calculateCharge(selectedTicket)}</p>
              <p><strong>Carro:</strong> {selectedTicket.car ? `${selectedTicket.car.name} - ${selectedTicket.car.plate} (${selectedTicket.car.color})` : <span className = "opacity-60">Sem Registro</span>}</p>
              <p><strong>Cliente:</strong> {selectedTicket.client ? `${selectedTicket.client.name} - ${selectedTicket.client.telefone} (${selectedTicket.client.cpf})` : <span className = "opacity-60">Sem Registro</span>}</p>
              <img src={selectedTicket.image?.pathname} alt="Imagem do Veículo" className="w-full h-48 object-cover rounded" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

DashboardPayment.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true} />;

export default DashboardPayment;
