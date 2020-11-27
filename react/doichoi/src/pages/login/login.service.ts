import httpClient from '../../common/http-client';

class LoginService {

  login(data: {chien_dich_id: string | number, name: string, password: string}) {
    return httpClient.post('/api/team/login', data);
  }

  logout() {
    return httpClient.post('/api/team/logout', {});
  }

}

const loginService = new LoginService();

export default loginService;