import httpClient from '../../common/http-client';

class ChienDichService {

  list() {
    return httpClient.get('/api/admin/chiendich');
  }

  save(item: any) {
    let url = '/api/admin/chiendich';
    if (item.id) {
      url += '/' + item.id;
    }

    return httpClient.post(url, item);
  }

  get(id: number | string) {
    return httpClient.get('/api/admin/chiendich/' + id);
  }

  getTeam(chienDichId: number | string) {
    return httpClient.get('/api/admin/chiendich/' + chienDichId + '/team');
  }

  addTeam(chienDichId: number | string, name: string) {
    if (!name || !name.trim()) return;
    const team = {
      name: name.toLowerCase().replace(/ /g, '-'),
      password: this.makePassword()
    }
    
    return httpClient.post('/api/admin/chiendich/' + chienDichId + '/team', team);
  }

	makePassword() {
		let text = "";
		let possible = "0123456789";

		for (let i = 0; i < 8; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

}

const chienDichService = new ChienDichService();

export default chienDichService;