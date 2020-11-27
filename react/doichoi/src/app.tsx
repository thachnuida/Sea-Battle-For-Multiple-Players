import * as React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";

import { Navbar, Nav } from 'react-bootstrap';

import './app.scss';
import Login from './pages/login/login';
import ChienDich from './pages/chien-dich/chien-dich';
import Logout from './components/logout';

const App: React.FC = () => {

  return (
    <Router basename="/doichoi">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          <img src={`${process.env.PUBLIC_URL}/logo.png`} className="logo"/>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Logout />
        </Nav>        
      </Navbar>

      <div className="main container pt-3">
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/chiendich">
            <ChienDich />
          </Route>
        </Switch>
      </div>      
    </Router>
  );
}

export default App;
