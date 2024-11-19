import ParticlesBackground from "@/components/ParticlesBackground"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Car, CreditCard, Gauge, MessageSquare, Settings, ShieldCheck } from 'lucide-react'

export default function ParklyHomepage() {
  return (
    <div className="flex flex-col min-h-screen bg-white/60">
        <ParticlesBackground className="z-[-1] opacity-40"/>
      <header className="!z-[99999] px-4 lg:px-6 h-14 flex items-center shadow-xl fixed w-full bg-white">
        <a className="flex items-center justify-center" href="#">
          <Car className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">Parkly</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#recursos">
            Recursos
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#escolha">
            Diferencial
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#contato">
            Contato
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#devs">
            Devs
          </a>
          <Separator orientation="vertical" className="h-6" />
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            <Button>Entrar</Button>
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolucione seu estacionamento com Parkly
                </h1>
                <p className="mx-auto max-w-[700px] text-primary-500 md:text-xl dark:text-gray-400">
                  Sistema de estacionamento open-source com cancela automática, reconhecimento de placas e muito mais.
                </p>
              </div>
              <div className="space-x-4">
                <Button>
                  Comece agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Saiba mais</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100/90 dark:bg-gray-800" id="recursos">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Recursos principais</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Cancela Automática</CardTitle>
                </CardHeader>
                <CardContent>
                  <Gauge className="h-12 w-12 mb-4" />
                  <p>Controle de entrada e saída eficiente com cancelas automáticas inteligentes.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reconhecimento de Placas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShieldCheck className="h-12 w-12 mb-4" />
                  <p>Identificação automática de veículos através do reconhecimento de placas.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Mensalistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreditCard className="h-12 w-12 mb-4" />
                  <p>Controle eficaz de clientes mensalistas e suas respectivas vagas.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Dashboards Personalizáveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Gauge className="h-12 w-12 mb-4" />
                  <p>Visualize dados importantes do seu estacionamento em tempo real.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Flexíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Settings className="h-12 w-12 mb-4" />
                  <p>Ajuste horários, valores e número de vagas conforme sua necessidade.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mensagens de Voz</CardTitle>
                </CardHeader>
                <CardContent>
                  <MessageSquare className="h-12 w-12 mb-4" />
                  <p>Cancelas com sistema de voz para mensagens personalizadas aos clientes.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white/60" id="escolha">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Por que escolher Parkly?</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center bg-white/60 rounded-lg">
                <ShieldCheck className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Segurança Aprimorada</h3>
                <p>Controle total sobre entradas e saídas, reduzindo riscos de fraudes e aumentando a segurança.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white/60 rounded-lg">
                <Gauge className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Eficiência Operacional</h3>
                <p>Automatize processos e reduza custos operacionais com nosso sistema inteligente.</p>
              </div>
              <div className="flex flex-col items-center text-center bg-white/60 rounded-lg">
                <CreditCard className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Gestão Financeira</h3>
                <p>Controle preciso de receitas e despesas, facilitando a administração do seu negócio.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground" id="contato">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pronto para revolucionar seu estacionamento?</h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Junte-se a nós e descubra como o Parkly pode transformar a gestão do seu estacionamento.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100/80 dark:bg-gray-800" id="devs">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Desenvolvedores Responsáveis</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {["Mateus Vieira G. Silva", "Vinicius Feitosa Amorim", "Bruno Thyerre S. Queiroz", "Júlio César S. Oliveira"].map((dev) => (
                <Card key={dev}>
                  <CardHeader>
                    <CardTitle className="text-center">{dev}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">Trabalho Acadêmico</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Este projeto foi desenvolvido como parte de um trabalho acadêmico para a UMC - Universidade de Mogi das Cruzes.
            </p>
          </div>
        </section>
      </main>
      <footer className="flex items-center py-3 justify-between w-full px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Parkly. Todos os direitos reservados.</p>
        <a  href="#">
            <Button variant="outline">Voltar ao Topo</Button>
        </a>
        <nav className="flex">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </a>          
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </a>
        </nav>
      </footer>
    </div>
  )
}