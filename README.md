# 🛠️ Autofix - Gestão Inteligente de Oficinas 👨‍💻

> Sistema integrado de automação operacional para oficinas mecânicas.  
> Foco na eliminação de gargalos na triagem, agendamento ágil e controle do ciclo de vida de Ordens de Serviço e estoques.

---

## 🚧 Status do Projeto
📌 Projeto acadêmico em desenvolvimento (PUC Minas)

---

## 📚 Índice

- 🔗 Links Úteis  
- 📝 Sobre o Projeto  
- ✨ Funcionalidades Principais  
- 🛠 Tecnologias Utilizadas  
- 🏗 Arquitetura  
- 📊 Exemplos de Diagramas  
- 🔧 Instalação e Execução  
- 🔑 Variáveis de Ambiente  
- 📦 Instalação de Dependências  
- 💾 Banco de Dados  
- ⚡ Execução  
- 🐳 Docker  
- 🚀 Deploy  
- 📂 Estrutura de Pastas  
- 🎥 Demonstração  
- 🧪 Testes  
- 📚 Documentações  
- 👥 Autores  
- 🤝 Contribuição  
- 🙏 Agradecimentos  
- ⚖️ Licença  

---

## 🔗 Links Úteis

- 🌐 Demo Online: Acesse a Aplicação Web Autofix  
- 📖 Documentação da API (Swagger)

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
- 📦 Controle de estoque automático  
- 📊 Alertas de estoque  

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
- React  
- TypeScript  
- Tailwind  
- Vite  

### 🖥️ Back-end
- Java 17  
- Spring Boot  
- JPA / Hibernate  
- PostgreSQL  
- JWT  

### ⚙️ Infraestrutura
- Docker  
- Vercel  

---

## 🏗 Arquitetura

Padrão MVC:

- Controller  
- Service  
- Repository  

Herança com estratégia **JOINED**.

---

## 📊 Exemplos de Diagramas

- Arquitetura  
- C4  
- Sequência / Comunicação  
- DER  
- Estados  

---

## 🔧 Instalação e Execução

### ✅ Pré-requisitos

- Java 17+  
- Node 18+  
- Docker  

---

## 🔑 Variáveis de Ambiente

### Back-end

```
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/autofix
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=senha-segura-123
```

### Front-end

```
VITE_API_URL=http://localhost:8080/api
```

---

## 📦 Instalação

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

---

## ⚡ Execução

### Back-end

```bash
cd backend
./mvnw spring-boot:run
```

### Front-end

```bash
cd frontend
npm run dev
```

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
cd backend && ./mvnw clean package
```

---

## 📂 Estrutura de Pastas

```
.
├── docker-compose.yml
├── README.md
├── frontend
└── backend
```

---

## 🎥 Demonstração

- Painel do Mecânico  
- Controle de O.S.  

---

## 🧪 Testes

```bash
cd backend
./mvnw test
```

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

1. Fork  
2. Branch  
3. Commit  
4. Push  
5. Pull Request  

---

## 🙏 Agradecimentos

Prof. Dr. João Paulo Aramuni  

---

## ⚖️ Licença

MIT
