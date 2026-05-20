<template>
  <div class="d-flex flex-column gap-4">
    <div class="card shadow-sm">
      <div class="card-header">
        <h4 class="mb-0">Registro de Compra</h4>
      </div>

      <div class="card-body">
        <form @submit.prevent="registerPurchase">
          <div class="mb-4">
            <label class="form-label"> Fornecedor </label>

            <input
              v-model="form.fornecedor"
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

                  <th width="150">Quantidade</th>

                  <th width="180">Preço Unitário</th>

                  <th width="100">Ações</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in form.produtos" :key="index">
                  <td>
                    <select v-model="item.id" class="form-select" required>
                      <option value="">Selecione</option>

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
                    <input
                      v-model="item.quantidade"
                      type="number"
                      min="1"
                      class="form-control"
                      required
                    />
                  </td>

                  <td>
                    <input
                      v-model="item.preco_unitario"
                      type="number"
                      min="0.01"
                      step="0.01"
                      class="form-control"
                      required
                    />
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
              {{ loading ? "Salvando..." : "Registrar Compra" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-header">
        <h4 class="mb-0">Histórico de Compras</h4>
      </div>

      <div class="table-responsive">
        <table class="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fornecedor</th>
              <th>Produtos</th>
              <th>Data</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="purchase in purchases" :key="purchase.id">
              <td>#{{ purchase.id }}</td>

              <td>
                {{ purchase.fornecedor }}
              </td>

              <td>
                <div v-for="(item, index) in purchase.produtos" :key="index">
                  <strong>
                    {{ item.produto }}
                  </strong>

                  ({{ item.quantidade }}x)
                </div>
              </td>

              <td>
                {{ formatDate(purchase.created_at) }}
              </td>
            </tr>

            <tr v-if="!purchases.length">
              <td colspan="4" class="text-center py-4">
                Nenhuma compra registrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import Swal from "sweetalert2";
import api from "../services/api";

const loading = ref(false);

const products = ref([]);

const purchases = ref([]);

const form = reactive({
  fornecedor: "",

  produtos: [
    {
      id: "",
      quantidade: 1,
      preco_unitario: "",
    },
  ],
});

async function loadProducts() {
  try {
    const response = await api.get("/produtos");

    products.value = response.data.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao carregar produtos.",
    });
  }
}

async function loadPurchases() {
  try {
    const response = await api.get("/compras");

    purchases.value = response.data.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao carregar histórico de compras.",
    });
  }
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

async function registerPurchase() {
  loading.value = true;

  try {
    await api.post("/compras", form);

    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: "Compra registrada com sucesso.",
    });

    form.fornecedor = "";

    form.produtos = [
      {
        id: "",
        quantidade: 1,
        preco_unitario: "",
      },
    ];

    await loadPurchases();
    await loadProducts();
  } catch (error) {
    let message = "Erro ao registrar compra.";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    Swal.fire({
      icon: "error",
      title: "Erro",
      text: message,
    });
  } finally {
    loading.value = false;
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString("pt-BR");
}

onMounted(() => {
  loadProducts();
  loadPurchases();
});
</script>
