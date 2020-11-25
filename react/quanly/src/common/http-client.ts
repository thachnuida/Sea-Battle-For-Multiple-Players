import axios, { AxiosError, AxiosInstance } from 'axios';

class Request {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create();
    this.client.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
  }

  onRequestSuccess(response: any) {
    return response;
  }

  onRequestFailure(error: AxiosError) {
    const { response } = error;
    if (response?.status === 401) {
      window.location.href = `${process.env.PUBLIC_URL}/login`;
    }
  }
}

const request = new Request();
const httpClient = request.client;

export default httpClient;