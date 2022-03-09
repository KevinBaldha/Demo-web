import Vue from 'vue';
import Router from 'vue-router';
import {AuthSvc} from '@/service/api';
import store from '../store';

// Containers
const TheContainer = () => import('@/containers/TheContainer');

const Login = () => import('@/views/Auth/Login');

const User = () => import('@/views/User/Index');
const FormUser = () => import('@/views/User/Form');
const OnboardingUser = () => import('@/views/User/Onboarding');

const Wfh = () => import('@/views/Wfh/Index');
const FormWfh = () => import('@/views/Wfh/Form');

const ChangePassword = () => import('@/views/Profile/ChangePassword');

//For Error Page
const NotFound = () => import('@/views/Error/404');
const Forbidden = () => import('@/views/Error/403');

Vue.use(Router)

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/wfh/list',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'user',
          redirect: '/user/list',
          name: 'User',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '/user/create',
              name: 'CreateUser',
              component: FormUser
            },
            {
              path: '/user/list',
              name: 'ListUser',
              component: User
            },
            {
              path: '/user/:id/edit',
              name: 'EditUser',
              component: FormUser
            },
            {
              path: '/user/:id/onboarding',
              name: 'OnboardingUser',
              component: OnboardingUser
            }
          ]
        },
        {
          path: 'wfh',
          redirect: '/wfh/list',
          name: 'Wfh',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: '/wfh/create',
              name: 'CreateWfh',
              component: FormWfh
            },
            {
              path: '/wfh/list',
              name: 'ListWfh',
              component: Wfh
            },
            {
              path: '/wfh/:id/edit',
              name: 'EditWfh',
              component: FormWfh
            }
          ]
        },
        {
          path: '/change-password',
          name: 'ChangePassword',
          component: ChangePassword
        },
        { 
          path: '/403', 
          name: 'Forbidden',
          component: Forbidden 
        },
        { path: '/404', component: NotFound },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    { path: '*', redirect: '/404' },
  ]
}

function getUserState () {
  return new Promise((resolve, reject) => {
    if (store.state.user.role === null) {
      const unwatch = store.watch(
        () => store.state.user,
        (value) => {
          unwatch();
          resolve(value);
        }
      )
    } else {
      resolve(store.state.user);
    }
  })
}

const router  = new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

//Check Authorization for Forbidden Access
const adminForbiddens = [
  'CreateWfh'
];

const emloyeeForbiddens = [
  'CreateUser',
  'ListUser',
  'EditUser',
  'OnboardingUser'
];

router.beforeEach((to, from, next) => {
  const role = window.localStorage.getItem('role');
  if (role === 'admin') {
    adminForbiddens.forEach((value) => {
      if (to.name === value) {
        next({name: 'Forbidden'});
      }
    });
  }

  if (role === 'employee') {
    emloyeeForbiddens.forEach((value) => {
      if (to.name === value) {
        next({name: 'Forbidden'});
      }
    });
  }

  next();
});

//Always update user data from API
router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('token');

  if(token){
    AuthSvc.getUserByToken().then(function (res) {
      store.commit('setUser', res.data.data);
    }).catch(() => {
      store.commit('removeUser');
      next({name: 'Login'});
    });
  }

  if (to.name !== 'Login') {
    if (token) {
      next();
    } else {
      next({name: 'Login'});
    }
  }

  next();
});

export default router;

