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
            <strong>WFH</strong> Form
          </CCardHeader>
          <CCardBody>
            <CForm>
              <div role="group" class="form-group form-row">
                <label for="wfh_date" class="col-form-label col-sm-3">WFH Date</label>
                <div class="col-sm-9">
                  <date-picker v-model="form.wfh_date" valueType="YYYY-MM-DD"></date-picker>
                </div>
              </div>
              <div role="group" class="form-group form-row">
                <label for="status" class="col-form-label col-sm-3">Start Time</label>
                <div class="col-sm-9">
                  <select class="form-control" v-model="form.wfh_start_time">
                    <option :value="time.value" v-for="time in times" :key="time.value">{{ time.label }}</option>
                  </select>
                </div>
              </div>
              <div role="group" class="form-group form-row">
                <label for="status" class="col-form-label col-sm-3">End Time</label>
                <div class="col-sm-9">
                  <select class="form-control" v-model="form.wfh_end_time">
                    <option :value="time.value" v-for="time in times" :key="time.value">{{ time.label }}</option>
                  </select>
                </div>
              </div>
              <CTextarea
                label="Note"
                horizontal
                rows="3"
                v-model="form.note"
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
import { WfhSvc,GeneralSvc } from '@/service/api';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  name: 'FormWfh',
  components: {
    PulseLoader,
    DatePicker
  },
  data() {
    return {
      isCreate: true,
      form: {
        wfh_date: '',
        wfh_start_time: '',
        wfh_end_time: '',
        note: '',
      },
      isLoading: false,
      config: null,
      times: [],
      errors: [],
    }
  },
  methods: {
    getWfh(id) {
      const vm = this;

      WfhSvc.getWfhDetail(id).then(function (res) {
        vm.form = res.data.data;
      }).catch((err) => {
        vm.$router.push({ name: 'ListWfh' });
      });
    },
    getConfig() {
      const vm = this;

      GeneralSvc.getConfig().then(function (res) {
        vm.config = res.data.data;
        vm.setupTime();
      }).catch((err) => {
        vm.$router.push({ name: 'ListWfh' });
      });
    },
    setupTime() {
      const vm = this;
      const start = vm.getTimeNumber(vm.config.start_business_hour);
      const end = vm.getTimeNumber(vm.config.end_business_hour);

      vm.times = [];
      for (let i = start; i <= end; i++) {
        let timePad = i.toString().padStart(2, '0');
        let objTime = {
          value: `${timePad}:00:00`,
          label: `${timePad}:00`
        };

        //Binding to Set Default Start Time
        if (i === start) {
          vm.form.wfh_start_time = objTime.value;
        }

        //Binding to Set Default End Time
        if (i === end) {
          vm.form.wfh_end_time = objTime.value;
        }

        vm.times.push(objTime);
      }
    },
    getTimeNumber(str) {
      return parseInt(str.substring(0, 2));
    },
    submit() {
      const vm = this;

      //Validation
      const start = vm.getTimeNumber(vm.form.wfh_start_time);
      const end = vm.getTimeNumber(vm.form.wfh_end_time);

      if (start >= end) {
        vm.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Time Range Invalid',
        });

        return;
      }

      //Show Loading
      vm.isLoading = true;

      //Split call API for insert or edit
      if (vm.isCreate) {
        WfhSvc.createWfh(vm.form).then(function (res) {
          vm.$router.push({ name: 'ListWfh' });
        }).catch((err) => {
          vm.errors = vm.resolveError(err);
        }).then(() => {
          //Hide Loading
          vm.isLoading = false;
        });
      } else {
        WfhSvc.updateWfh(vm.form.id, vm.form).then(function (res) {
          vm.$router.push({ name: 'ListWfh' });
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

    vm.getConfig();

    if (typeof vm.$route.params.id !== 'undefined') {
      vm.isCreate = false;
      vm.getWfh(vm.$route.params.id);
    }
  }
}
</script>
