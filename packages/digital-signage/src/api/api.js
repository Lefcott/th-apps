/** @format */

import axios from 'axios';
import { navigate } from '@teamhub/api';

const axe = axios.create({
  withCredentials: true,
});

const handle = (res, err) => {
  let output;
  if (err) {
    console.error(err);
    output = 'error';
  } else if (res) {
    output = res.data;
  } else {
    output = 'network error';
  }
  return output;
};

const checkAuth = (err) => {
  if (
    err.response &&
    (err.response.status === 403 || err.response.status === 401)
  ) {
    navigate('/login');
  }
};

export const _get = async (path, config = null) => {
  let response, error;
  try {
    response = await axe.get(path, config);
  } catch (e) {
    checkAuth(e);
    console.error(e);
    error = e;
  }
  return handle(response, error);
};

export const _post = async (path, data, config = null) => {
  let response, error;
  try {
    response = await axe.post(path, data, config);
  } catch (e) {
    checkAuth(e);
    console.error(e);
    error = e;
  }
  return handle(response, error);
};

export const _put = async (path, data, config = null) => {
  let response, error;
  try {
    response = await axe.put(path, data, config);
  } catch (e) {
    checkAuth(e);
    console.error(e);
    error = e;
  }
  return handle(response, error);
};

export const _delete = async (path, data, config = null) => {
  let response, error;
  try {
    response = await axe.delete(encodeURI(path), data, config);
  } catch (e) {
    checkAuth(e);
    console.error(e);
    error = e;
  }
  return handle(response, error);
};
