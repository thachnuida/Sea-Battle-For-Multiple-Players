import React from 'react';
import { useHistory } from 'react-router-dom';

import loginService from '../pages/login/login.service';

const Logout: React.FC = () => {
  const history = useHistory();

  function logout() {
    loginService.logout().then(() => {
      history.push('/login');
    });
  }

  return <button className="btn btn-outline-info" onClick={logout}>Đăng xuất</button>
}

export default Logout;
