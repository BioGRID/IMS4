import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import Dashboard from './views/elements/Dashboard.vue';
import axios from 'axios';

Vue.use(Router);

const canAccess = (next: any) => {
    if (store.getters['auth/isLoggedIn']) {
        next();
        return;
    }
    next( '/pages/login' );
};

const isPermitted = (permission: string, next: any) => {
    if (store.getters['auth/isLoggedIn']) {
        axios
            .post(
                process.env.VUE_APP_AUTH_URL! + '/permit', { permission }, {
                    headers: {
                        Authorization: 'Bearer ' + store.getters['auth/getUser'].access_key,
                    },
                })
            .then( (response) => {
                if ( response.status === 200 ) {
                    next();
                    return;
                }
            })
            .catch( (error) => {
                if ( error.response.status === 403 || error.response.status === 401 ) {
                    // Forbidden User
                    next( '/pages/error-401' );
                } else {
                    console.log( error.response.data );
                    next( '/pages/error-401' );
                }
            });
    } else {
        next( '/pages/login' );
    }
};

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
                beforeEnter: (to: any, from: any, next: any) => {
                    canAccess(next);
                },
            },
            {
                path: '/elements/test',
                name: 'Test Page',
                component: () => import( '@/views/elements/Test.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermitted( 'MANAGE USERS', next );
                },
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
            {
                path: '/pages/error-401',
                name: '401 Error Page',
                component: () => import( '@/views/pages/Error401.vue' ),
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

export default router;
