import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const defaultUser = {
  id: null,
  name: null,
  email: null,
  role: null
}

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  user: defaultUser,
  isLogged: false,
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value;
  },
  setUser(state, user) {
    window.localStorage.setItem('role', user.role);
    state.user = user;
    state.isLogged = true;
  },
  removeUser(state) {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('token');
    state.user = defaultUser;
    state.isLogged = false;
  }
}

export default new Vuex.Store({
  state,
  mutations
})