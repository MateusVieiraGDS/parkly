// src/Pages/Dashboard/parkConfig/index.tsx

import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { router, usePage } from "@inertiajs/react";
import { PaginationComponent } from "./components/paginate";

// Função para formatar a hora
const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

const ConfigurationsPage = () => {
  const { props } = usePage();
  const { configs, errors } = props as any;

  // Estados para os diálogos
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<any>(null);

  // Estados para o formulário de adicionar/editar
  const [vagas, setVagas] = useState<number>(0);
  const [valorHora, setValorHora] = useState<number>(0);
  const [abertura, setAbertura] = useState<string>("00:00");
  const [fechamento, setFechamento] = useState<string>("00:00");
  const [isActive, setIsActive] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  // Exibir erros de validação
  if (errors.error) {
    toast.error(errors.error);
  }

  if (errors.vagas) {
    toast.error(errors.vagas);
  }

  if (errors.valor_hora) {
    toast.error(errors.valor_hora);
  }

  if (errors.abertura) {
    toast.error(errors.abertura);
  }

  if (errors.fechamento) {
    toast.error(errors.fechamento);
  }

  // Função para abrir o diálogo de adicionar/editar
  const openAddEditDialog = (config: any = null) => {
    if (config) {
      setSelectedConfig(config);
      setVagas(config.vagas);
      setValorHora(config.valor_hora); // Deve ser número
      setAbertura(formatTime(config.abertura));
      setFechamento(formatTime(config.fechamento));
    } else {
      setSelectedConfig(null);
      setVagas(0);
      setValorHora(0);
      setAbertura("00:00");
      setFechamento("00:00");
    }
    setIsAddEditDialogOpen(true);
  };

  // Função para fechar o diálogo de adicionar/editar
  const closeAddEditDialog = () => {
    setSelectedConfig(null);
    setVagas(0);
    setValorHora(0);
    setAbertura("00:00");
    setFechamento("00:00");
    setIsAddEditDialogOpen(false);
  };

  // Função para salvar a configuração (criar ou editar)
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica no frontend
    if (vagas < 1 || valorHora < 0 || abertura >= fechamento) {
      toast.error("Por favor, verifique os dados inseridos.");
      return;
    }

    setLoading(true);

    const data = {
      vagas,
      valor_hora: valorHora,
      abertura,
      fechamento
    };

    if (selectedConfig) {
      // Atualizar configuração
      router.put(route("dashboard.configuracoes.update", selectedConfig.id), data, {
        onFinish: () => setLoading(false),
        onSuccess: () => {
          toast.success("Configuração atualizada com sucesso!");
          closeAddEditDialog();
        },
        onError: () => {
          toast.error("Erro ao atualizar a configuração.");
        },
      });
    } else {
      // Criar nova configuração
      router.post(route("dashboard.configuracoes.store"), data, {
        onFinish: () => setLoading(false),
        onSuccess: () => {
          toast.success("Configuração criada com sucesso!");
          closeAddEditDialog();
        },
        onError: () => {
          toast.error("Erro ao criar a configuração.");
        },
      });
    }
  };

  // Função para abrir o diálogo de exclusão
  const openDeleteDialog = (config: any) => {
    setSelectedConfig(config);
    setIsDeleteDialogOpen(true);
  };

  // Função para fechar o diálogo de exclusão
  const closeDeleteDialog = () => {
    setSelectedConfig(null);
    setIsDeleteDialogOpen(false);
  };

  // Função para excluir a configuração
  const handleDeleteConfig = () => {
    setLoading(true);
    router.delete(route("dashboard.configuracoes.destroy", selectedConfig.id), {
      onFinish: () => setLoading(false),
      onSuccess: () => {
        toast.success("Configuração excluída com sucesso!");
        closeDeleteDialog();
      },
      onError: () => {
        toast.error("Erro ao excluir a configuração.");
      },
    });
  };

  // Função para ativar uma configuração
  const handleActivateConfig = (id: number) => {
    setLoading(true);
    router.post(route("dashboard.configuracoes.activate", id), {}, {
      onFinish: () => setLoading(false),
      onSuccess: () => {
        toast.success("Configuração ativada com sucesso!");
      },
      onError: () => {
        toast.error("Erro ao ativar a configuração.");
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center w-full h-full">
        <h1 className="text-2xl font-bold">Configurações do Parque</h1>

        {/* Botão para adicionar nova configuração */}
        <div className="w-full flex justify-end">
          <Button type="button" onClick={() => openAddEditDialog()} className="mb-4">
            Adicionar Configuração
          </Button>
        </div>

        {/* Tabela de Configurações */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Vagas</th>
                <th className="px-4 py-2">Valor/Hora</th>
                <th className="px-4 py-2">Abertura</th>
                <th className="px-4 py-2">Fechamento</th>
                <th className="px-4 py-2">Ativo</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {configs.data.map((config: any) => (
                <tr
                  key={config.id}
                  className={`hover:bg-gray-50 ${
                    config.is_active ? "!bg-green-100 font-bold" : ""
                  }`}
                >
                  <td className="px-4 py-2">{config.id}</td>
                  <td className="px-4 py-2">{config.vagas}</td>
                  <td className="px-4 py-2">R$ {Number(config.valor_hora).toFixed(2)}</td>
                  <td className="px-4 py-2">{formatTime(config.abertura)}</td>
                  <td className="px-4 py-2">{formatTime(config.fechamento)}</td>
                  <td className="px-4 py-2">
                    {config.is_active ? "Sim" : "Não"}
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-start">                    
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => openAddEditDialog(config)}
                      >
                        Editar
                      </Button>
                      {!config.is_active ? (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(config)}
                        >
                          Excluir
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleActivateConfig(config.id)}
                        >
                          Tornar Ativo
                        </Button>
                      </>
                    ):
                    <div className="w-[12em] flex items-center justify-center border-2 border-primary px-2 text-primary rounded-md text-[.9em]">
                      <span>Configuração Atual</span>
                    </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Componente de Paginação */}
        <PaginationComponent links={configs?.links ?? []} />
      </div>

      {/* Diálogo de Adicionar/Editar Configuração */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedConfig ? "Editar Configuração" : "Adicionar Configuração"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveConfig} className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-left mb-1">Vagas</label>
              <input
                type="number"
                name="vagas"
                value={vagas}
                onChange={(e) => setVagas(parseInt(e.target.value))}
                className="w-full border p-2 rounded"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-left mb-1">Valor por Hora (R$)</label>
              <input
                type="number"
                name="valor_hora"
                value={valorHora}
                onChange={(e) => setValorHora(parseFloat(e.target.value))}
                className="w-full border p-2 rounded"
                required
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-left mb-1">Abertura</label>
              <input
                type="time"
                name="abertura"
                value={abertura}
                onChange={(e) => setAbertura(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-left mb-1">Fechamento</label>
              <input
                type="time"
                name="fechamento"
                value={fechamento}
                onChange={(e) => setFechamento(e.target.value)}
                className="w-full border p-2 rounded"
                required
                min={abertura}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" onClick={closeAddEditDialog} variant="secondary">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Configuração</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir esta configuração?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={closeDeleteDialog} variant="secondary">
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfig}
              variant="destructive"
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
};

ConfigurationsPage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={false} />;

export default ConfigurationsPage;
