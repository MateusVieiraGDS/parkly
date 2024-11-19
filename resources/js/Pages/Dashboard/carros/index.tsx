// src/Pages/Dashboard/CarsPage.tsx

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import axios from "axios";
import route from 'ziggy-js'; // Importação correta do helper Ziggy
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

const CarsPage = ({ cars }: any) => {
  // Estados para o diálogo de "Ver Mais"
  const [isViewMoreDialogOpen, setIsViewMoreDialogOpen] = useState(false);
  const [selectedCarApiPlate, setSelectedCarApiPlate] = useState<any>(null);

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

  return (
    <>
      <div className="flex flex-col items-center gap-4 text-center w-full h-full">

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
    </>
  );
};

CarsPage.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true} />;

export default CarsPage;
