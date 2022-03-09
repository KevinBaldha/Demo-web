import axios from 'axios';

export const Api = {
  init() {
    let service = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
      timeout: 50000
    });

    service.interceptors.request.use(
      config => {
        const token = window.localStorage.getItem('token');

        if (token != null) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    service.interceptors.response.use(this.handleSuccess, this.handleError);
    this.service = service;
  },
  handleSuccess(response) {
    return response;
  },
  handleError(error) {
    return Promise.reject(error);
  },
  redirectTo(document, path) {
    document.location = path;
  },
  get(path, payload) {
    if (payload) {
      const qs = Object.keys(payload)
        .map(key => `${key}=${payload[key]}`)
        .join('&');


      return this.service.get(`${path}?${qs}`)
    }

    return this.service.get(path);
  },
  put(path, payload) {
    return this.service.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload
    })
  },
  post(path, payload) {
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload
    });
  },
  patch(path, payload) {
    return this.service.request({
      method: 'PATCH',
      url: path,
      responseType: 'json',
      data: payload
    });
  },
  delete(path, payload) {
    return this.service.request({
      method: 'DELETE',
      url: path,
      responseType: 'json',
      data: payload
    });
  },
}

export const ApiService = {
  init() {
    Api.init();
  }
}