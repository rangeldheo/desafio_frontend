<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <RouterLink class="navbar-brand" to="/"> ERP Estoque </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbar" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/produtos">
                Produtos
              </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/compras"> Compras </RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link" to="/vendas"> Vendas </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container py-4">
      <RouterView />
    </main>
  </div>
</template>
