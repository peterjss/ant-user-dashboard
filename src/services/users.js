import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

export function fetch({ page }) {
  console.log("in fetch service");
  return request(`/api/users?_page=${page}&_limit=${PAGE_SIZE}`);
}

export function remove(id) {
  console.log("in remove service");
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

export function patch(id, values) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export function create(values) {
  return request('/api/users', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}
