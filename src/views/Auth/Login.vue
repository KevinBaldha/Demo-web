<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="4">
          <CAlert color="danger" closeButton v-if="errors.length > 0">
            <ul>
              <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
            </ul>
          </CAlert>
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Email"
                    v-model="email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    v-model="password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" @click="login">Login</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { AuthSvc } from '@/service/api';
import VueJwtDecode from 'vue-jwt-decode';

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      errors: [],
    }
  },
  methods: {
    login() {
      const vm = this;

      AuthSvc.login({
        email: vm.email,
        password: vm.password
      }).then((result) => {
        vm.getUser(result.data.data.access_token);
        vm.$router.push({ name: 'Home' });
      }).catch((error) => {
        vm.errors = vm.resolveError(error);
      });
    },
    getUser(token){
      const vm = this;
      window.localStorage.setItem('token', token);

      AuthSvc.getUserByToken().then(function (res) {
        vm.$store.commit('setUser', res.data.data);
      }).catch((err) => {
        vm.errors = vm.resolveError(error);
      });
    },
  },
  computed: {
    isLogged(){
      return this.$store.state.isLogged;
    }
  },
  mounted() {
    const vm = this;
    if (vm.isLogged) {
      vm.$router.push({ name: 'Home' });
      return;
    }
  }
}
</script>
