import Vue from 'vue'
import App from './App.vue'

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

import { APIService } from "./APIService"
const apiService = new APIService()

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import './plugins/element.js'
import './plugins/vuetify.js'

import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Profile from './components/Profile.vue'
import Bioblocks from './components/Bioblocks.vue'
import NewProject from './components/NewProject.vue'
import NewGroup from './components/NewGroup.vue'
import Projects from './components/Projects.vue'
import SearchProjects from './components/SearchProjects.vue'
import Groups from './components/Groups.vue'
import Project from './components/Project.vue'
import Group from './components/Group.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'profile',
    path: '/profile',
    component: Profile
  },
  {
    name: 'bioblocks',
    path: '/bioblocks',
    component: Bioblocks
  },
  {
    name: 'newproject',
    path: '/newproject',
    component: NewProject
  },
  {
    name: 'newgroup',
    path: '/newgroup',
    component: NewGroup
  },
  {
    name: 'projects',
    path: '/projects',
    component: Projects
  },
  {
    name: 'searchprojects',
    path: '/search/projects',
    component: SearchProjects,
    props: { q: true }
  },
  {
    name: 'groups',
    path: '/groups',
    component: Groups
  },
  {
    name: 'project',
    path: '/project/:id',
    component: Project
  },
  {
    name: 'group',
    path: '/group/:id',
    component: Group
  }
]

const router = new VueRouter({ mode: 'history', routes: routes })
router.beforeEach((to, _from, next) => {
  // Si me quiero autenticar pero ya lo estoy me voy al menu principal
  if (to.path == '/')
    apiService.isLoggedIn().then(result => {
      if (result.data.success) next('profile')
      else next()
    })
    // Como estudiante no deberia crear grupos
  else if (to.path == '/newgroup')
  apiService.isLoggedIn().then(result => {
    if (result.data.type == 'student') next('profile')
    else next()
  })
    // Si quiero acceder a cualquier pagina debo estar autenticado
  else
    apiService.isLoggedIn().then(result => {
      if (!result.data.success) next('/')
      else next()
    })
})

//new Vue(Vue.util.extend({ router }, App)).$mount('#app')

new Vue({
  router: router,
  render: h => h(App)
}).$mount("#app")