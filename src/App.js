import React, { Component } from "react";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import NewTimetable from "./components/newtimetable";
import UpdateTimetable from "./components/updatetimetable";
import TimetableDetails from "./components/timetabledetails";
import MainApp from "./components/mainapp";
import About from "./components/about";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  Redirect,
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: "",
      modalBody: "",
    };
    if (
      localStorage.getItem("isLoggedin") &&
      localStorage.getItem("objectID")
    ) {
      this.state = {
        isLoggedin: localStorage.getItem("isLoggedin"),
        objectID: localStorage.getItem("objectID"),
      };
    } else
      this.state = {
        isLoggedin: false,
        objectID: "",
      };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  componentDidMount() {
    if (
      localStorage.getItem("isLoggedin") &&
      localStorage.getItem("objectID")
    ) {
      this.setState({
        isLoggedin: localStorage.getItem("isLoggedin"),
        objectID: localStorage.getItem("objectID"),
      });
    }
  }
  handleLogin(data) {
    if (data.isAuth) {
      this.setState({
        isLoggedin: data.isAuth,
        objectID: data.objectID,
      });
      localStorage.setItem("isLoggedin", data.isAuth);
      localStorage.setItem("objectID", data.objectID);
    } else {
      var title = "";
      var body = "";
      if (data.from === "login") {
        title = "Login Error";
        body = "Email and Password do not Match";
      } else if (data.from === "register") {
        title = "Registration";
        body = "Email already exist";
      }
      this.setState({
        modalTitle: title,
        modalShow: true,
        modalBody: body,
      });
    }
  }
  handleLogout() {
    localStorage.removeItem("isLoggedin");
    localStorage.removeItem("objectID");
    this.setState({
      isLoggedin: false,
    });
  }
  renderNavbar() {
    console.log("Hello");
    if (this.state.isLoggedin)
      return (
        <Navbar
          variant="dark"
          style={{ paddingLeft: "15%", paddingRight: "15%" }}
        >
          <NavLink className="navbar-brand" to="/">
            GATimetable
          </NavLink>
          <Nav className="mr-auto">
            <NavLink className="nav-link" to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </Nav>
          <Button variant="outline-danger" onClick={this.handleLogout}>
            Logout
          </Button>
        </Navbar>
      );
  }
  render() {
    return (
      <div className="App">
        <Modal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalBody}</Modal.Body>
        </Modal>
        <Router>
          {this.renderNavbar()}
          <Switch>
            <Route exact path="/">
              {this.state.isLoggedin ? (
                <Dashboard objectID={this.state.objectID}></Dashboard>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/dashboard">
              {this.state.isLoggedin ? (
                <Dashboard objectID={this.state.objectID}></Dashboard>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/about">
              {this.state.isLoggedin ? (
                <About objectID={this.state.objectID}></About>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/newtimetable">
              {this.state.isLoggedin ? (
                <NewTimetable objectID={this.state.objectID}></NewTimetable>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route path="/updatetimetable/:timetableObjectID">
              {this.state.isLoggedin ? (
                <UpdateTimetable
                  objectID={this.state.objectID}
                ></UpdateTimetable>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            {/* <Route path="/timetabledetails/:timetableObjectID">
              {this.state.isLoggedin ? (
                <TimetableDetails
                  objectID={this.state.objectID}
                ></TimetableDetails>
              ) : (
                <Redirect to="/login" />
              )}
            </Route> */}

            <Route path="/mainapp/:timetableObjectID">
              {this.state.isLoggedin ? (
                <MainApp objectID={this.state.objectID}></MainApp>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>

            <Route path="/login">
              {this.state.isLoggedin ? (
                <Redirect to="/" />
              ) : (
                <Login sendLoginParamsHere={this.handleLogin}></Login>
              )}
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default App;
