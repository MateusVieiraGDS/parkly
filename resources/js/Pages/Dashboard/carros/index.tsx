// src/Pages/Dashboard/CarsPage.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import axios from "axios";
import { PaginationComponent } from "./components/paginate";
import { JSONTree } from 'react-json-tree';

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

const CarsPage = ({ cars, successMessage }: any) => {
  // Estados para o diálogo de "Ver Mais"
  const [isViewMoreDialogOpen, setIsViewMoreDialogOpen] = useState(false);
  const [selectedCarApiPlate, setSelectedCarApiPlate] = useState<any>(null);

  // Estados para o diálogo de "Adicionar Carro"
  const [isAddCarDialogOpen, setIsAddCarDialogOpen] = useState(false);

  // Uso do hook useForm do Inertia para o formulário de cadastro
  const { data, setData, post, processing, errors, reset } = useForm({
    plate: '',
    name: '',
    model: '',
    year: '',
    color: '',
  });

  // Função para abrir o diálogo "Ver Mais"
  const handleOpenViewMore = (apiPlate: any) => {
    setSelectedCarApiPlate(apiPlate);
    setIsViewMoreDialogOpen(true);
  };

  // Função para fechar o diálogo "Ver Mais"
  const handleCloseViewMore = () => {
    setSelectedCarApiPlate(null);
    setIsViewMoreDialogOpen(false);
  };

  // Função para abrir o diálogo "Adicionar Carro"
  const handleOpenAddCar = () => {
    setIsAddCarDialogOpen(true);
  };

  // Função para fechar o diálogo "Adicionar Carro"
  const handleCloseAddCar = () => {
    setIsAddCarDialogOpen(false);
    reset(); // Reseta o formulário
  };

  // Função para submeter o formulário de cadastro
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('dashboard.carros.store'), {
      onSuccess: () => {
        handleCloseAddCar();
        toast.success('Carro cadastrado com sucesso.');
      },
      onError: () => {
        toast.error('Erro ao cadastrar o carro. Verifique os campos.');
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center w-full h-full">
        {/* Botão para abrir o formulário de cadastro */}
        <div className="w-full flex justify-end">
          <Button onClick={handleOpenAddCar} variant="default">
            Adicionar Carro
          </Button>
        </div>

        {/* Tabela de Carros */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Placa</th>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Modelo</th>
                <th className="px-4 py-2">Ano</th>
                <th className="px-4 py-2">Cor</th>
                <th className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cars.data.map((car: any) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{car.id}</td>
                  <td className="px-4 py-2">{car.plate}</td>
                  <td className="px-4 py-2">{car.name || '-'}</td>
                  <td className="px-4 py-2">{car.model || '-'}</td>
                  <td className="px-4 py-2">{car.year || '-'}</td>
                  <td className="px-4 py-2">{car.color || '-'}</td>
                  <td className="px-4 py-2">
                    {car.api_plate ? (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleOpenViewMore(car.api_plate)}
                      >
                        Ver Mais
                      </Button>
                    ) : (
                      <span>N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Componente de Paginação */}
        <PaginationComponent links={cars?.links ?? []} />
      </div>

      {/* Diálogo "Ver Mais" */}
      <Dialog open={isViewMoreDialogOpen} onOpenChange={setIsViewMoreDialogOpen}>
        <DialogContent className="max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>Detalhes do Carro</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[80vh] overflow-y-auto p-2 bg-[#002b36] rounded-md">
            {selectedCarApiPlate ? (
                <JSONTree data={selectedCarApiPlate}/>
            ) : (
              <p>Carregando...</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={handleCloseViewMore} variant="secondary">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo "Adicionar Carro" */}
      <Dialog open={isAddCarDialogOpen} onOpenChange={setIsAddCarDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Carro</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-left text-sm font-medium text-gray-700">
                Placa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plate"
                value={data.plate}
                onChange={e => setData('plate', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${
                  errors.plate ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                required
              />
              {errors.plate && <p className="mt-1 text-sm text-red-500">{errors.plate}</p>}
            </div>

            <div>
              <label className="block text-left text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-left text-sm font-medium text-gray-700">
                Modelo
              </label>
              <input
                type="text"
                name="model"
                value={data.model}
                onChange={e => setData('model', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${
                  errors.model ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
            </div>

            <div>
              <label className="block text-left text-sm font-medium text-gray-700">
                Ano
              </label>
              <input
                type="number"
                name="year"
                value={data.year}
                onChange={e => setData('year', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                min="1886"
                max={new Date().getFullYear() + 1}
              />
              {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-left text-sm font-medium text-gray-700">
                Cor
              </label>
              <input
                type="text"
                name="color"
                value={data.color}
                onChange={e => setData('color', e.target.value)}
                className={`mt-1 block w-full rounded-md border ${
                  errors.color ? 'border-red-500' : 'border-gray-300'
                } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              />
              {errors.color && <p className="mt-1 text-sm text-red-500">{errors.color}</p>}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={handleCloseAddCar} variant="secondary">
                Cancelar
              </Button>
              <Button type="submit" variant="default" disabled={processing}>
                {processing ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exibir mensagem de sucesso se houver */}
      {successMessage && (
        <div className="fixed top-4 right-4">
          <div className="bg-green-500 text-white px-4 py-2 rounded">
            {successMessage}
          </div>
        </div>
      )}
    </>
  );
};

CarsPage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true} />;

export default CarsPage;
