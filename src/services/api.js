import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_PGOI_API,
  headers: {
    Authorization: localStorage.getItem("pgoi-token"),
  },
});

export default api;
