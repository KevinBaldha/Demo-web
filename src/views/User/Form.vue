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
            <strong>User</strong> Form
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                type="email"
                label="Email"
                horizontal
                v-model="form.email"
              />
              <CInput
                type="password"
                label="Password"
                horizontal
                v-if="!isCreate"
                v-model="form.password"
              />
              <CInput
                type="text"
                label="Name"
                horizontal
                v-model="form.name"
              />
              <div role="group" class="form-group form-row">
                <label for="status" class="col-form-label col-sm-3">Status</label>
                <div class="col-sm-9">
                  <select class="form-control" v-model="form.is_active">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
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
import { UserSvc } from '@/service/api';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
  name: 'FormUser',
  components: {
    PulseLoader
  },
  data() {
    return {
      isCreate: true,
      form: {
        email: '',
        password: '',
        name: '',
        role: 'employee',
        is_active: 1,
      },
      isLoading: false,
      errors: [],
    }
  },
  methods: {
    getUser(id) {
      const vm = this;

      UserSvc.getUserDetail(id).then(function (res) {
        vm.form = res.data.data;
        vm.form.password = '';
        vm.form.is_active = res.data.data.is_active ? 1 : 0;
      }).catch((err) => {
        vm.$router.push({ name: 'ListUser' });
      });
    },
    submit() {
      const vm = this;

      //Show Loading
      vm.isLoading = true;

      //Split call API for insert or edit
      if (vm.isCreate) {
        UserSvc.createUser(vm.form).then(function (res) {
          vm.$router.push({ name: 'ListUser' });
        }).catch((err) => {
          vm.errors = vm.resolveError(err);
        }).then(() => {
          //Hide Loading
          vm.isLoading = false;
        });
      } else {
        UserSvc.updateUser(vm.form.id, vm.form).then(function (res) {
          vm.$router.push({ name: 'ListUser' });
        }).catch((err) => {
          vm.errors = vm.resolveError(err);
        }).then(() => {
          //Hide Loading
          vm.isLoading = false;
        });
      }
    }
  },
  computed: {
    user() {
        return this.$store.state.user;
    }
  },
  mounted() {
    const vm = this;

    if (typeof vm.$route.params.id !== 'undefined') {
      vm.isCreate = false;
      vm.getUser(vm.$route.params.id);
    }
  }
}
</script>
