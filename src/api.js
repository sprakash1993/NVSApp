import axios from 'axios';

var axiosInstance = axios.create({
  baseURL: 'http://0.0.0.0:3000/'
});

export const fetchTables = () => {
  return axiosInstance.get('/table-details')
    .then(resp => resp.data);
};
