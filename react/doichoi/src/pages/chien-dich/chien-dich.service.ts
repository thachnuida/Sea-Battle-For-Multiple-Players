import httpClient from '../../common/http-client';

class ChienDichService {

  listOpen() {
    return httpClient.get('/api/team/chiendichdangmo');
  }

  detail() {
    return httpClient.get('/api/team/chiendich');
  }
  
  getAirPlane() {
    return httpClient.get('/api/team/airplane');
  }

  toggleAirPlane(cell: any) {
    return httpClient.post('/api/team/airplane', cell);
  }

  getBom() {
    return httpClient.get('/api/team/bom');
  }

  addBom(cell: any) {
    return httpClient.post('/api/team/bom', cell);
  }

  getSecret() {
    return httpClient.get('/api/team/campinfo');
  }
}

const chienDichService = new ChienDichService();

export default chienDichService;