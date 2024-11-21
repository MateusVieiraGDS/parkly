formate meu readme para que fique bacana:






# **Parkly - Sistema de Gerenciamento de Estacionamento Automatizado**

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

---

## **Sobre o Laravel**
O Parkly é construído sobre o framework Laravel, que oferece um ambiente robusto para desenvolvimento de aplicações web. As principais funcionalidades do Laravel incluem:

- [Motor de rotas rápido e simples](https://laravel.com/docs/routing).
- [Container de injeção de dependências poderoso](https://laravel.com/docs/container).
- Back-ends múltiplos para [sessão](https://laravel.com/docs/session) e [cache](https://laravel.com/docs/cache).
- ORM [Eloquent](https://laravel.com/docs/eloquent) intuitivo.
- Migrações de banco de dados agnósticas.
- Processamento de filas [robusto e eficiente](https://laravel.com/docs/queues).

Para mais detalhes sobre o Laravel, visite a [documentação oficial](https://laravel.com/docs).

---

## **Configurando o Ollama**
O projeto suporta reconhecimento de placas utilizando Ollama. Para configurar o Ollama no ambiente, siga as instruções no [repositório oficial](https://ollama.ai).

Após a instalação, certifique-se de configurar corretamente os endpoints no ambiente Laravel para integrar com a fila de processamento.

O Modelo usado para o projeto é o llama3.2-vision

---


## API's de Terceiros usados (Opcional)

- Para buscar os dados das placas: https://apibrasil.com.br
- Para reconehcimento da placa via aws: https://aws.amazon.com/pt/rekognition/
- Para reconehcimento da placa via ALPR: https://platerecognizer.com


# Instruções de Uso do Projeto Parkly

## Passos para Configuração e Execução

### 1. Clone o Repositório
```bash
git clone git@github.com:MateusVieiraGDS/parkly.git
cd parkly
```

### 2. Instale o Composer
Certifique-se de ter o Composer instalado. Em seguida, execute:
```bash
composer install
```

### 3. Suba o Ambiente com Laravel Sail
Crie o arquivo `.env` e configure conforme necessário (ou use o `.env.example` como base):
```bash
cp .env.example .env
```

Suba os containers com Sail:
```bash
./vendor/bin/sail up -d
```

### 4. Instale Dependências do NPM
No bash do container da aplicação:
```bash
./vendor/bin/sail npm install
```

### 5. Suba o Ollama via Docker
Baixe e inicie o container do Ollama (verifique a documentação oficial para ajustar conforme necessário):
```bash
docker pull ollama/llama3.2-vision
docker run -d --name ollama -p 8080:8080 ollama/llama3.2-vision
```

### 6. Abra o Bash da Aplicação
Acesse o bash do container Laravel:
```bash
./vendor/bin/sail bash
```

### 7. Execute as Migrações
Dentro do container, execute:
```bash
php artisan migrate
```

### 8. Compile os Arquivos Frontend
Ainda dentro do container:
```bash
npm run build
```
Ou para desenvolvimento:
```bash
npm run dev
```

---

## Acesso ao Sistema
Seu projeto estará disponível em [http://localhost](http://localhost). 🎉

Certifique-se de configurar seu .env (Pode ser usado o comando `cp .env.example .env`), com as credencias necessários. 

Para configurar a key do projeto, `php artisan key:generate` pode ser usado.


# Explicação do Projeto Parkly

## Resumo

O Parkly é um sistema modular, completo e automatizado para gerenciamento de estacionamentos, que pode ser usado de maneira totalmente open source. Ele combina tecnologias modernas, integração com hardware e processamento assíncrono para garantir alta performance e eficiência. Com suporte para enriquecimento de dados de placas (opcional) e APIs externas para integração com CRMs e sistemas de monitoramento, o Parkly é ideal para pequenos e médios estacionamentos.

---

## Objetivo e Finalidade

O objetivo do Parkly é simplificar o gerenciamento de estacionamentos, automatizando processos como entrada, saída e controle de ocupação. Ele também oferece a flexibilidade de integrar funcionalidades avançadas, como enriquecimento de dados das placas dos veículos e APIs externas para monitoramento em tempo real.

---

## Tecnologias Utilizadas

O projeto utiliza tecnologias modernas e robustas, como:

- **Backend:**
  - Laravel, Inertia.js, TailwindCSS, ShadcnUI para interface administrativa.
  - Redis para filas de processamento.

- **Reconhecimento de Placas:**
  - Ollama com Llama3.2-Vision (opção open source), AWS Rekognition, ou ALPR para reconhecimento e extração das placas.
  - API externa para enriquecimento opcional dos dados das placas (modelo, cor, ano, etc.).

- **Hardware:**
  - ESP8266 para controle das cancelas e interação com módulos Python.

- **Armazenamento e Performance:**
  - Sistema de caching inteligente para armazenar placas já consultadas, criando um banco de dados local.
  - Gerenciamento de filas assíncronas com Redis para realizar tarefas em background.

---

## Como Funciona o Sistema

### Fluxo de Entrada

1. **Interação ESP8266 com Python:**
   - Um botão ou sensor no ESP8266 detecta a chegada de um veículo e envia um sinal via serial para o módulo Python responsável pela entrada.
   - O módulo Python captura a imagem do veículo usando a câmera conectada.

2. **Captura da Imagem:**
   - O módulo Python salva a imagem capturada e envia para o backend via API, junto com o cabeçalho `X-API-KEY` para autenticação.

3. **Processamento no Backend:**
   - A imagem é processada utilizando tecnologias de reconhecimento de placas, como Ollama, AWS Rekognition ou ALPR.
   - Caso a placa ainda não esteja armazenada, o sistema pode enriquecer os dados consultando uma API externa (opcional).
   - A placa, os dados enriquecidos e a associação com o cliente (se for mensalista) são processados em filas de background, garantindo que o cliente não fique esperando.

4. **Geração de Ticket:**
   - O backend cria um ticket contendo informações como o horário de entrada e um QR Code.
   - O QR Code é enviado de volta para o módulo Python.

5. **Interação Python com ESP8266:**
   - O módulo Python imprime o ticket com QR Code e envia o comando para o ESP8266 abrir a cancela.
   - O ESP8266 abre a cancela, aguarda o veículo passar e automaticamente fecha após um tempo configurado.

---

### Fluxo de Saída

1. **Leitura do QR Code:**
   - O módulo Python responsável pela saída lê o QR Code apresentado pelo motorista.
   - O código é enviado ao backend via API para validação.

2. **Validação do Ticket:**
   - O backend verifica o status do ticket: se está pago ou, no caso de mensalistas, se está ativo.
   - Se o ticket for válido, o backend registra o horário de saída do veículo.

3. **Interação Python com ESP8266:**
   - Após validação positiva, o módulo Python envia o comando para o ESP8266 abrir a cancela.
   - O ESP8266 fecha a cancela automaticamente após o veículo passar.

---

## Funcionalidades do Sistema

1. **Dashboard Administrativo:**
   - Controle total do estacionamento, com dados como ocupação em tempo real, receita diária e histórico de movimentação.

2. **Gestão de Clientes:**
   - Cadastro de clientes mensalistas e associação de veículos.

3. **Gestão de Tickets:**
   - Criação, validação e baixa de tickets.
   - Suporte ao pagamento e gestão de pendências.

4. **Armazenamento Inteligente de Placas:**
   - Placas consultadas são armazenadas no banco de dados local, eliminando chamadas repetitivas à API externa.

5. **APIs Externas para Integração:**
   - **Endpoint de Movimentação:** Disponibiliza informações sobre os veículos que entraram e saíram, ideal para integração com sistemas de CRM.
   - **Endpoint de Monitoramento:** Exibe placas, horários e status, possibilitando o uso por autoridades ou sistemas de segurança.

6. **Configurações Personalizáveis:**
   - Ajustes de horário de funcionamento, capacidade de vagas e valores de cobrança.

---

## Diferenciais e Benefícios

1. **Open Source:**
   - O sistema pode ser usado de forma totalmente open source ao optar por Ollama e Llama3.2-Vision no reconhecimento de placas.
   - Enriquecimento de dados é opcional, permitindo reduzir custos operacionais.

2. **Alta Performance com Filas:**
   - Reconhecimento e enriquecimento de dados são feitos em background, garantindo que o cliente tenha uma experiência rápida e fluida.

3. **Banco de Dados Próprio de Placas:**
   - Criação de um banco local com dados de placas já consultadas, evitando chamadas desnecessárias à API e reduzindo custos.

4. **Integração de Hardware:**
   - Controle de cancelas com ESP8266, interação via Python e integração perfeita com o backend.

5. **APIs para Expansão:**
   - O sistema oferece endpoints para uso externo, tornando-o ideal para integração com outros sistemas ou como uma plataforma de monitoramento.

---

## Conclusão

O Parkly é mais do que apenas um sistema de gerenciamento de estacionamentos; é uma solução completa, modular e extensível. Ele combina automação de hardware, eficiência de software e flexibilidade para atender às necessidades de diferentes tipos de estabelecimentos. Seja como um sistema open source acessível ou uma plataforma integrada com APIs avançadas, o Parkly se destaca como uma escolha inovadora e eficiente.


# Documentação da API

## Visão Geral

A API possui quatro rotas principais divididas em dois grupos:
1. **Rotas internas**: Utilizadas pelo sistema do estacionamento para gerenciar check-ins e check-outs.
2. **Rotas externas**: Disponibilizadas para integrações externas, como delegacias ou sistemas de segurança.

---

## Requisitos

- Todas as rotas exigem o cabeçalho `X-API-KEY` para autenticação.
- O cabeçalho deve ser incluído em todas as requisições:
  ```
  X-API-KEY: sua-chave-api
  ```

---

## Rotas Internas

### 1. Check-in

**Endpoint:**  
`POST /checkin`

**Descrição:**  
Realiza o check-in de veículos no estacionamento.

**Parâmetros de Requisição:**

| Parâmetro | Tipo  | Obrigatório | Descrição                                      |
|-----------|-------|-------------|-----------------------------------------------|
| image     | file  | Sim         | Imagem do veículo com a placa visível.        |

**Respostas:**

- **201 Created**  
  Check-in realizado com sucesso.
  ```json
  {
      "success": true,
      "message": "Olá! Bem-vindo ao Parkly! Aguarde a impressão do seu ticket!",
      "ticket_code": "código-criptografado",
      "ticket_number": 123,
      "entry_time": "20/11/2024 15:30"
  }
  ```

- **422 Unprocessable Entity**  
  Caso falte algum parâmetro ou o estacionamento esteja lotado.
  ```json
  {
      "error": "Você deve fornecer a imagem do veículo com a placa visível."
  }
  ```

---

### 2. Check-out

**Endpoint:**  
`POST /checkout`

**Descrição:**  
Realiza o check-out de veículos no estacionamento.

**Parâmetros de Requisição:**

| Parâmetro | Tipo   | Obrigatório | Descrição                                |
|-----------|--------|-------------|-----------------------------------------|
| data      | string | Sim         | Código criptografado do ticket.         |

**Respostas:**

- **200 OK**  
  Check-out realizado com sucesso.
  ```json
  {
      "success": true,
      "message": "Agradecemos sua visita, boa viagem!"
  }
  ```

- **422 Unprocessable Entity**  
  Caso o ticket esteja em aberto ou já tenha sido fechado.
  ```json
  {
      "success": false,
      "message": "Esse ticket está em aberto... por favor dirija-se a um dos caixas."
  }
  ```

---

## Rotas Externas

### 3. Obter Tickets

**Endpoint:**  
`GET /getTickets`

**Descrição:**  
Retorna tickets gerados nos últimos 7 dias em relação à data fornecida.

**Parâmetros de Requisição:**

| Parâmetro | Tipo   | Obrigatório | Descrição                               |
|-----------|--------|-------------|----------------------------------------|
| date      | string | Sim         | Data base no formato YYYY-MM-DD.       |

**Respostas:**

- **200 OK**  
  Lista de tickets.
  ```json
  {
      "tickets": [
          {
              "id": 1,
              "valor_hora": "10.00",
              "car_id": 1,
              "created_at": "2024-11-15T20:28:45.000000Z",
              "updated_at": "2024-11-15T20:33:02.000000Z",
              "saida": null,
              "client": {
                  "id": 1,
                  "name": "John Doe"
              },
              "car": {
                  "id": 1,
                  "plate": "ABC1234"
              }
          }
      ]
  }
  ```

- **422 Unprocessable Entity**  
  Caso o parâmetro `date` seja inválido ou ausente.
  ```json
  {
      "errors": {
          "date": ["O campo data é obrigatório."]
      }
  }
  ```

---

### 4. Tickets para Segurança

**Endpoint:**  
`GET /getTicketsForSecurity`

**Descrição:**  
Retorna tickets nos últimos 7 dias para rastreabilidade, filtrando somente veículos com carros associados.

**Parâmetros de Requisição:**

| Parâmetro | Tipo   | Obrigatório | Descrição                               |
|-----------|--------|-------------|----------------------------------------|
| date      | string | Sim         | Data base no formato YYYY-MM-DD.       |

**Respostas:**

- **200 OK**  
  Lista de tickets filtrados para segurança.
  ```json
  {
      "tickets": [
          {
              "id": 1,
              "created_at": "2024-11-15T20:28:45.000000Z",
              "saida": "2024-11-15T20:42:45.000000Z",
              "car": {
                  "id": 1,
                  "plate": "ABC1234"
              }
          }
      ]
  }
  ```

- **422 Unprocessable Entity**  
  Caso o parâmetro `date` seja inválido ou ausente.
  ```json
  {
      "errors": {
          "date": ["O campo data é obrigatório."]
      }
  }
  ```

---

## Considerações

- **Segurança:** Todas as rotas exigem autenticação via `X-API-KEY`.
- **Headers Exigidos:**
  ```
  Content-Type: application/json
  X-API-KEY: sua-chave-api
  ```
- **Base URL:** A API está disponível em `http://localhost/api`.


---





# Documentação da API - Rotas Web

## Visão Geral

O sistema possui rotas para gerenciar usuários, veículos, mensalistas, pagamentos de tickets e configurações do estacionamento. Algumas rotas retornam JSON e outras utilizam o Inertia.js para controle da interface.

---

## Rotas Públicas

### 1. Página Inicial

**Endpoint:**  
`GET /`

**Descrição:**  
Redireciona para a página inicial do dashboard.

**Retorno:**  
Controlado via Inertia.js.

---

## Rotas Autenticadas

### 1. Perfil do Usuário

**Endpoints:**

- **`GET /profile`**  
  **Descrição:** Página para edição do perfil do usuário.  
  **Retorno:** Controlado via Inertia.js.

- **`PATCH /profile`**  
  **Descrição:** Atualiza as informações do perfil do usuário.  
  **Retorno:** Controlado via Inertia.js.

- **`DELETE /profile`**  
  **Descrição:** Exclui a conta do usuário autenticado.  
  **Retorno:** Controlado via Inertia.js.

---

## Rotas do Dashboard

### 1. Home do Dashboard

**Endpoint:**  
`GET /dashboard`

**Descrição:**  
Exibe o resumo das informações do estacionamento (vagas, receita, ocupação, etc.).

**Retorno:**  
Controlado via Inertia.js.

---

### 2. Saídas de Tickets

**Endpoints:**

- **`GET /dashboard/saidas`**  
  **Descrição:** Lista todos os tickets processados.  
  **Retorno:** Controlado via Inertia.js.

- **`GET /dashboard/saidas/{id}`**  
  **Descrição:** Retorna os dados de um ticket específico em formato JSON.  

  **Resposta de Sucesso:**
  ```json
  {
      "id": 1,
      "created_at": "2024-11-20T15:30:00",
      "saida": "2024-11-20T17:00:00",
      "valor_hora": 5,
      "client": {
          "name": "João da Silva",
          "telefone": "99999-9999"
      },
      "car": {
          "plate": "ABC1234",
          "model": "Toyota Corolla"
      }
  }
  ```

  **Erro (404):**
  ```json
  {
      "error": "Ticket não encontrado"
  }
  ```

---

### 3. Mensalistas

**Endpoints:**

- **`GET /dashboard/mensalistas`**  
  **Descrição:** Lista os mensalistas cadastrados.  
  **Retorno:** Controlado via Inertia.js.

- **`POST /dashboard/mensalistas/{clientId}/add-car`**  
  **Descrição:** Associa um carro a um mensalista.  

  **Parâmetros:**

  | Nome  | Tipo | Obrigatório | Descrição               |
  |-------|------|-------------|-------------------------|
  | carId | int  | Sim         | ID do carro a ser associado. |

  **Resposta de Sucesso:**
  ```json
  {
      "success": "Carro adicionado ao cliente com sucesso!"
  }
  ```

  **Erro (400):**
  ```json
  {
      "error": "Este carro já está associado a outro cliente."
  }
  ```

- **`GET /dashboard/mensalistas/get-cars`**  
  **Descrição:** Lista todos os carros disponíveis (não associados a clientes).  

  **Resposta de Sucesso:**
  ```json
  [
      {
          "id": 1,
          "plate": "XYZ5678",
          "model": "Honda Civic"
      },
      {
          "id": 2,
          "plate": "ABC1234",
          "model": "Ford Fiesta"
      }
  ]
  ```

- **`DELETE /dashboard/mensalistas/{clientId}/remove-car/{carId}`**  
  **Descrição:** Remove a associação de um carro com um cliente.  

  **Resposta de Sucesso:**
  ```json
  {
      "success": "Carro removido do cliente com sucesso!"
  }
  ```

  **Erro (400):**
  ```json
  {
      "error": "Este carro não está associado a este cliente."
  }
  ```

---

### 4. Carros

**Endpoints:**

- **`GET /dashboard/carros`**  
  **Descrição:** Lista os carros cadastrados.  
  **Retorno:** Controlado via Inertia.js.

- **`POST /dashboard/carros`**  
  **Descrição:** Cadastra um novo carro.  

  **Parâmetros:**

  | Nome   | Tipo   | Obrigatório | Descrição                      |
  |--------|--------|-------------|--------------------------------|
  | plate  | string | Sim         | Placa do carro.               |
  | name   | string | Não         | Nome do proprietário (opcional). |
  | model  | string | Não         | Modelo do carro.              |
  | year   | int    | Não         | Ano do carro.                 |
  | color  | string | Não         | Cor do carro.                 |

  **Resposta de Sucesso:**  
  Redireciona para a listagem com mensagem de sucesso.

---

### 5. Configurações do Estacionamento

**Endpoints:**

- **`GET /dashboard/configuracoes`**  
  **Descrição:** Lista todas as configurações do estacionamento.  
  **Retorno:** Controlado via Inertia.js.

- **`POST /dashboard/configuracoes`**  
  **Descrição:** Cadastra uma nova configuração.  
  **Retorno:** Controlado via Inertia.js.

- **`PATCH /dashboard/configuracoes/{id}`**  
  **Descrição:** Atualiza uma configuração existente.  
  **Retorno:** Controlado via Inertia.js.

- **`POST /dashboard/configuracoes/{id}/activate`**  
  **Descrição:** Ativa uma configuração e desativa as demais.  
  **Retorno:** Controlado via Inertia.js.

---

## **Licença**
Este projeto foi construído para um projeto de faculdade, por mais que utilize estretégias que possibilita a escalabilidade, para implementação em
produção, o código precisa ser refatorado em partes para a performace e robustez necessária.

Este repositório é open-source e licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

---