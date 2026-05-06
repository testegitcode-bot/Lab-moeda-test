# Como Executar o Sistema de Moeda Estudantil

## Pre-requisitos
- Java 17+
- Maven 3.8+
- Node.js 18+

---

## Backend (Spring Boot)

```bash
cd Codigo/backend
./mvnw spring-boot:run
```

O servidor inicia em: http://localhost:8080

- Console H2 (banco em memória visual): http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:file:./data/moeda_db`
  - User: `sa` | Password: (em branco)

**Credenciais do professor de teste:**
- E-mail: `professor@teste.com`
- Senha: `123456`
Aluno
-ricardo@gmail.com
-123456
Empresa
-
---

## Frontend (React + Vite)

```bash
cd Codigo/frontend
npm install
npm run dev
```

A aplicação abre em: http://localhost:5173

---

## Ordem de inicialização

1. Iniciar o Backend primeiro (`mvn spring-boot:run`)
2. Iniciar o Frontend (`npm run dev`)
3. Acessar http://localhost:5173

---

## Endpoints da API

| Método | Rota                          | Descrição                        |
|--------|-------------------------------|----------------------------------|
| POST   | /api/auth/login               | Login (retorna perfil do usuário)|
| POST   | /api/cadastro/aluno           | Cadastro de aluno                |
| POST   | /api/cadastro/empresa         | Cadastro de empresa parceira     |
| GET    | /api/instituicoes             | Lista instituições               |
| GET    | /api/vantagens/empresa/{id}   | Lista vantagens de uma empresa   |
| POST   | /api/vantagens/empresa/{id}   | Cria vantagem                    |
| PUT    | /api/vantagens/{id}           | Atualiza vantagem                |
| DELETE | /api/vantagens/{id}           | Remove vantagem                  |
