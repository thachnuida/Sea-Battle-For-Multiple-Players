import React, { ChangeEvent, FormEvent, useEffect } from 'react';
import {
  Form,
  Col
} from 'react-bootstrap';
import {
  Redirect,
} from 'react-router-dom';

import loginService from './login.service';
import chienDichService from '../chien-dich/chien-dich.service';

const Login: React.FC = () => {
  const [listChienDich, setListChienDich] = React.useState<any[]>([]);
  const [loginData, setLoginData] = React.useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isLoggedInError, setIsLoggedInError] = React.useState<boolean>(false);

  useEffect(() => {
    chienDichService.listOpen().then((res: any) => {
      setListChienDich(res.data);
      if (res.data.length) {
        setLoginData({chien_dich_id: res.data[0].id});
      }
    });
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    setIsLoggedInError(false);
    loginService.login(loginData).then(
      (res: any) => {
        if (res.data.result) {
          
          setIsLoggedIn(true);
        } else {
          setIsLoggedInError(true);
        }
      },
      () => {
        setIsLoggedInError(true);
      }
    )
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const name = event.target.name;
    setLoginData({...loginData, [name]: event.target.value});
  }

  if(isLoggedIn) {
    return <Redirect to="/chiendich" />
  };

  return (
    <div>
      <h2>Đăng nhập vào chiến dịch</h2>
      <Form onSubmit={(e) => submit(e)}>

          <Form.Group>
            <Form.Label>Chọn chiến dịch</Form.Label>
            <Form.Control
              as="select"
              name="chien_dich_id"
              onChange={handleInputChange}
            >
              {listChienDich.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Tên đội</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đội"
              name="name"
              onChange={handleInputChange}
              />
          </Form.Group>

          <Form.Group>
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              name="password"
              onChange={handleInputChange}
              />
          </Form.Group>


        {isLoggedInError &&
          <div className="alert alert-danger" role="alert">
            Đăng nhập lỗi. Chắc là mật khẩu sai rồi.
          </div>
        }

        <button className="btn btn-primary">Đăng nhập</button>
      </Form>
    </div>
  );
}

export default Login;
