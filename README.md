# 🏷️ Sistema de Moeda Estudantil

Sistema web desenvolvido para gerenciar a moeda virtual, com o intuito de estimular o reconhecimento do mérito estudantil.
O projeto está sendo desenvolvido como parte da disciplina **Laboratório de Desenvolvimento de Software**.

---

## 🚧 Status do Projeto

<div align="center">

![Status](https://img.shields.io/badge/STATUS-EM%20DESENVOLVIMENTO-yellow?style=for-the-badge)
![Versão](https://img.shields.io/badge/VERS%C3%83O-1.0-blue?style=for-the-badge)
![Licença](https://img.shields.io/badge/LICEN%C3%87A-MIT-green?style=for-the-badge)
[![GitHub repo size](https://img.shields.io/github/repo-size/Mateus7799/Lab-Dev-sistema-moeda-estudantil?style=for-the-badge)](https://github.com/Mateus7799/Lab-Dev-sistema-moeda-estudantil.git)

</div>

<div align="center">

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-%23FF6600.svg?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📚 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Principais Características](#principais-características)
- [Deploy](#-deploy)
- [Diagramas](#diagramas)
- [Casos de Uso](#casos-de-uso)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Autores](#autores)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)

---

## 📝 Sobre o Projeto

Este projeto consiste no desenvolvimento de um sistema web para gerenciamento de uma moeda virtual, com o intuito de estimular o reconhecimento do mérito estudantil.
O sistema foi projetado com foco em organização, modularidade e clareza estrutural, utilizando conceitos de engenharia de software como modelagem UML, separação de responsabilidades e planejamento orientado a boas práticas de desenvolvimento.

Este projeto está sendo desenvolvido como parte da disciplina **Laboratório de Desenvolvimento de Software**, com o objetivo de aplicar na prática os conceitos estudados ao longo do curso.

---

## 📌 Principais Características

- **Arquitetura Full Stack:** Frontend robusto em React e backend escalável com Spring Boot.
- **Comunicação Segura:** Integração via API REST utilizando Axios e configurações de segurança de CORS.
- **Persistência Confiável:** Modelagem e mapeamento relacional robusto utilizando Spring Data JPA e banco de dados PostgreSQL.
- **Processamento Assíncrono:** Arquitetura orientada a eventos utilizando RabbitMQ para garantir resgates de vantagens sem travamento da UI e com alta consistência.
- **Ambiente Isolado:** Containerização completa da aplicação e banco de dados via Docker e Docker Compose, facilitando o deploy e execução.

---

## 🌐 Deploy

A aplicação está disponível nos seguintes ambientes:

| Serviço | URL |
|---------|-----|
| 🔵 Frontend (Vercel) | [lab-dev-sistema-moeda-estudantil.vercel.app](https://lab-dev-sistema-moeda-estudantil.vercel.app/) |
| 🟢 Backend (Render) | [lab-dev-sistema-moeda-estudantil-zkca.onrender.com](https://lab-dev-sistema-moeda-estudantil-zkca.onrender.com) |
| 🐘 Banco de Dados (Neon.tech) | PostgreSQL hospedado na Neon.tech |

> ⚠️ **Atenção:** O backend está hospedado no plano gratuito do Render. Após períodos de inatividade, pode haver uma demora de até 1 minuto para a primeira resposta enquanto o serviço é reiniciado.

---

## 📷 Diagramas

### Diagrama de Casos de Uso
![Casos de Uso](Documentos/Diagramas/Imagens/Diagrama-de-Casos-de-Uso-v3.png)

### Diagrama de Classes
![Classes](Documentos/Diagramas/Imagens/Diagrama-de-classes.png)

### Diagrama de Componentes
![Componentes](Documentos/Diagramas/Imagens/diagrama-componentes.png)

### Modelo ER
![Modelo ER](Documentos/Diagramas/Imagens/Modelo-ER.png)

### Implantação
![Implantação](Documentos/Diagramas/Imagens/Implantacao.png)

### Comunicação
![Comunicação](Documentos/Diagramas/Imagens/Comunicacao.png)

---

## 🎬 Casos de Uso (Diagramas de Sequência)

### Geral
![Geral](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-Geral.png)

### UC01 - Cadastrar Aluno
![UC01](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC01.png)

### UC02 - Cadastrar Empresa Parceira
![UC02](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC02.png)

### UC03 - Login / Autenticação
![UC03](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC03.png)

### UC04 - Consultar Extrato (Aluno)
![UC04](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC04.png)

### UC05 - Enviar Moedas (Professor para Aluno)
![UC05](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC05.png)

### UC06 - Cadastrar Vantagem (Empresa)
![UC06](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC06.png)

### UC07 - Visualizar Vantagens e Cupons Resgatados (Aluno)
![UC07](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC07.png)

### UC08 - Resgatar Vantagem (Processamento Assíncrono)
![UC08](Documentos/Diagramas/Imagens/Diagrama-de-Sequencia-UC08.png)

---

## ✨ Funcionalidades Principais

- Cadastro e autenticação de usuários
- Gerenciamento de alunos, instituições e empresas parceiras
- Controle de vantagens e benefícios disponíveis
- Dashboard com informações e funcionalidades específicas por perfil de usuário

---

## 👨‍💻 Autores

- Arthur Modesto Couto
- Bernardo Carvalho Denucci Mercado
- Mateus Azevedo Araújo
- Matheus Dias Mendes

---

## 📁 Estrutura do Projeto

```
Lab-Dev-sistema-moeda-estudantil/
│
├── Codigo/
│   │
│   ├── backend/
│   │   ├── pom.xml
│   │   ├── .gitignore
│   │   ├── data/
│   │   │   └── moeda_db.mv.db
│   │   │
│   │   ├── src/main/
│   │   │   ├── java/
│   │   │   │   └── com/sistemamoedaestudantil/
│   │   │   │       ├── config/
│   │   │   │       │   └── CorsConfig.java
│   │   │   │       │
│   │   │   │       ├── controller/
│   │   │   │       │   ├── AuthController.java
│   │   │   │       │   ├── CadastroController.java
│   │   │   │       │   ├── InstituicaoController.java
│   │   │   │       │   └── VantagemController.java
│   │   │   │       │
│   │   │   │       ├── dto/
│   │   │   │       │   ├── request/
│   │   │   │       │   │   ├── CadastroAlunoRequest.java
│   │   │   │       │   │   ├── CadastroEmpresaRequest.java
│   │   │   │       │   │   ├── LoginRequest.java
│   │   │   │       │   │   └── VantagemRequest.java
│   │   │   │       │   │
│   │   │   │       │   └── response/
│   │   │   │       │       ├── UsuarioResponse.java
│   │   │   │       │       └── VantagemResponse.java
│   │   │   │       │
│   │   │   │       ├── model/
│   │   │   │       │   ├── Aluno.java
│   │   │   │       │   ├── EmpresaParceira.java
│   │   │   │       │   ├── Instituicao.java
│   │   │   │       │   └── Vantagem.java
│   │   │   │       │
│   │   │   │       ├── repository/
│   │   │   │       │   ├── AlunoRepository.java
│   │   │   │       │   ├── EmpresaRepository.java
│   │   │   │       │   ├── InstituicaoRepository.java
│   │   │   │       │   └── VantagemRepository.java
│   │   │   │       │
│   │   │   │       ├── service/
│   │   │   │       │   ├── AuthService.java
│   │   │   │       │   ├── CadastroService.java
│   │   │   │       │   ├── InstituicaoService.java
│   │   │   │       │   └── VantagemService.java
│   │   │   │       │
│   │   │   │       └── SistemaMoedaEstudantilApplication.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   │
│   │   └── target/                        
│   │
│   └── frontend/
│       ├── package.json
│       ├── package-lock.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── eslint.config.js
│       ├── postcss.config.js
│       ├── index.html
│       ├── .gitignore
│       │
│       ├── src/
│       │   ├── main.tsx                     (entry point React)
│       │   ├── App.tsx                      (rotas principais)
│       │   ├── App.css
│       │   ├── index.css
│       │   │
│       │   ├── assets/
│       │   │
│       │   ├── components/
│       │   │   ├── Navbar.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── CardDashboard.tsx
│       │   │   └── FormularioCadastro.tsx
│       │   │
│       │   ├── context/
│       │   │   └── AuthContext.tsx
│       │   │
│       │   ├── services/
│       │   │   ├── api.ts
│       │   │   ├── authService.ts
│       │   │   ├── alunoService.ts
│       │   │   ├── instituicaoService.ts
│       │   │   └── vantagemService.ts
│       │   │
│       │   ├── types/
│       │   │   └── index.ts
│       │   │
│       │   └── pages/
│       │       ├── LoginPage.tsx
│       │       ├── CadastroAlunoPage.tsx
│       │       ├── DashboardProfessorPage.tsx
│       │       └── DashboardEmpresaPage.tsx
│       │
│       └── dist/                            (build - ignorado)
│
├── docker-compose.yml
├── COMO_EXECUTAR.md
└── README.md


```

---

# 🚀 Como Executar

## Frontend

1. Acesse a pasta do frontend:

```bash
cd Codigo/frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto:

```bash
npm run dev
```

4. O frontend estará disponível em:

```txt
http://localhost:5173
```

---

## Backend

1. Acesse a pasta do backend:

```bash
cd Codigo/backend
```

2. Execute o projeto Spring Boot:

### Linux/Mac

```bash
./mvnw spring-boot:run
```

### Windows PowerShell

```powershell
mvnw spring-boot:run
```

Ou, caso tenha Maven instalado globalmente:

```bash
mvn spring-boot:run
```

3. O backend estará disponível em:

```txt
http://localhost:8080
```

---

## Docker

Na pasta `Codigo` execute:

```bash
docker-compose up --build
```

Para executar em segundo plano:

```bash
docker-compose up -d
```

Para encerrar os containers:

```bash
docker-compose down
```

---

# 🛠️ Tecnologias Utilizadas

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- Spring AMQP (RabbitMQ)

## Banco de Dados
- PostgreSQL (Neon.tech)

## DevOps
- Docker
- Docker Compose
- Vercel (Frontend)
- Render (Backend)
