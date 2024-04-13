import { createRouter, createWebHistory } from "vue-router";
declare module 'vue-router' {
    interface RouteMeta {
        noAuth?: boolean
        title?: string
    }
}
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import("../components/layout/BaseLayout.vue"),
            children: [{
                path: '/',
                name: '首页',
                component: () => import('../views/Index.vue')
            }]
        }
    ],
});
