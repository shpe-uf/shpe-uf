import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import UserRoute from "./util/UserRoute";

import MenuBar from "./components/MenuBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DevTeam from "./pages/DevTeam";
import About from "./pages/About";
import EBoard from "./pages/EBoard";
import Sponsors from "./pages/Sponsors";
import Admin from "./pages/Admin";
import Points from "./pages/Points";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";
import Requests from "./pages/Requests";
import Statistics from "./pages/Statistics";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Confirm from "./pages/Confirm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <main>
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/about" component={About} />
          <Route exact path="/eboard" component={EBoard} />
          <Route exact path="/devteam" component={DevTeam} />
          <Route exact path="/sponsors" component={Sponsors} />
          <Route exact path="/reset/:token" component={ResetPassword} />
          <Route exact path="/forgot" component={ForgotPassword} />
          <Route exact path="/confirm/:id" component={Confirm} />
          <UserRoute exact path="/admin" component={Admin} />
          <UserRoute exact path="/admin/events" component={Events} />
          <UserRoute exact path="/admin/tasks" component={Tasks} />
          <UserRoute exact path="/admin/members" component={Members} />
          <UserRoute exact path="/admin/requests" component={Requests} />
          <UserRoute exact path="/admin/statistics" component={Statistics} />
          <UserRoute exact path="/profile" component={Profile} />
          <UserRoute exact path="/points" component={Points} />
          </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
