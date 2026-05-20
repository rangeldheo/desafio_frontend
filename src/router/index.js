import { createRouter, createWebHistory } from "vue-router";

import ProductsPage from "../pages/ProductsPage.vue";
import PurchasesPage from "../pages/PurchasesPage.vue";
import SalesPage from "../pages/SalesPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/produtos",
  },

  {
    path: "/produtos",
    component: ProductsPage,
  },

  {
    path: "/compras",
    component: PurchasesPage,
  },

  {
    path: "/vendas",
    component: SalesPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
