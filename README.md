# 🛠️ Autofix - Gestão Inteligente de Oficinas 👨‍💻

> Sistema integrado de automação operacional para oficinas mecânicas.  
> Foco na eliminação de gargalos na triagem, agendamento ágil e controle do ciclo de vida de Ordens de Serviço e estoques.

---

![PUC Minas](https://img.shields.io/badge/PUC_Minas-Engenharia_de_Software-red?style=for-the-badge&logo=bookstack&logoColor=white)
![Disciplina](https://img.shields.io/badge/Disciplina-Projeto_de_Software-orange?style=for-the-badge&logo=githubactions&logoColor=white)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-v1.0.0-blue?style=for-the-badge)

### Stack Tecnológica

#### Backend
![Java](https://img.shields.io/badge/Java-17-007ec6?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9.9-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)

#### Frontend
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

#### Infraestrutura & Dados
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-2.x-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Estatísticas do Repositório

![Tamanho do Repositório](https://img.shields.io/github/repo-size/seu-usuario/nome-do-repositorio?style=for-the-badge&logo=files&color=007ec6)
![Último Commit](https://img.shields.io/github/last-commit/seu-usuario/nome-do-repositorio?style=for-the-badge&logo=clockify&color=007ec6)
![Licença](https://img.shields.io/github/license/seu-usuario/nome-do-repositorio?style=for-the-badge&color=007ec6&logo=opensourceinitiative)

---

## 🚧 Status do Projeto
📌 Projeto acadêmico em desenvolvimento (PUC Minas)

---

## 📚 Índice

- [🔗 Links Úteis](#-links-úteis)
- [📝 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🏗 Arquitetura](#-arquitetura)
- [📊 Exemplos de Diagramas](#-exemplos-de-diagramas)
- [🔧 Instalação e Execução](#-instalação-e-execução)
- [🔑 Variáveis de Ambiente](#-variáveis-de-ambiente)
- [📦 Instalação de Dependências](#-instalação-de-dependências)
- [💾 Banco de Dados](#-banco-de-dados)
- [⚡ Execução](#-execução)
- [🐳 Docker](#-docker)
- [🚀 Deploy](#-deploy)
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)
- [🎥 Demonstração](#-demonstração)
- [🧪 Testes](#-testes)
- [📚 Documentações](#-documentações)
- [👥 Autores](#-autores)
- [🤝 Contribuição](#-contribuição)
- [🙏 Agradecimentos](#-agradecimentos)
- [⚖️ Licença](#-licença)

---

## 🔗 Links Úteis

- 🌐 Demo Online: Acesse a Aplicação Web Autofix  
- 📖 Documentação da API: Swagger  

---

## 📝 Sobre o Projeto

O Autofix foi idealizado para resolver problemas reais do fluxo operacional de oficinas mecânicas:

- Falta de sincronização entre setores  
- Retrabalho operacional  
- Erros de estoque  
- Atrasos no atendimento  

### 👥 Atores

- Cliente  
- Secretário  
- Mecânico  
- Gerente  

Projeto desenvolvido na **PUC Minas**.

---

## ✨ Funcionalidades Principais

- 🔐 Autenticação com JWT  
- 🗓️ Agendamento online  
- 🛠️ Gestão de O.S. e orçamentos  
- 📦 Controle automático de estoque  
- 📊 Alertas de estoque mínimo  

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
- React  
- TypeScript  
- Tailwind CSS  
- Vite  

### 🖥️ Back-end
- Java 17  
- Spring Boot  
- JPA / Hibernate  
- PostgreSQL  
- JWT  

### ⚙️ Infraestrutura
- Docker  
- Docker Compose  
- Vercel  

---

## 🏗 Arquitetura

O sistema segue o padrão **MVC (Model-View-Controller)**:

- Controller → recebe requisições  
- Service → regras de negócio  
- Repository → acesso ao banco  

### 🧬 Modelagem

- Herança com estratégia **JOINED**  
- Normalização de dados  

---

## 📊 Exemplos de Diagramas

- Diagrama de Arquitetura  
- Modelo C4  
- Diagramas de Sequência / Comunicação  
- DER (Modelo de Dados)  
- Diagrama de Estados  

---

## 🔧 Instalação e Execução

### ✅ Pré-requisitos

- Java 17+  
- Node.js 18+  
- Docker  

---

## 🔑 Variáveis de Ambiente

### Back-end

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/autofix
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=senha-segura-123
```

### Front-end

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 📦 Instalação de Dependências

```bash
git clone https://github.com/seu-usuario/autofix.git
cd autofix
```

### Front-end

```bash
cd frontend
npm install
cd ..
```

### Back-end

```bash
cd backend
./mvnw clean install
cd ..
```

---

## 💾 Banco de Dados

```bash
docker run --name autofix_db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=senha-segura-123 \
-e POSTGRES_DB=autofix \
-p 5432:5432 -d postgres:16
```

> ✅ As tabelas são criadas automaticamente via Hibernate (`ddl-auto: update`)

---

## ⚡ Execução

### Terminal 1 – Back-end

```bash
cd backend
./mvnw spring-boot:run
```

➡️ http://localhost:8080

### Terminal 2 – Front-end

```bash
cd frontend
npm run dev
```

➡️ http://localhost:5173

---

## 🐳 Docker

```bash
docker-compose up --build -d
```

Para parar:

```bash
docker-compose down
```

---

## 🚀 Deploy

```bash
cd frontend && npm run build
cd ..
cd backend && ./mvnw clean package
cd ..
```

---

## 📂 Estrutura de Pastas

```
.
├── docker-compose.yml
├── README.md
├── frontend
│   ├── src
│   └── public
└── backend
    ├── controller
    ├── service
    ├── repository
    ├── model
    └── dto
```

---

## 🎥 Demonstração

- Painel do Mecânico  
- Controle de Ordens de Serviço  

---

## 🧪 Testes

```bash
cd backend
./mvnw test
```

- Testes unitários (Mockito)  
- Testes de integração (JPA)  

---

## 📚 Documentações

- Spring Boot  
- React  
- Hibernate  
- PostgreSQL  

---

## 👥 Autores

- Mateus Azevedo Araújo  

---

## 🤝 Contribuição

1. Fork do projeto  
2. Criar branch (`git checkout -b feature/nome`)  
3. Commit (`git commit -m 'feat: nova funcionalidade'`)  
4. Push (`git push origin feature/nome`)  
5. Abrir Pull Request  

---

## 🙏 Agradecimentos

Ao Prof. Dr. João Paulo Aramuni pelo suporte acadêmico.

---

## ⚖️ Licença

MIT
``
