import httpClient from '../../common/http-client';

class LoginService {

  login(password: string) {
    return httpClient.post('/api/admin/login', { password });
  }
}

const loginService = new LoginService();

export default loginService;