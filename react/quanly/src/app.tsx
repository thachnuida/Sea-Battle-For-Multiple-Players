import * as React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import { Navbar, Nav } from 'react-bootstrap';

import './app.scss';
import Login from './pages/login/login';
import ListChienDich from './pages/chien-dich/list-chien-dich';
import ChienDich from './pages/chien-dich/chien-dich';

const App: React.FC = () => {
  return (
    <Router basename="/quanly">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          <img src={`${process.env.PUBLIC_URL}/logo.png`} className="logo"/>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/chiendich" className="text-white">Danh sách chiến dịch</Link>    
        </Nav>        
      </Navbar>

      <div className="main container pt-3">
        <Switch>
          <Route exact path="/">
            <Redirect to="/chiendich" />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/chiendich/:id">
            <ChienDich />
          </Route>
          <Route path="/chiendich">
            <ListChienDich />
          </Route>
        </Switch>
      </div>      
    </Router>
  );
}

export default App;
