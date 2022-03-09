<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <strong>User</strong> Filter
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                type="email"
                label="Email"
                horizontal
                v-model="filter.email"
              />
              <CInput
                type="text"
                label="Name"
                horizontal
                v-model="filter.name"
              />
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CRow class="justify-content-center">
              <CCol md="2">
                <CButton type="button" color="primary" @click="getData">Search</CButton>
                <CButton type="button" color="danger" @click="reset">Reset</CButton>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <strong>User</strong> List
          </CCardHeader>
          <CCardBody>
            <table class="table table-striped table-fixed table-hover table-bordered">
              <thead>
                <tr>
                  <th style="vertical-align: middle; overflow: hidden;">No</th>
                  <th style="vertical-align: middle; overflow: hidden;">Email</th>
                  <th style="vertical-align: middle; overflow: hidden;">Name</th>
                  <th style="vertical-align: middle; overflow: hidden;">Role</th>
                  <th style="vertical-align: middle; overflow: hidden;">Status</th>
                  <th style="vertical-align: middle; overflow: hidden;">Action</th>
                </tr>
              </thead>
              <tbody class="position-relative">
                <tr v-for="(user, i) in users" :key="user.id">
                  <td>{{ counter(i) }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <span class="badge badge-success" v-if="user.is_active">Active</span>
                    <span class="badge badge-danger" v-else>Inactive</span>
                  </td>
                  <td>
                    <CButton 
                      color="success"
                      v-c-tooltip.hover="{ content: `Edit`, placement: 'top' }"
                      @click="goEdit(user.id)"
                    >
                      <CIcon name="cil-pencil"/>
                    </CButton>
                    <CButton 
                      color="primary"
                      v-c-tooltip.hover="{ content: `Check Onboarding`, placement: 'top' }"
                      @click="goOnboarding(user.id)"
                    >
                      <CIcon name="cil-check"/>
                    </CButton>
                  </td>
                </tr>
                <tr v-if="users.length < 1">
                  <td colspan="6" class="text-center">Data not available</td>
                </tr>
              </tbody>
            </table>
            <CPagination
              :active-page.sync="page"
              :pages="totalPage"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { UserSvc } from '@/service/api';

export default {
  name: 'User',
  data() {
    return {
      filter: this.defaultFilter(),
      page: 1,
      totalPage: 0,
      users: [],
    }
  },
  methods: {
    defaultFilter() {
      return {
        name: '',
        email: '',
        page: 1,
        per_page: 10
      }
    },
    getData() {
      const vm = this;

      UserSvc.getUsers(vm.filter).then(function (res) {
        vm.users = res.data.data;
        vm.totalPage = res.data.meta.last_page;
      }).catch((err) => {
        console.log(err);
      });
    },
    reset() {
      this.filter = this.defaultFilter();
      this.getData();
    },
    goEdit(id) {
      this.$router.push({name:'EditUser', params:{id:id}});
    },
    goOnboarding(id) {
      this.$router.push({name:'OnboardingUser', params:{id:id}});
    },
    counter(i) {
      return ((this.page - 1) * this.filter.per_page) + (i + 1);
    }
  },
  watch: {
    page(val) {
      this.filter.page = val;
      this.getData();
    }
  },
  computed: {
    user() {
        return this.$store.state.user;
    }
  },
  mounted() {
    const vm = this;

    vm.getData();
  }
}
</script>
