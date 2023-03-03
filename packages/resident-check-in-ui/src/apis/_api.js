import axios from 'axios';
import * as UrlRouter from '../utilities/url';

const axe = axios.create({
  baseURL: UrlRouter.getCheckin(),
  withCredentials: true,
});

const handle = (response, error) => {
  let handleResponse;
  if (error) {
    console.error(error);
    handleResponse = 'error';
  } else if (response) {
    handleResponse = response.data;
  } else {
    handleResponse = 'network error';
  }

  return handleResponse;
};

const checkAuth = (e) => {
  if (e.response && e.response.status === 403) {
    window.location.pathname = '/login';
  }
}

export async function _get(path, config) {
  let response;
  let error;
  try {
    response = await axe.get(path, config);
  } catch (e) {
    checkAuth(e);
    console.trace(e);
    error = e;
  }

  return handle(response, error);
}


export async function _post(path, data, config = null) {
  let response;
  let error;
  try {
    response = await axe.post(path, data, config);
  } catch (e) {
    checkAuth(e);
    console.trace(e);
    error = e;
  }

  return handle(response, error);
}


export async function _put(path, data, config = null) {
  let response;
  let error;

  try {
    response = await axe.put(path, data, config);
  } catch (e) {
    checkAuth(e);
    console.trace(e);
    error = e;
  }
  return handle(response, error);
}


export async function _delete(path, data, config) {
  let response;
  let error;
  try {
    response = await axe.delete(path, data, config);
  } catch (e) {
    checkAuth(e);
    console.trace(e);
    error = e;
  }
  return handle(response, error);
}
