<template>
  <div class="d-flex flex-column gap-4">
    <div class="card shadow-sm">
      <div class="card-header">
        <h4 class="mb-0">Registro de Venda</h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="registerSale">
          <div class="mb-4">
            <label class="form-label"> Cliente </label>

            <input
              v-model="form.cliente"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="table-responsive">
            <table class="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th width="120">Estoque</th>
                  <th width="140">Quantidade</th>
                  <th width="180">Preço Venda</th>
                  <th width="180">Subtotal</th>
                  <th width="100">Ações</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in form.produtos" :key="index">
                  <td>
                    <select
                      v-model="item.id"
                      class="form-select"
                      @change="onProductChange(item)"
                      required
                      :disabled="productsLoading"
                    >
                      <option value="">
                        {{
                          productsLoading
                            ? "Carregando produtos..."
                            : "Selecione"
                        }}
                      </option>

                      <option
                        v-for="product in products"
                        :key="product.id"
                        :value="product.id"
                      >
                        {{ product.nome }}
                      </option>
                    </select>
                  </td>

                  <td>
                    {{ getProduct(item.id)?.estoque ?? 0 }}
                  </td>

                  <td>
                    <input
                      v-model="item.quantidade"
                      type="number"
                      min="1"
                      class="form-control"
                    />
                  </td>

                  <td>
                    <input
                      v-model="item.preco_unitario"
                      type="number"
                      step="0.01"
                      min="0.01"
                      class="form-control"
                    />
                  </td>

                  <td>
                    R$
                    {{ calculateSubtotal(item).toFixed(2) }}
                  </td>

                  <td>
                    <button
                      type="button"
                      class="btn btn-danger w-100"
                      @click="removeProductRow(index)"
                    >
                      X
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="row mb-4">
            <div class="col-md-6">
              <div class="alert alert-info">
                <strong> Total Estimado: </strong>

                R$
                {{ totalEstimated.toFixed(2) }}
              </div>
            </div>

            <div class="col-md-6">
              <div class="alert alert-success">
                <strong> Lucro Estimado: </strong>

                R$
                {{ profitEstimated.toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button
              type="button"
              class="btn btn-secondary"
              @click="addProductRow"
            >
              + Adicionar Produto
            </button>

            <button
              type="submit"
              class="btn btn-primary ms-auto"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
              />

              {{ loading ? "Salvando..." : "Registrar Venda" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header">
        <h4 class="mb-0">Histórico de Vendas</h4>
      </div>

      <div class="table-responsive">
        <table class="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Produtos</th>
              <th>Total</th>
              <th>Lucro</th>
              <th>Status</th>
              <th>Data</th>
              <th width="140">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="tableLoading">
              <td colspan="8" class="text-center py-5">
                <div class="d-flex flex-column align-items-center gap-3">
                  <div class="spinner-border text-primary" role="status" />

                  <span class="text-muted"> Carregando histórico... </span>
                </div>
              </td>
            </tr>

            <tr v-else-if="!sales.length">
              <td colspan="8" class="text-center py-4">
                Nenhuma venda registrada
              </td>
            </tr>

            <tr v-for="sale in sales" :key="sale.id">
              <td>#{{ sale.id }}</td>

              <td>
                {{ sale.cliente }}
              </td>

              <td>
                <div v-for="(item, index) in sale.produtos" :key="index">
                  <strong>
                    {{ item.produto }}
                  </strong>

                  ({{ item.quantidade }}x)
                </div>
              </td>

              <td>
                R$
                {{ Number(sale.total).toFixed(2) }}
              </td>

              <td>
                R$
                {{ Number(sale.lucro).toFixed(2) }}
              </td>

              <td>
                <span
                  class="badge"
                  :class="
                    sale.status === 'completed' ? 'bg-success' : 'bg-danger'
                  "
                >
                  {{ sale.status }}
                </span>
              </td>

              <td>
                {{ formatDate(sale.created_at) }}
              </td>

              <td>
                <button
                  v-if="sale.status === 'completed'"
                  class="btn btn-danger btn-sm"
                  @click="cancelSale(sale.id)"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";

import Swal from "sweetalert2";
import api from "../services/api";

const loading = ref(false);

const tableLoading = ref(true);

const productsLoading = ref(true);

const products = ref([]);

const sales = ref([]);

const form = reactive({
  cliente: "",

  produtos: [
    {
      id: "",
      quantidade: 1,
      preco_unitario: "",
    },
  ],
});

async function loadProducts() {
  productsLoading.value = true;

  try {
    const response = await api.get("/produtos");

    products.value = response.data.data;
  } finally {
    productsLoading.value = false;
  }
}

async function loadSales() {
  tableLoading.value = true;

  try {
    const response = await api.get("/vendas");

    sales.value = response.data.data;
  } finally {
    tableLoading.value = false;
  }
}

function getProduct(productId) {
  return products.value.find((product) => product.id === Number(productId));
}

function onProductChange(item) {
  const product = getProduct(item.id);

  if (!product) {
    return;
  }

  item.preco_unitario = product.preco_venda;
}

function addProductRow() {
  form.produtos.push({
    id: "",
    quantidade: 1,
    preco_unitario: "",
  });
}

function removeProductRow(index) {
  if (form.produtos.length === 1) {
    return;
  }

  form.produtos.splice(index, 1);
}

function calculateSubtotal(item) {
  return Number(item.quantidade || 0) * Number(item.preco_unitario || 0);
}

function calculateProfit(item) {
  const product = getProduct(item.id);

  if (!product) {
    return 0;
  }

  return (
    calculateSubtotal(item) -
    Number(item.quantidade) * Number(product.custo_medio)
  );
}

const totalEstimated = computed(() => {
  return form.produtos.reduce((sum, item) => {
    return sum + calculateSubtotal(item);
  }, 0);
});

const profitEstimated = computed(() => {
  return form.produtos.reduce((sum, item) => {
    return sum + calculateProfit(item);
  }, 0);
});

async function registerSale() {
  for (const item of form.produtos) {
    const product = getProduct(item.id);

    if (product && Number(item.quantidade) > Number(product.estoque)) {
      Swal.fire({
        icon: "error",
        title: "Estoque insuficiente",
        text: `O produto ${product.nome} possui apenas ${product.estoque} unidades.`,
      });

      return;
    }
  }

  loading.value = true;

  try {
    const response = await api.post("/vendas", form);

    Swal.fire({
      icon: "success",
      title: "Venda registrada",
      html: `
        <strong>Total:</strong>
        R$ ${response.data.data.total}
        <br>
        <strong>Lucro:</strong>
        R$ ${response.data.data.lucro}
      `,
    });

    form.cliente = "";

    form.produtos = [
      {
        id: "",
        quantidade: 1,
        preco_unitario: "",
      },
    ];

    await loadProducts();
    await loadSales();
  } finally {
    loading.value = false;
  }
}

async function cancelSale(saleId) {
  const result = await Swal.fire({
    icon: "warning",
    title: "Cancelar venda?",
    text: "Essa ação irá devolver os itens ao estoque.",
    showCancelButton: true,
    confirmButtonText: "Sim, cancelar",
    cancelButtonText: "Fechar",
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    await api.post(`/vendas/${saleId}/cancelar`);

    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: "Venda cancelada com sucesso.",
    });

    await loadSales();
    await loadProducts();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: error.response?.data?.message ?? "Erro ao cancelar venda.",
    });
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR");
}

onMounted(() => {
  loadProducts();
  loadSales();
});
</script>
