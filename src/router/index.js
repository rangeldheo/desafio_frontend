import { createRouter, createWebHistory } from "vue-router";

import ProductsPage from "../pages/ProductsPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/produtos",
  },

  {
    path: "/produtos",
    component: ProductsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
