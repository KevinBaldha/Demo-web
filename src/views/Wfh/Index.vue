<template>
  <div>
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader>
            <strong>WFH</strong> Filter
          </CCardHeader>
          <CCardBody>
            <CForm>
              <CInput
                type="text"
                label="Requested By"
                horizontal
                v-model="filter.requested_by"
                v-if="user.role === 'admin'"
              />
              <div role="group" class="form-group form-row">
                <label for="wfh_date" class="col-form-label col-sm-3">WFH Date</label>
                <div class="col-sm-9">
                  <date-picker v-model="filter.wfh_date" valueType="YYYY-MM-DD"></date-picker>
                </div>
              </div>
              <div role="group" class="form-group form-row">
                <label for="status" class="col-form-label col-sm-3">Status</label>
                <div class="col-sm-9">
                  <select class="form-control" v-model="filter.status">
                    <option value="">All Status</option>
                    <option value="request">Request</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                    <option value="cancel">Cancel</option>
                  </select>
                </div>
              </div>
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
            <strong>WFH</strong> List
          </CCardHeader>
          <CCardBody>
            <table class="table table-striped table-fixed table-hover table-bordered">
              <thead>
                <tr>
                  <th style="vertical-align: middle; overflow: hidden;">No</th>
                  <th style="vertical-align: middle; overflow: hidden;">WFH Date</th>
                  <th style="vertical-align: middle; overflow: hidden;">Start Time</th>
                  <th style="vertical-align: middle; overflow: hidden;">End Time</th>
                  <th style="vertical-align: middle; overflow: hidden;">Duration</th>
                  <th style="vertical-align: middle; overflow: hidden;">Note</th>
                  <th style="vertical-align: middle; overflow: hidden;">Status</th>
                  <th style="vertical-align: middle; overflow: hidden;" v-if="user && user.role === 'admin'">Requested By</th>
                  <th style="vertical-align: middle; overflow: hidden;">Requested Date</th>
                  <th style="vertical-align: middle; overflow: hidden;">Action</th>
                </tr>
              </thead>
              <tbody class="position-relative">
                <tr v-for="(wfh, i) in wfhs" :key="wfh.id">
                  <td>{{ counter(i) }}</td>
                  <td>{{ convertDate(wfh.wfh_date) }}</td>
                  <td>{{ wfh.wfh_start_time.substring(0, 5) }}</td>
                  <td>{{ wfh.wfh_end_time.substring(0, 5) }}</td>
                  <td>{{ wfh.wfh_duration }} hour(s)</td>
                  <td style="overflow: hidden;text-overflow: ellipsis;">{{ wfh.note ? wfh.note : '-' }}</td>
                  <td>{{ capitalizeFirstLetter(wfh.status) }}</td>
                  <td v-if="user && user.role === 'admin'">{{ wfh.requested_by }}</td>
                  <td>{{ convertDateTime(wfh.created_at) }}</td>
                  <td>
                    <CButton 
                      color="success"
                      v-c-tooltip.hover="{ content: `Edit`, placement: 'top' }"
                      @click="goEdit(wfh.id)"
                      v-if="!loadingAction && user && user.role === 'employee' && wfh.status === 'request'"
                    >
                      <CIcon name="cil-pencil"/>
                    </CButton>
                    <CButton 
                      color="danger"
                      v-c-tooltip.hover="{ content: `Cancel`, placement: 'top' }"
                      @click="cancel(wfh.id)"
                      v-if="!loadingAction && user && user.role === 'employee' && wfh.status === 'request'"
                    >
                      <CIcon name="cil-ban"/>
                    </CButton>
                    <CButton 
                      color="primary"
                      v-c-tooltip.hover="{ content: `Approve`, placement: 'top' }"
                      @click="approve(wfh.id)"
                      v-if="!loadingAction && user && user.role === 'admin' && wfh.status === 'request'"
                    >
                      <CIcon name="cil-check"/>
                    </CButton>
                    <CButton 
                      color="danger"
                      v-c-tooltip.hover="{ content: `Reject`, placement: 'top' }"
                      @click="reject(wfh.id)"
                      v-if="!loadingAction && user && user.role === 'admin' && wfh.status === 'request'"
                    >
                      <CIcon name="cil-ban"/>
                    </CButton>
                    <pulse-loader :color="'#321fdb'" v-if="loadingAction"></pulse-loader>
                  </td>
                </tr>
                <tr v-if="wfhs.length < 1">
                  <td colspan="10" class="text-center">Data not available</td>
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
import { WfhSvc } from '@/service/api';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import moment from 'moment';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  name: 'Wfh',
  components: {
    PulseLoader,
    DatePicker
  },
  data() {
    return {
      filter: this.defaultFilter(),
      page: 1,
      totalPage: 0,
      wfhs: [],
      loadingAction: false,
    }
  },
  methods: {
    defaultFilter() {
      return {
        status: '',
        requested_by: '',
        wfh_date: '',
        page: 1,
        per_page: 10
      }
    },
    getData() {
      const vm = this;

      WfhSvc.getWfhs(vm.filter).then(function (res) {
        vm.wfhs = res.data.data;
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
      this.$router.push({name:'EditWfh', params:{id:id}});
    },
    counter(i) {
      return ((this.page - 1) * this.filter.per_page) + (i + 1);
    },
    convertDate(val) {
      return moment(val).format('DD MMMM YYYY'); 
    },
    convertDateTime(val) {
      return moment(val).format('DD MMMM YYYY hh:mm:ss'); 
    },
    approve(id) {
      const vm = this;

      vm.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Show Loading
          vm.loadingAction = true;
          WfhSvc.approveWfh(id).then(function (res) {
            vm.$swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Approve wfh request successfull',
              showConfirmButton: false,
              timer: 1500
            });
            vm.getData();
          }).catch((err) => {
            console.log(err);
          }).then(() => {
            //Hide Loading
            vm.loadingAction = false;
          });
        }
      })
    },
    cancel(id) {
      const vm = this;

      vm.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Show Loading
          vm.loadingAction = true;
          WfhSvc.cancelWfh(id).then(function (res) {
            vm.$swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Cancel wfh request successfull',
              showConfirmButton: false,
              timer: 1500
            });
            vm.getData();
          }).catch((err) => {
            console.log(err);
          }).then(() => {
            //Hide Loading
            vm.loadingAction = false;
          });
        }
      })
    },
    reject(id) {
      const vm = this;

      vm.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Show Loading
          vm.loadingAction = true;
          WfhSvc.rejectWfh(id).then(function (res) {
            vm.$swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Reject wfh request successfull',
              showConfirmButton: false,
              timer: 1500
            });
            vm.getData();
          }).catch((err) => {
            console.log(err);
          }).then(() => {
            //Hide Loading
            vm.loadingAction = false;
          });
        }
      })
    }
  },
  computed: {
    user() {
        return this.$store.state.user;
    }
  },
  watch: {
    page(val) {
      this.filter.page = val;
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
}
</script>
