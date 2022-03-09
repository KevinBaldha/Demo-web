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
            <strong>User</strong> Onboarding
          </CCardHeader>
          <CCardBody>
            <CRow form class="form-group" :key="'OnboardingForm'">
              <CCol sm="9" v-if="onboardings.length > 0">
                <CInputCheckbox
                  v-for="onboarding in onboardings"
                  :key="onboarding.id"
                  :label="onboarding.onboarding_option_name"
                  :value="onboarding.id"
                  :custom="true"
                  :name="onboarding.onboarding_option_name"
                  :checked="onboarding.is_completed"
                  :inline="false"
                  v-model="onboardingChecks"
                  @change="updateOnboarding(onboarding.id)"
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton type="button" size="sm" color="primary" @click="goToListUser">Back</CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { UserSvc } from '@/service/api';

export default {
  name: 'OnboardingUser',
  data() {
    return {
      onboardings: [],
      onboardingChecks: [],
      errors: [],
    }
  },
  methods: {
    getOnboardings(id) {
      const vm = this;

      UserSvc.getOnboardings(id).then(function (res) {
        vm.onboardings = res.data.data;
      }).catch((err) => {
        vm.$router.push({ name: 'ListUser' });
      });
    },
    updateOnboarding(id) {
      const vm = this;

      UserSvc.updateOnboarding(id).then(function (res) {
        vm.getOnboardings(vm.$route.params.id);
      }).catch((err) => {
        vm.errors = vm.resolveError(err);
      });      
    },
    goToListUser() {
      this.$router.push({ name: 'ListUser' });
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    const vm = this;
    
    vm.getOnboardings(vm.$route.params.id);
  }
}
</script>
