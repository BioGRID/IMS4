import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/elements/Dashboard.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // MAIN ELEMENT LAYOUTS
    {
        path: '',
        component: () => import( '@/layouts/Main.vue' ),
        children: [
            {
                path: '/',
                alias: '/elements/dashboard',
                name: 'Dashboard',
                component: Dashboard,
            },
            {
                path: '/elements/test',
                name: 'Test Page',
                component: () => import( '@/views/elements/Test.vue' ),
            },
        ],
    },
    // FULL PAGE LAYOUTS
    {
        path: '',
        component: () => import( '@/layouts/FullPage.vue' ),
        children: [
            {
                path: '/pages/login',
                name: 'Login',
                component: () => import( '@/views/pages/Login.vue' ),
            },
            {
                path: '/pages/error-404',
                name: '404 Error Page',
                component: () => import( '@/views/pages/Error404.vue' ),
            },
        ],
    },
    // CATCH ALL ROUTE
    {
        path: '*',
        redirect: '/pages/error-404',
    },
  ],
});

router.beforeEach((to, from, next) => {

    if (
        to.path === '/pages/login' ||
        to.path === '/pages/error-404' ||
        to.path === '/elements/dashboard' ||
        to.path === '/'
    ) {
        return next( );
    }

    router.push({
        path: '/pages/login',
        query: {
            to: to.path,
        },
    });

});

export default router;
