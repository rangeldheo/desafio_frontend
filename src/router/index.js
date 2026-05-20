import { createRouter, createWebHistory } from "vue-router";

import ProductsPage from "../pages/ProductsPage.vue";
import PurchasesPage from "../pages/PurchasesPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
