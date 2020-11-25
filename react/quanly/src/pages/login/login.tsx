import React, { FormEvent } from 'react';
import {
  Form,
  Col
} from 'react-bootstrap';
import {
  Redirect,
} from 'react-router-dom';

import loginService from './login.service';


const Login: React.FC = () => {
  const [password, setPassword] = React.useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isLoggedInError, setIsLoggedInError] = React.useState<boolean>(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setIsLoggedInError(false);
    loginService.login(password).then(
      res => {
        if (res.data.result) {
          
          setIsLoggedIn(true);
        } else {
          setIsLoggedInError(true);
        }
      },
      error => {
        setIsLoggedInError(true);
      }
    )
  }

  if(isLoggedIn) {
    return <Redirect to={`${process.env.PUBLIC_URL}/chiendich`} />
  };

  return (
    <div>
      <h2>Đăng nhập trang quản lý</h2>
      <Form onSubmit={(e) => submit(e)}>
        <Form.Row>
          <Form.Group as={Col} controlId="formPassword">
            <Form.Label>Điền mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu quản lý"
              onChange={e => setPassword(e.target.value)}
              />
          </Form.Group>
        </Form.Row>
        
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
