import axios from 'axios';
import qs from 'qs';
import { camelCase, snakeCase } from "../helpers/convertCase";
import filterParams from '../helpers/filterParams';

import config from '../config';

class APIService {

  static sharedService = null;

  static shared() {
    if (!this.sharedService)
      this.sharedService = new APIService();
    return this.sharedService;
  }

  constructor() {
    // base url
    this.baseUrl = '/api';

    // update callbacks
    this.callbacks = [];
  }

  addListener(cb) {
    this.callbacks.push(cb);
  }

  removeListener(cb) {
    this.callbacks = this.callbacks.filter(callback => callback !== cb);
  }

  getHeaders(customHeaders = {}) {
    let headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.isLoggedIn())
      headers['Authorization'] = 'Bearer ' + this.getAccessToken();

    return Object.assign({}, headers, customHeaders);
  }

  _request(url, options = {}) {
    const { customHeaders, ...filteredOptions } = options;

    let request = Promise.resolve();

    if (this.isLoggedIn() && this._isAccessTokenExpired()) {
      request = request.then(() => this._refreshAccessToken());
    }

    return request
      .then(() => axios({ url: this.baseUrl + url, headers: this.getHeaders(customHeaders), ...filteredOptions }))
      .then(response => camelCase(response.data));
  }

  isLoggedIn() {
    return this.getAccessToken() !== null;
  }

  _isAccessTokenExpired() {
    return this.getAccessTokenExpiration() && Date.now() > this.getAccessTokenExpiration();
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  setAccessToken(accessToken) {
    if (!accessToken)
      localStorage.removeItem('access_token');
    else
      localStorage.setItem('access_token', accessToken);
  }

  getAccessTokenExpiration() {
    return localStorage.getItem('access_token_expires_at');
  }

  setAccessTokenExpiration(expiration) {
    if (!expiration)
      localStorage.removeItem('access_token_expires_at');
    else
      localStorage.setItem('access_token_expires_at', expiration);
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  setRefreshToken(refreshToken) {
    if (!refreshToken)
      localStorage.removeItem('refresh_token');
    else
      localStorage.setItem('refresh_token', refreshToken);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('current_user'));
  }

  setCurrentUser(user) {
    const oldUser = this.getCurrentUser();

    if (!user)
      localStorage.removeItem('current_user');
    else
      localStorage.setItem('current_user', JSON.stringify(user));

    if (!user || !oldUser || user.updatedAt > oldUser.updatedAt) {
      this.callbacks.forEach(cb => {
        cb(user);
      });
    }
  }

  login(username, password) {
    return axios({
      url: this.baseUrl + '/oauth/token',
      method: 'post',
      data: qs.stringify({
        'username': username,
        'password': password,
        'grant_type': 'password',
        'client_id': config.CLIENT_ID,
        'client_secret': config.CLIENT_SECRET
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    })
      .then(response => response.data)
      .then(response => {
        this.setAccessToken(response['access_token']);
        this.setAccessTokenExpiration(Date.now() + response['expires_in']);
        this.setRefreshToken(response['refresh_token']);

        return this.requestAccount();
      });
  }

  logout() {
    this.setAccessToken(null);
    this.setAccessTokenExpiration(null);
    this.setRefreshToken(null);
    this.setCurrentUser(null);

    return Promise.resolve();
  }

  _refreshAccessToken() {
    return axios({
      url: this.baseUrl + '/oauth/token',
      method: 'post',
      data: qs.stringify({
        'refresh_token': this.getRefreshToken(),
        'grant_type': 'refresh_token',
        'client_id': config.CLIENT_ID,
        'client_secret': config.CLIENT_SECRET
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    })
      .then(response => response.data)
      .then(response => {
        this.setAccessToken(response['access_token']);
        this.setAccessTokenExpiration(Date.now() + response['expires_in']);
        this.setRefreshToken(response['refresh_token']);

        return this.requestAccount();
      })
      .catch(err => console.log(err));
  }

  signUp(username, email, password, firstName, lastName, address1, address2, city, state, zipCode) {
    return this._request('/register', {
      method: 'post',
      data: filterParams({
        'username': username,
        'email': email,
        'password': password,
        'first_name': firstName,
        'last_name': lastName,
        'address': filterParams({
          'address1': address1,
          'address2': address2,
          'city': city,
          'state': state,
          'zip_code': zipCode
        })
      })
    })
      .then(response => {
        // login
        return this.login(username, password);
      });
  }

  uploadProfilePicture(file) {
    const data = new FormData();
    data.append('image', file, file.name);
    return this._request('/account/image', {
      method: 'post',
      data: data,
      customHeaders: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        this.setCurrentUser(response);
        return response;
      });
  }

  requestAccount() {
    return this._request('/account', {
      method: 'get'
    })
      .then(response => {
        this.setCurrentUser(response);

        return response;
      });
  }

  updateAccount({ username, email, phoneNumber, firstName, lastName, bio, address1, address2, city, state, zipCode }, requireFields) {
    const currentUser = this.getCurrentUser();
    return this._request('/account', {
      method: 'put',
      data: filterParams({
        'username': username || requireFields.username ? username : currentUser.username,
        'email': email || requireFields.email ? email : currentUser.email,
        'phone_number': phoneNumber || requireFields.phoneNumber ? phoneNumber : currentUser.phoneNumber,
        'first_name': firstName || requireFields.firstName ? firstName : currentUser.firstName,
        'last_name': lastName || requireFields.lastName ? lastName : currentUser.lastName,
        'bio': bio || requireFields.bio ? bio : currentUser.bio,
        'address': filterParams({
          'address1': address1 || requireFields.address1 ? address1 : currentUser.address.address1,
          'address2': address2 || requireFields.address2 ? address2 : currentUser.address.address2,
          'city': city || requireFields.city ? city : currentUser.address.city,
          'state': state || requireFields.state ? state : currentUser.address.state,
          'zip_code': zipCode || requireFields.zipCode ? zipCode : currentUser.address.zipCode
        })
      })
    })
      .then(response => {
        this.setCurrentUser(response);
        return response;
      });
  }

  updatePassword(newPassword, oldPassword) {
    return this._request('/account/password', {
      method: 'post',
      data: {
        'new_password': newPassword,
        'old_password': oldPassword
      }
    })
      .then(response => {
        this.setCurrentUser(response);
        return response;
      });
  }

  deleteAccount() {
    return this._request('/account', {
      method: 'delete'
    })
      .then(response => this.logout());
  }

  requestUser(username) {
    return this._request('/users/' + username, {
      method: 'get'
    });
  }

  requestSearch(q, serviceCategories, minimumRating, location) {
    return this._request('/search', {
      method: 'get',
      params: {
        'q': q,
        'service_categories': serviceCategories.join(','),
        'minimum_rating': minimumRating,
        'location': location
      }
    });
  }

  requestBusiness(id) {
    return this._request('/businesses/' + id, {
      method: 'get'
    });
  }

  requestBusinessReviews(id) {
    return this._request('/reviews', {
      method: 'get',
      params: {
        'business': id
      }
    });
  }

  requestUserReviews(id) {
    return this._request('/reviews', {
      method: 'get',
      params: {
        'user': id
      }
    });
  }

  requestUserBusinesses(id) {
    return this._request('/businesses', {
      method: 'get',
      params: {
        user: id
      }
    });
  }

  postReview({
    businessId,
    overallRating,
    priceRating,
    customerServiceRating,
    qualityRating,
    description,
    serviceCategories,
    repeatCustomer,
    transactionOccurred,
    date
  }) {
    return this._request('/reviews', {
      method: 'post',
      data: filterParams({
        'business_id': businessId,
        'overall_rating': overallRating,
        'price_rating': priceRating,
        'customer_service_rating': customerServiceRating,
        'quality_rating': qualityRating,
        'description': description,
        'service_categories': serviceCategories,
        'repeat_customer': repeatCustomer,
        'transaction_occurred': transactionOccurred,
        'date': date
      })
    });
  }

  deleteReview(id) {
    return this._request('/reviews/' + id, {
      method: 'delete'
    });
  }

  registerBusiness({ name, description, email, phoneNumber, website, address1, address2, city, state, zipCode, serviceCategories }) {
    return this._request('/businesses', {
      method: 'post',
      data: filterParams({
        'name': name,
        'description': description,
        'email': email,
        'phone_number': phoneNumber,
        'website': website,
        'service_categories': serviceCategories,
        'address': filterParams({
          'address1': address1,
          'address2': address2,
          'city': city,
          'state': state,
          'zip_code': zipCode
        })
      })
    });
  }

  deleteBusiness(id) {
    return this._request('/businesses/' + id, {
      method: 'delete'
    });
  }

  uploadBusinessPicture(id, file) {
    const data = new FormData();
    data.append('image', file, file.name);
    return this._request('/businesses/' + id + '/images', {
      method: 'post',
      data: data,
      customHeaders: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        return response;
      });
  }

}

export default APIService;