# API de Tasks

Uma API RESTful para gerenciamento de tarefas desenvolvida com Node.js e TypeScript.

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- Node.js
- TypeScript
- HTTP nativo do Node.js

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [url-do-seu-repositorio]
cd api-tasks
```

2. Instale as dependências:
```bash
npm install
```

## 🚀 Executando o projeto

Para executar o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```

O servidor iniciará na porta 3333 - acesse `http://localhost:3333`

### Scripts disponíveis

- `npm run dev` - Executa o servidor em modo de desenvolvimento com hot-reload
- `npm run build` - Compila o projeto TypeScript
- `npm start` - Executa o servidor em modo de produção

## 📌 Rotas da API

### Tarefas

#### GET /tasks
- **Descrição**: Lista todas as tarefas
- **Query Parameters**:
  - `search`: Filtra tarefas por título ou descrição
- **Resposta**: Array de tarefas

#### POST /tasks
- **Descrição**: Cria uma nova tarefa
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string"
  }
  ```
- **Resposta**: 201 Created

#### PUT /tasks/:id
- **Descrição**: Atualiza uma tarefa existente
- **Parâmetros**:
  - `id`: ID da tarefa
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string"
  }
  ```
- **Resposta**: 204 No Content

#### DELETE /tasks/:id
- **Descrição**: Remove uma tarefa
- **Parâmetros**:
  - `id`: ID da tarefa
- **Resposta**: 204 No Content

#### PATCH /tasks/:id/complete
- **Descrição**: Marca/Desmarca uma tarefa como concluída
- **Parâmetros**:
  - `id`: ID da tarefa
- **Resposta**: 204 No Content

#### POST /tasks/import
- **Descrição**: Importa tarefas a partir de um arquivo CSV
- **Body**:
  ```json
  {
    "file": "string" // Caminho do arquivo CSV
  }
  ```
- **Resposta**: 201 Created

### Códigos de Erro

- `400`: Requisição inválida (dados faltando ou formato incorreto)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## 🛠️ Estrutura do Projeto

```
src/
  ├── @types/       # Definições de tipos TypeScript
  ├── database/     # Camada de dados
  ├── middlewares/  # Middlewares da aplicação
  ├── models/       # Modelos de dados
  ├── utils/        # Utilitários
  ├── routes.ts     # Definição das rotas
  └── server.ts     # Configuração do servidor
```
