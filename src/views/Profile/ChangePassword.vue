<template>
  <div>
    <CRow>
      <CCol md="12">
        <CAlert color="danger" closeButton v-if="errors.length > 0">
          <ul>
            <li v-for="(error, i) in errors" :key="i">{{ error }}</li>
          </ul>
        </CAlert>
        <CCard>
          <CCardHeader>
            <strong>Profile</strong> Change Password
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                type="password"
                label="Old Password"
                horizontal
                v-model="form.old_password"
              />
              <CInput
                type="password"
                label="New Password"
                horizontal
                v-model="form.password"
              />
              <CInput
                type="password"
                label="Password Confirmation"
                horizontal
                v-model="form.password_confirmation"
              />
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton type="button" size="sm" color="primary" @click="submit" v-if="!isLoading"><CIcon name="cil-check-circle"/> Submit</CButton>
            <pulse-loader :color="'#321fdb'" v-else></pulse-loader>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { AuthSvc } from '@/service/api';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
  name: 'ChangePassword',
  components: {
    PulseLoader
  },
  data() {
    return {
      isCreate: true,
      form: this.defaultForm(),
      isLoading: false,
      errors: [],
    }
  },
  methods: {
    defaultForm() {
      return {
        old_password: '',
        password: '',
        password_confirmation: '',
      };
    },
    submit() {
      const vm = this;

      //Show Loading
      vm.isLoading = true;

      //Split call API for insert or edit
      AuthSvc.changePassword(vm.form).then(function (res) {
        this.defaultForm();

        vm.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Change password successfull',
          showConfirmButton: false,
          timer: 1500
        })
      }).catch((err) => {
        vm.errors = vm.resolveError(err);
      }).then(() => {
        //Hide Loading
        vm.isLoading = false;
      });
    }
  },
  computed: {
    user() {
        return this.$store.state.user;
    }
  }
}
</script>
