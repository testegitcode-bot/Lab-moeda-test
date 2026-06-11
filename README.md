<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# 🛠️ Autofix - Gestão Inteligente de Oficinas 👨‍💻

> [!NOTE]
> Sistema integrado de automação operacional para oficinas mecânicas. **Foque na eliminação de gargalos na triagem, agendamento ágil e controle preciso do ciclo de vida de Ordens de Serviço e estoques correlacionados.**

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        Este <b>README.md</b> apresenta a documentação técnica estruturada e parametrizada para o sistema <b>Autofix</b>, ideal para servir como referência acadêmica e profissional em engenharia e arquitetura de software. Ele reúne as <i>seções essenciais</i> recomendadas pelo <a href="https://github.com/joaopauloaramuni">Prof. Dr. João Paulo Aramuni</a>, permitindo <i>organização clara</i>, <i>documentação eficiente</i> e <i>padronização</i> entre as camadas de desenvolvimento. O objetivo deste artefato é <b>facilitar o entendimento técnico da aplicação</b>, oferecendo um <i>guia completo</i> que inclui instruções de execução local, variáveis de ambiente, modelagem física e mapeamento objeto-relacional. Esse template ajuda a manter a conformidade do projeto de software, promovendo <i>clareza</i>, <i>reprodutibilidade</i> e <i>rastreabilidade profissional</i> de ponta a ponta.
      </div>
    </td>
    <td>
      <div>
        <img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo do Projeto" width="120px"/>
      </div>
    </td>
  </tr> 
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/releases) ![React](https://img.shields.io/badge/React-19.1.1-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7.1.2-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![Java](https://img.shields.io/badge/Java-17-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-3.9.9-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-007ec6?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-007ec6?style=for-the-badge&logo=docker&logoColor=white)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
  - [Exemplos de diagramas](#exemplos-de-diagramas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
     - [1 Back-end (Spring Boot)](#1-back-end-spring-boot)
     - [2 Front-end (React, Vite)](#2-front-end-react-vite)
  - [Instalação de Dependências](#-instalação-de-dependências)
    - [Front-end (React)](#front-end-react)
    - [Back-end (Spring Boot)](#back-end-spring-boot)
  - [Inicialização do Banco de Dados (PostgreSQL)](#-inicialização-do-banco-de-dados-postgresql)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
    - [Terminal 1: Back-end (Spring Boot)](#terminal-1-back-end-spring-boot)
    - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
    - [Execução Local Completa com Docker Compose](#-execução-local-completa-com-docker-compose-incluindo-banco-de-dados)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Autores](#-autores)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** [Acesse a Aplicação Web Autofix](https://autofix-frontend.vercel.app)
  > 💻 **Descrição:** Link para a interface SPA em ambiente de produção hospedada na plataforma Vercel.
* 📖 **Documentação da API:** [Acesse a especificação Swagger](http://localhost:8080/swagger-ui/index.html)
  > 📚 **Descrição:** Rota local para acesso à documentação técnica interativa dos endpoints REST via OpenAPI/Swagger UI.

---

## 📝 Sobre o Projeto
O **Autofix** nasceu da necessidade de modernizar o fluxo tradicional de atendimento e manutenção de oficinas automotivas. Em cenários comuns, a falta de sincronia entre os agendamentos na recepção, a formulação de laudos técnicos pelos mecânicos e a conferência física dos níveis de almoxarifado/estoque gera atrasos severos e retrabalho operacional.

Esta aplicação resolve esse ecossistema de dores ao integrar de forma síncrona quatro atores essenciais: o **Cliente** (que agenda serviços e aprova orçamentos online), o **Secretário** (responsável pelo check-in físico e encaminhamento ao pátio técnico), o **Mecânico** (que imputa laudos e consome insumos diretamente) e o **Gerente** (que monitora faturamentos e alertas críticos de subestoque). Desenvolvido no contexto puramente acadêmico da disciplina de Projeto de Software na PUC Minas, o sistema simula de forma fidedigna as regras rígidas de uma esteira logística e administrativa comercial.

---

## ✨ Funcionalidades Principais

- 🔐 **Módulo de Acesso e Segurança:** Autenticação robusta baseada em JWT com mapeamento polimórfico de privilégios para Clientes, Secretários, Mecânicos e Administradores.
- 🗓️ **Módulo de Atendimento Automatizado:** Solicitação de horários web por parte dos clientes com fluxo interno de triagem, check-in técnico e vinculação direta a um operador da oficina.
- 🛠️ **Módulo de Oficina (Orçamentos & O.S.):** Motor de cálculo automatizado para composição orçamentária (horas de mão de obra + precificação histórica de itens) e máquina de estados para controle estrito do ciclo de vida da Ordem de Serviço (O.S.).
- 📦 **Módulo de Retaguarda & Almoxarifado:** Sincronização intermodular síncrona que dispara o decremento físico de peças no estoque imediatamente após a finalização de uma O.S.
- 📊 **Monitoramento e Alertas:** Geração de notificações visuais administrativas caso as quantidades de insumos em estoque atinjam patamares inferiores ao mínimo configurado.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

* **Framework/Biblioteca:** React v18+
* **Linguagem/Superset:** JavaScript ES6+ / TypeScript
* **Estilização:** Tailwind CSS (Componentes responsivos e UI otimizada)
* **Build Tool:** Vite (Para bundling rápido e hot module replacement)
* **Ferramenta de Geração:** Bolt.new (Prototipagem rápida de telas)

### 🖥️ Back-end

* **Linguagem/Runtime:** Java 17 (JDK)
* **Framework:** Spring Boot 3.x (Web, Security, Data JPA)
* **Banco de Dados:** PostgreSQL 16 (SGBD Relacional)
* **ORM / Query Builder:** Hibernate / JPA (Mapeamento de herança via tabela de junção - *Joined*)
* **Autenticação:** JWT (JSON Web Tokens) e Spring Security

### ⚙️ Infraestrutura & DevOps

* **Containerização:** Docker e Docker Compose
* **Cloud & Hosting:** Vercel (Frontend)

---

## 🏗 Arquitetura

O sistema Autofix adota o padrão de arquitetura **Cliente-Servidor** dividido em camadas estritas. O backend implementa o padrão **MVC (Model-View-Controller)** exposto puramente como uma API RESTful. A lógica de negócio reside na camada de *Services*, que intermedia as requisições recebidas pelos *Controllers* e as consultas ao banco de dados gerenciadas pelos *Repositories* JPA.

O modelo de dados emprega conceitos avançados de orientação a objetos transpostos para o paradigma relacional. Para gerenciar os perfis de usuários, foi aplicada a estratégia **Joined Table** (Tabela de Junção), concentrando os dados globais de acesso na tabela pai (`tb_usuario`) e segregando comportamentos e atributos específicos nas tabelas filhas, garantindo a integridade polimórfica e normalização absoluta.

### Exemplos de diagramas

| Diagrama de Arquitetura | Detalhe da Arquitetura |
| :---: | :---: |
| **Visão Geral (Arquitetura C4)** | **Estrutura Dinâmica (Sequência)** |
| <img src="backend/src/main/resources/static/images/diagrama_arquitetura.png" alt="Visão Geral do Sistema" width="120px" height="120px"> | <img src="backend/src/main/resources/static/images/diagrama_sequencia.png" alt="Diagrama de Sequência por Ator" width="120px" height="120px"> |
| **Modelo de Dados (DER)** | **Ciclos de Vida (Estados)** |
| <img src="backend/src/main/resources/static/images/diagrama_der.png" alt="Diagrama de Entidade-Relacionamento" width="120px" height="120px"> | <img src="backend/src/main/resources/static/images/diagrama_estados.png" alt="Ciclo de Vida da Ordem de Serviço" width="120px" height="120px"> |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* **Java JDK:** Versão **17** ou superior instalado localmente.
* **Node.js:** Versão LTS (v18.x ou superior).
* **Docker & Docker Compose** instalado e rodando.

---

### 🔑 Variáveis de Ambiente

#### 1 Back-end (Spring Boot)
As configurações podem ser definidas diretamente no arquivo `backend/src/main/resources/application.yml` ou passadas como variáveis de ambiente no container:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SERVER_PORT` | Porta de escuta da API Java | `8080` |
| `SPRING_DATASOURCE_URL` | URL de conexão JDBC PostgreSQL | `jdbc:postgresql://localhost:5432/autofix` |
| `SPRING_DATASOURCE_USERNAME` | Administrador do Banco de Dados | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Senha de acesso ao banco | `senha-segura-123` |

#### 2 Front-end (React, Vite)
Crie um arquivo **`.env.local`** dentro da pasta `/frontend`:

```properties
VITE_API_URL=http://localhost:8080/api

```
####📦 Instalação de Dependências


    Clone o Repositório:

Bash

git clone [https://github.com/seu-usuario/autofix.git](https://github.com/seu-usuario/autofix.git)
cd autofix

Front-end (React)
Bash

cd frontend
npm install
cd ..

Back-end (Spring Boot)
Bash

cd backend
./mvnw clean install
cd ..

####💾 Inicialização do Banco de Dados (PostgreSQL)

Se optar por rodar o SGBD isoladamente sem o docker-compose unificado, suba a imagem oficial do PostgreSQL 16 na porta padrão:
Bash

docker run --name autofix_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=senha-segura-123 -e POSTGRES_DB=autofix -p 5432:5432 -d postgres:16

    Nota: As migrações, tabelas e chaves estrangeiras serão geradas automaticamente pelo Hibernate ao iniciar a API, através da propriedade ddl-auto: update configurada em ambiente de desenvolvimento.

#### ⚡ Como Executar a Aplicação
Terminal 1: Back-end (Spring Boot)
Bash

cd backend
./mvnw spring-boot:run

#### 🚀 API disponível em http://localhost:8080.
Terminal 2: Front-end (React, Vite)
Bash

cd frontend
npm run dev

#### 🎨 Interface web disponível em http://localhost:5173.
#### 🐳 Execução Local Completa com Docker Compose

Para orquestrar e rodar a aplicação full-stack de forma automática (Interface + API + Banco de Dados), execute o comando abaixo na pasta raiz do projeto:
Bash

docker-compose up --build -d

    O parâmetro --build compila os códigos do React e o JAR do Spring Boot em suas respectivas imagens.

    O parâmetro -d libera o terminal, rodando os containers em segundo plano.

Para encerrar o ambiente e destruir os containers criados, execute:
Bash

docker-compose down

#### 🚀 Deploy

    Build dos Artefatos:

Bash

# Compilar e empacotar frontend para arquivos estáticos (/dist)
cd frontend && npm run build && cd ..

# Gerar o executável JAR do Spring Boot
cd backend && ./mvnw clean package && cd ..

    Execução Manual do Build de Produção:

Bash

# Inicializar API RESTful compilada
java -jar backend/target/autofix-0.0.1-SNAPSHOT.jar

# Servir a pasta estática gerada do frontend
npm install -g serve
serve -s frontend/dist

#### 📂 Estrutura de Pastas
```
.
├── docker-compose.yml           # 🐳 Orquestração dos containers (front, back e db).
├── README.md                    # 📘 Documentação principal do projeto (Template Prof. Aramuni).
│
├── /frontend                    # 📁 Aplicação Front-end React
│   ├── /public                  # 📂 Ícones e index.html.
│   ├── /src                     # 📂 Código-fonte React
│   │   ├── /components          # 🧱 Componentes de interface (UI).
│   │   ├── /pages               # 📄 Páginas de fluxo (Dashboard, Agendamento, OS).
│   │   └── /services            # 🔌 Chamadas HTTP e integração com a API.
│   └── package.json             # 📦 Dependências do Node.js.
│
└── /backend                     # 📁 Aplicação Back-end Spring Boot
    ├── /src/main/java           # 📂 Estrutura de classes Java
    │   └── /com/autofix/app
    │       ├── /controller      # 🎮 Endpoints REST expostos.
    │       ├── /service         # ⚙️ Regras e validações lógicas de negócio.
    │       ├── /repository      # 🗄️ Interfaces JPA para acesso ao PostgreSQL.
    │       ├── /model           # 🧬 Entidades de persistência (Tabelas e herança).
    │       └── /dto             # ✉️ Objetos de transferência de dados das requisições.
    ├── /src/main/resources      # 📂 Recursos e propriedades
    │   └── application.yml      # ⚙️ Configuração ativa do banco de dados e Hibernate.
    └── pom.xml                  # 🛠️ Configurações de build do Maven.
```

#### 💻 Exemplo de Saída no Terminal (Módulo de Oficina)

Para validar a integridade da API do Autofix de forma isolada, pode-se realizar chamadas diretas via CLI utilizando curl:
Bash

# Requisição síncrona enviada pelo mecânico para registrar um diagnóstico veicular
curl -X POST http://localhost:8080/api/diagnosticos \
  -H "Authorization: Bearer <seu_token_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"veiculoId": 1, "relatoTecnico": "Troca de pastilhas de freio e discos dianteiros necessários."}'

Resposta esperada do servidor (Código HTTP 201 Created):
JSON

{
  "id": 42,
  "veiculoId": 1,
  "statusVeiculo": "AGUARDANDO_ORCAMENTO",
  "dataRegistro": "2026-06-10T22:43:00Z",
  "mensagem": "Diagnóstico inserido com sucesso no banco de dados relacional."
}

#### 👥 Autores

    Mateus Azevedo Araújo - Desenvolvedor e Arquiteto de Software - GitHub


⚖️ Licença

Este projeto está sob a licença MIT - consulte o arquivo LICENSE para mais detalhes.
