<template>
  <div>
    <div class="row">
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">Cadastro de Produto</h5>
          </div>

          <div class="card-body">
            <form @submit.prevent="createProduct">
              <div class="mb-3">
                <label class="form-label"> Nome </label>

                <input
                  v-model="form.nome"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label"> Preço Venda </label>

                <input
                  v-model="form.preco_venda"
                  type="number"
                  step="0.01"
                  class="form-control"
                  required
                />
              </div>

              <button class="btn btn-primary w-100" :disabled="loading">
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm me-2"
                />

                {{ loading ? "Salvando..." : "Salvar Produto" }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">Produtos</h5>
          </div>

          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Custo Médio</th>
                  <th>Preço Venda</th>
                  <th>Estoque</th>
                </tr>
              </thead>

              <tbody>
                <tr v-if="tableLoading">
                  <td colspan="5" class="text-center py-5">
                    <div class="d-flex flex-column align-items-center gap-3">
                      <div class="spinner-border text-primary" role="status" />

                      <span class="text-muted"> Carregando produtos... </span>
                    </div>
                  </td>
                </tr>

                <tr v-else-if="!products.length">
                  <td colspan="5" class="text-center py-4">
                    Nenhum produto cadastrado
                  </td>
                </tr>

                <tr v-for="product in products" :key="product.id">
                  <td>
                    {{ product.id }}
                  </td>

                  <td>
                    {{ product.nome }}
                  </td>

                  <td>
                    R$
                    {{ product.custo_medio }}
                  </td>

                  <td>
                    R$
                    {{ product.preco_venda }}
                  </td>

                  <td>
                    {{ product.estoque }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";

import Swal from "sweetalert2";
import api from "../services/api";

const loading = ref(false);

const tableLoading = ref(true);

const products = ref([]);

const form = reactive({
  nome: "",
  preco_venda: "",
});

async function loadProducts() {
  tableLoading.value = true;

  try {
    const response = await api.get("/produtos");

    products.value = response.data.data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Erro ao carregar produtos.",
    });
  } finally {
    tableLoading.value = false;
  }
}

async function createProduct() {
  loading.value = true;

  try {
    await api.post("/produtos", {
      nome: form.nome,
      preco_venda: form.preco_venda,
    });

    Swal.fire({
      icon: "success",
      title: "Sucesso",
      text: "Produto criado com sucesso.",
    });

    form.nome = "";
    form.preco_venda = "";

    await loadProducts();
  } catch (error) {
    let message = "Erro ao criar produto.";

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

onMounted(() => {
  loadProducts();
});
</script>
