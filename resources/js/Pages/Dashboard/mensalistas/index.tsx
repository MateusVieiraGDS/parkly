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

const ClientsPage = ({ clients }: any) => {
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCarDialogOpen, setIsCarDialogOpen] = useState(false);
  const [isAssociateCarDialogOpen, setIsAssociateCarDialogOpen] = useState(false);
  const [isConfirmAssociateDialogOpen, setIsConfirmAssociateDialogOpen] = useState(false);
  const [isRemoveCarDialogOpen, setIsRemoveCarDialogOpen] = useState(false); // Novo estado para remover carro
  
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedClientCars, setSelectedClientCars] = useState<any>([]);
  
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [selectedAvailableCar, setSelectedAvailableCar] = useState<any>(null);
  
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCpf, setClientCpf] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [associateLoading, setAssociateLoading] = useState(false);
  
  const [carToRemove, setCarToRemove] = useState<any>(null); // Estado para o carro a ser removido
  
  // Função para abrir o modal de criação/edição
  const openAddEditModal = (client: any = null) => {
    if (client) {
      setSelectedClient(client);
      setClientName(client.name);
      setClientPhone(client.telefone);
      setClientCpf(client.cpf);
    } else {
      setSelectedClient(null);
      setClientName("");
      setClientPhone("");
      setClientCpf("");
    }
    setIsAddEditModalOpen(true);
  };

  // Função para salvar o cliente (criar ou editar)
  const handleSaveClient = async () => {
    if (!clientName || !clientPhone || !clientCpf) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      if (selectedClient) {
        // Atualizar cliente
        await axios.put(route("dashboard.mensalistas.update", { mensalista: selectedClient.id }), {
          name: clientName,
          telefone: clientPhone,
          cpf: clientCpf,
        });
        toast.success("Cliente atualizado com sucesso!");
      } else {
        // Criar cliente
        await axios.post(route("dashboard.mensalistas.store"), {
          name: clientName,
          telefone: clientPhone,
          cpf: clientCpf,
        });
        toast.success("Cliente cadastrado com sucesso!");
      }
      setIsAddEditModalOpen(false);
      // Refrescar os dados dos clientes após a operação
      router.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao salvar o cliente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o modal de confirmação de exclusão
  const openDeleteModal = (client: any) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  // Função para excluir o cliente
  const handleDeleteClient = async () => {
    if (!selectedClient) return;
  
    setLoading(true);
    try {
        console.log(route("dashboard.mensalistas.destroy", selectedClient.id));
      // Passe o ID como argumento posicional
      await axios.delete(route("dashboard.mensalistas.destroy", {id: selectedClient.id}));
      toast.success("Cliente excluído com sucesso!");
      setIsDeleteModalOpen(false);
      // Refrescar os dados dos clientes após a operação
      router.reload();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao excluir o cliente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para exibir os carros do cliente
  const handleShowCars = (client: any) => {
    setSelectedClient(client);
    setSelectedClientCars(client.cars);
    setIsCarDialogOpen(true);
  };

  // Função para abrir o dialog de associar carro
  const handleOpenAssociateCar = async () => {
    setAssociateLoading(true);
    try {
      const response = await axios.get(route("dashboard.mensalistas.getCars"));
      setAvailableCars(response.data);
      setIsAssociateCarDialogOpen(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao buscar carros disponíveis.");
    } finally {
      setAssociateLoading(false);
    }
  };

  // Função para selecionar um carro disponível
  const handleSelectAvailableCar = (car: any) => {
    setSelectedAvailableCar(car);
    setIsConfirmAssociateDialogOpen(true);
  };

  // Função para confirmar a associação do carro
  const handleConfirmAssociateCar = async () => {
    if (!selectedClient || !selectedAvailableCar) {
      toast.error("Cliente ou carro não selecionado.");
      return;
    }

    setAssociateLoading(true);
    try {
      await axios.post(route("dashboard.mensalistas.addCars", { clientId: selectedClient.id }), {
        carId: selectedAvailableCar.id,
      });
      router.reload();
      toast.success("Carro associado com sucesso!");
      setIsConfirmAssociateDialogOpen(false);
      setIsAssociateCarDialogOpen(false);
      setIsCarDialogOpen(false);
      // Atualizar o estado local para refletir a associação sem recarregar a página
      setSelectedClientCars([...selectedClientCars, selectedAvailableCar]);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao associar o carro ao cliente.");
    } finally {
      setAssociateLoading(false);
    }
  };

  // Função para abrir o diálogo de remoção de carro
  const handleOpenRemoveCarDialog = (car: any) => {
    setCarToRemove(car);
    setIsRemoveCarDialogOpen(true);
  };

  // Função para remover o carro do cliente
  const handleRemoveCar = async () => {
    if (!selectedClient || !carToRemove) {
      toast.error("Cliente ou carro não selecionado.");
      return;
    }

    setLoading(true);
    try {
      await axios.delete(route("dashboard.mensalistas.removeCar", { clientId: selectedClient.id, carId: carToRemove.id }));
      toast.success("Carro removido do cliente com sucesso!");
      router.reload();
      setIsRemoveCarDialogOpen(false);
      // Atualizar o estado local para refletir a remoção sem recarregar a página
      setSelectedClientCars(selectedClientCars.filter((car: any) => car.id !== carToRemove.id));
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao remover o carro do cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center w-full h-full">
        <Button className="mt-4 w-full text-lg py-4" onClick={() => openAddEditModal()}>
          Adicionar Cliente
        </Button>

        {/* Tabela de Clientes */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Telefone</th>
                <th className="px-4 py-2">CPF</th>
                <th className="px-4 py-2">Data de Cadastro</th>
                <th className="px-4 py-2">Carros</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.data.map((client: any) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.telefone}</td>
                  <td>{client.cpf}</td>
                  <td>{formatDate(client.created_at)}</td>
                  <td>
                    <Button size="sm" onClick={() => handleShowCars(client)}>
                      {client.cars.length} Carro(s)
                    </Button>
                  </td>
                  <td className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => openAddEditModal(client)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => openDeleteModal(client)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationComponent links={clients?.links ?? []} />
      </div>

      {/* Modal de Criação/Edição */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClient ? "Editar Cliente" : "Adicionar Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="CPF"
              value={clientCpf}
              onChange={(e) => setClientCpf(e.target.value)}
              className="border p-2 rounded"
            />
            <Button onClick={handleSaveClient} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão de Cliente */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Cliente</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este cliente?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsDeleteModalOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteClient} variant="destructive" disabled={loading}>
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Exibir Carros do Cliente */}
      <Dialog open={isCarDialogOpen} onOpenChange={setIsCarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carros do Cliente</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {selectedClientCars.length > 0 ? (
              selectedClientCars.map((car: any) => (
                <div key={car.id} className="border p-2 rounded flex justify-between items-center">
                  <div>
                    <p><strong>Placa:</strong> {car.plate}</p>
                    <p><strong>Nome:</strong> {car.name}</p>
                    <p><strong>Modelo:</strong> {car.model}</p>
                    <p><strong>Cor:</strong> {car.color}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleOpenRemoveCarDialog(car)}>
                    Remover
                  </Button>
                </div>
              ))
            ) : (
              <p>Este cliente não possui carros cadastrados.</p>
            )}
            <Button onClick={handleOpenAssociateCar} disabled={associateLoading}>
              {associateLoading ? "Carregando..." : "Associar Carro"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Associar Carro */}
      <Dialog open={isAssociateCarDialogOpen} onOpenChange={setIsAssociateCarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Associar Carro</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {availableCars.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto">
                {availableCars.map((car) => (
                  <li
                    key={car.id}
                    className="border p-2 rounded mb-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectAvailableCar(car)}
                  >
                    <p><strong>Placa:</strong> {car.plate}</p>
                    <p><strong>Nome:</strong> {car.name}</p>
                    <p><strong>Modelo:</strong> {car.model}</p>
                    <p><strong>Cor:</strong> {car.color}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum carro disponível para associar.</p>
            )}
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsAssociateCarDialogOpen(false)} variant="secondary">
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Associação */}
      <Dialog open={isConfirmAssociateDialogOpen} onOpenChange={setIsConfirmAssociateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Associação</DialogTitle>
          </DialogHeader>
          <p>
            Deseja realmente associar o carro <strong>{selectedAvailableCar?.name}</strong> ao cliente{" "}
            <strong>{selectedClient?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsConfirmAssociateDialogOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmAssociateCar} variant="default" disabled={associateLoading}>
              {associateLoading ? "Associando..." : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Remoção de Carro */}
      <Dialog open={isRemoveCarDialogOpen} onOpenChange={setIsRemoveCarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Carro</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja remover o carro <strong>{carToRemove?.name}</strong> do cliente{" "}
            <strong>{selectedClient?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsRemoveCarDialogOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={handleRemoveCar} variant="destructive" disabled={loading}>
              {loading ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

ClientsPage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true} />;

export default ClientsPage;
