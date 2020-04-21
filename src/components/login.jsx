import React, { Component } from "react";
import axios from "axios";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "login",
      loginemail: "",
      loginpassword: "",
      signupemail: "",
      signuppassword: "",
      signuprepassword: "",
      hidepasswordwarning: true,
      warning: "",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleLogin(event) {
    event.preventDefault();
    console.log({
      email: this.state.loginemail,
      password: this.state.loginpassword,
    });
    axios
      .post("http://127.0.0.1:5000/user/login", {
        email: this.state.loginemail,
        password: this.state.loginpassword,
      })
      .then((res) => {
        console.log(res);
        if (res.data.loggedIn)
          this.props.sendLoginParamsHere({
            isAuth: true,
            objectID: res.data.objectID,
          });
        else
          this.props.sendLoginParamsHere({
            from: "login",
            isAuth: false,
          });
      });
  }
  handleSignUp(event) {
    event.preventDefault();
    if (this.state.signuppassword === this.state.signuprepassword) {
      axios
        .post("http://127.0.0.1:5000/user/register", {
          email: this.state.signupemail,
          password: this.state.signuppassword,
        })
        .then((res) => {
          console.log(res);
          if (res.data.registered)
            this.props.sendLoginParamsHere({
              isAuth: true,
              objectID: res.data.objectID,
            });
          else
            this.props.sendLoginParamsHere({
              from: "register",
              isAuth: false,
            });
        });
    }
  }

  renderSwitch(data) {
    const duration = 300;

    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0,
    };
    const transitionStyles = {
      entering: { opacity: 1 },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
      exited: { opacity: 0 },
    };
    switch (data) {
      case "signup":
        return (
          <Jumbotron key="signup" style={{ background: "#222831" }}>
            <Row>
              <Col sm={5} style={{ margin: "auto", color: "white" }}>
                <h1>Hey there!</h1>
              </Col>
              <Col sm={7} style={{ background: "#fff", padding: "5%" }}>
                <h1>Registration</h1>
                <Form onSubmit={this.handleSignUp}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={this.state.signupemail}
                      onChange={(event) =>
                        this.setState({ signupemail: event.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={this.state.signuppassword}
                      onChange={(event) => {
                        this.setState({ signuppassword: event.target.value });
                        if (this.state.signuprepassword != event.target.value) {
                          this.setState({
                            hidepasswordwarning: false,
                            warning: "2px solid red",
                          });
                        } else {
                          this.setState({
                            hidepasswordwarning: true,
                            warning: "",
                          });
                        }
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicRePassword">
                    <Form.Control
                      type="password"
                      placeholder="Retype Password"
                      value={this.state.signuprepassword}
                      style={{
                        border: this.state.warning,
                      }}
                      onChange={(event) => {
                        this.setState({ signuprepassword: event.target.value });
                        if (this.state.signuppassword != event.target.value) {
                          this.setState({
                            hidepasswordwarning: false,
                            warning: "2px solid red",
                          });
                        } else {
                          this.setState({
                            hidepasswordwarning: true,
                            warning: "",
                          });
                        }
                      }}
                    />
                    <Form.Text
                      className="text-muted"
                      hidden={this.state.hidepasswordwarning}
                    >
                      Passwords don't match.
                    </Form.Text>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                    }}
                  >
                    Submit
                  </Button>
                  <h6>
                    Already have an account?{" "}
                    <a
                      onClick={() => {
                        this.setState({ current: "login" });
                      }}
                    >
                      Login
                    </a>
                  </h6>
                </Form>
              </Col>
            </Row>
          </Jumbotron>
        );

      case "login":
        return (
          <Jumbotron key="login" style={{ background: "#222831" }}>
            <Row>
              <Col sm={7} style={{ background: "#fff", padding: "5%" }}>
                <h1>Login</h1>
                <Form onSubmit={this.handleLogin}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={this.state.loginemail}
                      onChange={(event) =>
                        this.setState({ loginemail: event.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={this.state.loginpassword}
                      onChange={(event) =>
                        this.setState({ loginpassword: event.target.value })
                      }
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                    }}
                  >
                    Submit
                  </Button>
                  <h6>
                    Don't have an account?{" "}
                    <a
                      onClick={() => {
                        this.setState({ current: "signup" });
                      }}
                    >
                      Sign Up
                    </a>
                  </h6>
                </Form>
              </Col>
              <Col style={{ margin: "auto", color: "white" }} sm={5}>
                <h1>Login!</h1>
              </Col>
            </Row>
          </Jumbotron>
        );
    }
  }
  render() {
    return (
      <div
        style={{ margin: "auto", height: "40%", width: "60%", marginTop: "5%" }}
      >
        {this.renderSwitch(this.state.current)}
      </div>
    );
  }
}

export default Login;
