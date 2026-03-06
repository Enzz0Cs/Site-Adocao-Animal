import axios from "axios";

const ApiService = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default ApiService;