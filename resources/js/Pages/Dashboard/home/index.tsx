import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { CarFront, DollarSign, Clock, AlarmClockIcon as Alarm } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F']

const DashboardHome = ({ dashboard }: any) => {
  // Destructure data from the dashboard prop
  const {
    totalVagas,
    vagasOcupadas,
    receitaDoDia,
    valorHora,
    tempoParaFechar,
    ocupacaoPorHora,
    distribuicaoClientes,
    faturamentoMensal,
  } = dashboard

  // Prepare data for the charts
  const occupancyData = ocupacaoPorHora

  const clientTypeData = distribuicaoClientes

  const monthlyData = faturamentoMensal.map((item: any) => ({
    dia: item.dia,
    faturamento: parseFloat(item.faturamento),
    ocupacao: item.ocupacao,
  }))

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {/* Vagas Ocupadas Card */}
          <Card className="transition-all hover:shadow-xl cursor-default">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagas Ocupadas</CardTitle>
              <CarFront className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vagasOcupadas}</div>
              <p className="text-xs text-muted-foreground">de {totalVagas} vagas</p>
            </CardContent>
          </Card>
          {/* Receita do Dia Card */}
          <Card className="transition-all hover:shadow-xl cursor-default">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Dia</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {receitaDoDia.toFixed(2)}</div>
            </CardContent>
          </Card>
          {/* Valor da Hora Card */}
          <Card className="transition-all hover:shadow-xl cursor-default">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor da Hora</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {valorHora.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Atualizado hoje</p>
            </CardContent>
          </Card>
          {/* Tempo para Fechar Card */}
          <Card className="transition-all hover:shadow-xl cursor-default">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hora do Fechamento</CardTitle>
              <Alarm className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tempoParaFechar}</div>
              <p className="text-xs text-muted-foreground">Atualizado em tempo real</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
          {/* Ocupação ao Longo do Dia Chart */}
          <Card className="transition-all hover:shadow-xl cursor-default">
            <CardHeader>
              <CardTitle>Ocupação ao Longo do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ocupacao" fill="#8884d8" name="Vagas Ocupadas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Clientes Chart */}
          <Card className="transition-all hover:shadow-xl cursor-default">
            <CardHeader>
              <CardTitle>Distribuição de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {clientTypeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Faturamento e Ocupação Mensal Chart */}
        <Card className="mt-8 w-full transition-all hover:shadow-xl cursor-default">
          <CardHeader>
            <CardTitle>Faturamento e Ocupação Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="faturamento"
                  stroke="#8884d8"
                  name="Faturamento (R$)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ocupacao"
                  stroke="#82ca9d"
                  name="Ocupação"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

DashboardHome.layout = (page: any) => <AuthenticatedLayout children={page} showTitle={true} />

export default DashboardHome
