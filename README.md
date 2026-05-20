# 💻 ERP Estoque – Frontend

Frontend do sistema ERP de estoque desenvolvido em **Vue 3**, consumindo uma API REST desacoplada em Laravel.

O sistema permite:

- Cadastro de produtos
- Registro de compras
- Registro de vendas
- Histórico operacional
- Visualização de estoque
- Cálculo de lucro estimado

---

# 🏗️ Arquitetura

O frontend consome uma API REST desacoplada.

```txt
Vue 3
↓ Axios HTTP
Laravel API
↓
MySQL
```

---

# 🚀 Tecnologias

- Vue 3
- Vite
- Bootstrap 5
- Axios
- Vue Router
- SweetAlert2
- Docker

---

# ⚙️ Como Rodar

## 1. Subir containers

```bash
docker compose up -d --build
```

---

## 2. Entrar no container frontend

```bash
docker exec -it erp_frontend sh
```

---

## 3. Instalar dependências

```bash
npm install
```

---

## 4. Rodar frontend

```bash
npm run dev -- --host
```

---

# 🌐 URL do Projeto

```txt
http://localhost:5173
```

---

# 🔌 API Esperada

Por padrão:

```txt
http://localhost:8000/api
```

Arquivo de configuração:

```txt
src/services/api.js
```

---

# 💻 Funcionalidades

## Produtos

- Cadastro
- Listagem
- Validação amigável

## Compras

- Cadastro dinâmico
- Múltiplos produtos
- Atualização automática de estoque
- Histórico de compras

## Vendas

- Seleção de produtos
- Preenchimento automático do preço sugerido
- Exibição de estoque disponível
- Total estimado
- Lucro estimado
- Validação de estoque
- Histórico de vendas

---

# 🎨 Interface

A interface foi construída utilizando:

```txt
Bootstrap 5
```

com foco em:

- Simplicidade
- Clareza visual
- Velocidade de entrega
- Boa experiência do usuário

Notificações:

```txt
SweetAlert2
```

---

# 📌 Decisões Técnicas

- Frontend desacoplado
- Axios centralizado
- Bootstrap 5 para produtividade
- SweetAlert2 para UX
- Vue Router para navegação

---

# 🔮 Melhorias Futuras

- Dashboard
- Filtros avançados
- Paginação
- Tema dark
- Exportação de relatórios

---

# 👨‍💻 Autor

Desenvolvido por **Rangel Dheo**.
