import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/elements/Dashboard.vue';
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
        if (isPermitted(permission)) {
            next();
            return;
        }
        next( '/pages/error-401' );
    } else {
        next( 'pages/login' );
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
                path: '/elements/admin',
                name: 'Admin Tools',
                component: () => import( '@/views/elements/Admin.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'VIEW ADMIN TOOLS', next );
                },
            },
            {
                path: '/admin/permission/permissionmanager',
                name: 'Permission Manager',
                component: () => import( '@/views/admin/permission/PermissionManager.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE PERMISSIONS', next );
                },
            },
            {
                path: '/admin/permission/permissionadd',
                name: 'Permission Add',
                component: () => import( '@/views/admin/permission/PermissionAdd.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE PERMISSIONS', next );
                },
            },
            {
                path: '/admin/permission/permissionedit/:name',
                name: 'Permission Edit',
                component: () => import( '@/views/admin/permission/PermissionEdit.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE PERMISSIONS', next );
                },
            },
            {
                path: '/admin/socket/socketstatus',
                name: 'Socket Status',
                component: () => import( '@/views/admin/socket/SocketStatus.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'WEBSOCKET MANAGE', next );
                },
            },
            {
                path: '/admin/user/usermanager',
                name: 'User Manager',
                component: () => import( '@/views/admin/user/UserManager.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE USERS', next );
                },
            },
            {
                path: '/admin/user/useredit/:id',
                name: 'User Edit',
                component: () => import( '@/views/admin/user/UserEdit.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE USERS', next );
                },
            },
            {
                path: '/admin/user/useradd',
                name: 'User Add',
                component: () => import( '@/views/admin/user/UserAdd.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'ADD USER', next );
                },
            },
            {
                path: '/admin/user/userpassword/:id',
                name: 'Change Password',
                component: () => import( '@/views/admin/user/UserPassword.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE USERS', next );
                },
            },
            {
                path: '/admin/user/changemypassword',
                name: 'Change My Password',
                component: () => import( '@/views/admin/user/ChangeMyPassword.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    canAccessRoute(next);
                },
            },
            {
                path: '/admin/curationgroup/curationgroupmanager',
                name: 'Curation Group Manager',
                component: () => import( '@/views/admin/curationgroup/CurationGroupManager.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE CURATION GROUPS', next );
                },
            },
            {
                path: '/admin/curationgroup/curationgroupadd',
                name: 'Curation Group Add',
                component: () => import( '@/views/admin/curationgroup/CurationGroupAdd.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE CURATION GROUPS', next );
                },
            },
            {
                path: '/admin/curationgroup/curationgroupedit/:id',
                name: 'Curation Group Edit',
                component: () => import( '@/views/admin/curationgroup/CurationGroupEdit.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE CURATION GROUPS', next );
                },
            },
            {
                path: '/curation/DatasetLoad/:type/:id',
                name: 'Loading Dataset',
                component: () => import( '@/views/curation/DatasetLoad.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'LOAD DATASET', next );
                },
            },
            {
                path: '/curation/DatasetView/:id',
                name: 'Read Dataset',
                component: () => import( '@/views/curation/DatasetView.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'LOAD DATASET', next );
                },
            },
            {
                path: '/admin/chemical/chemicalmanager',
                name: 'Manage Chemicals',
                component: () => import( '@/views/admin/chemical/ChemicalManager.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE CHEMICALS', next );
                },
            },
            {
                path: '/admin/chemical/chemicaledit/:id',
                name: 'Chemical Edit',
                component: () => import( '@/views/admin/chemical/ChemicalEdit.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE CHEMICALS', next );
                },
            },
            {
                path: '/admin/chemical/chemicaladd',
                name: 'Chemical Add',
                component: () => import( '@/views/admin/chemical/ChemicalAdd.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE CHEMICALS', next );
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
            {
                path: '/elements/test',
                name: 'Test Page',
                component: () => import( '@/views/elements/Test.vue' ),
                beforeEnter: (to: any, from: any, next: any) => {
                    isPermittedRoute( 'MANAGE USERS', next );
                },
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
