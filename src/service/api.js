import {
    Api
  } from '@/service/api.service';
  
  export const AuthSvc = {
    login(params) {
      return Api.post('auth/login', params);
    },
    logout() {
      return Api.post('auth/logout');
    },
    getUserByToken() {
      return Api.get('me');
    },
    changePassword(params) {
      return Api.patch('me/change-password', params);
    }
  }
  
  export const UserSvc = {
    getUsers(params) {
      return Api.get('users', params);
    },
    getUserDetail(id) {
      return Api.get(`users/${id}`);
    },
    getOnboardings(userId) {
      return Api.get(`onboarding-tasks?user_id=${userId}`);
    },
    updateOnboarding(id) {
      return Api.patch(`onboarding-tasks/${id}/completed`);
    },
    createUser(params) {
      return Api.post('users', params);
    },
    updateUser(id, params) {
      return Api.put(`users/${id}`, params);
    },
  }
  
  export const WfhSvc = {
    getWfhs(params) {
      return Api.get('wfh-requests', params);
    },
    getWfhDetail(id) {
      return Api.get(`wfh-requests/${id}`);
    },
    createWfh(params) {
      return Api.post('wfh-requests', params);
    },
    updateWfh(id, params) {
      return Api.put(`wfh-requests/${id}`, params);
    },
    approveWfh(id) {
      return Api.patch(`wfh-requests/${id}/approvals`, {
        is_approved: 1
      });
    },
    rejectWfh(id) {
      return Api.patch(`wfh-requests/${id}/approvals`, {
        is_approved: 0
      });
    },
    cancelWfh(id) {
      return Api.patch(`wfh-requests/${id}/canceled`);
    },
  }
  
  export const GeneralSvc = {
    getConfig() {
      return Api.get('configs');
    }
  }