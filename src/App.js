import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PremiumContent from "./pages/PremiumContent";
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser, setUserSession, resetUserSession } from './service/AuthService';
import { useState, useEffect } from "react";
import axios from "axios";

const verifyTokenAPIUrl = 'https://05ibyvlkah.execute-api.eu-north-1.amazonaws.com/prod/verify';


function PrivateRoute() {
  if (!getToken()) {
    const isAuthenticated = false;

    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
}

function App() {

  const [isAuthenticating, setAuthenticateing] = useState(true)


  useEffect(() => {
    const token = getToken();
    if (token === 'undefined' || token === undefined || token === null || !token) {
      return;
    }

    const requestConfig = {
      headers: {
        'x-api-key': 'aADozA3I7H62l2pMcxSNf3rWJLpVZUX2aZqolK3T'
      }
    }
    const requestBody = {
      user: getUser(),
      token: token
    }

    axios.post(verifyTokenAPIUrl, requestBody, requestConfig).then(response => {
      setUserSession(response.data.user, response.data.token);
      setAuthenticateing(false);
    }).catch(() => {
      resetUserSession();
      setAuthenticateing(false);
    })
  }, []);

  const token = getToken();
  if (isAuthenticating && token) {
    return <div>Authenticating...</div>;
  }
  return (
    <div className="App">
      <Router>
        {/* <div className="header"> */}
        {/* <NavLink exact activeClassName="active" to="/">Home</NavLink>
          <NavLink activeClassName="active" to="/register">Register</NavLink>
          <NavLink activeClassName="active" to="/login">Login</NavLink>
          <NavLink activeClassName="active" to="/premium-content">Premium Content</NavLink> */}
        {/* </div> */}
        <div className="content">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/todo" element={<PremiumContent />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
