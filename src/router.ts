import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import Dashboard from './views/elements/Dashboard.vue';
import axios from 'axios';
import { canAccess, isPermitted } from '@/utils/Permission';

Vue.use(Router);

const canAccessRoute = (next: any) => {
    if (canAccess()) {
        next();
        return;
    }
    next( '/pages/login' );
};

const isPermittedRoute = (permission: string, next: any) => {
    if (canAccess()) {
        isPermitted( permission )
            .then( (res) => {
                if (res && res.status === 200) {
                    next();
                }
            }).catch( (error) => {
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
                    canAccessRoute(next);
                },
            },
            {
                path: '/elements/test',
                name: 'Test Page',
                component: () => import( '@/views/elements/Test.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE USERS', next );
                },
            },
            {
                path: '/elements/admin',
                name: 'Admin Tools',
                component: () => import( '@/views/elements/Admin.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'VIEW ADMIN TOOLS', next );
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
