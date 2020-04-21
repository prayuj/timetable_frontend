import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

class TimetableDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timetableObjectID: props.timetableObjectID,
      userid: props.userid,
      title: props.title,
      desc: props.desc,
      input: props.input,
      generation: props.generation,
    };
    this.startMainApp = this.startMainApp.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.setState(this.props);
    }
  }
  startMainApp() {
    window.location.href = "/mainapp/" + this.state.timetableObjectID;
  }
  render() {
    return (
      <Jumbotron
        style={{
          backgroundColor: "white",
          margin: "5% 25%",
          padding: "5% 10%",
        }}
      >
        <h1>Timetable Details</h1>
        <div style={{ textAlign: "end" }}>
          <Link
            to={"/updatetimetable/" + this.state.timetableObjectID}
            style={{ color: "black" }}
          >
            <span class="material-icons">create</span>
          </Link>
        </div>
        <Table striped bordered hover style={{ textAlign: "left" }}>
          <tr>
            <td>ID </td>
            <td>{this.state.timetableObjectID}</td>
          </tr>
          <tr>
            <td>Title </td>
            <td>{this.state.title}</td>
          </tr>
          <tr>
            <td>Desc </td>
            <td>{this.state.desc}</td>
          </tr>
        </Table>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Action</th>
              <th>Status</th>
              <th>Button</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Set Constraints</th>
              <td>
                {this.state.input ? (
                  <span class="material-icons" style={{ color: "green" }}>
                    check_circle
                  </span>
                ) : (
                  <span class="material-icons" style={{ color: "red" }}>
                    error
                  </span>
                )}
              </td>
              <td>
                <Button
                  variant="success"
                  style={{
                    backgroundColor: "#00adb5",
                    borderColor: "#00adb5",
                    width: "75%",
                  }}
                  id="input"
                  onClick={this.props.sendDataHere}
                >
                  Set
                </Button>
              </td>
            </tr>
            <tr>
              <th>Start Generation</th>
              <td>
                {this.state.generation ? (
                  <span class="material-icons" style={{ color: "green" }}>
                    check_circle
                  </span>
                ) : (
                  <span class="material-icons" style={{ color: "red" }}>
                    error
                  </span>
                )}
              </td>
              <td>
                <Button
                  variant="success"
                  id="generation"
                  style={{
                    backgroundColor: "#00adb5",
                    borderColor: "#00adb5",
                    width: "75%",
                  }}
                  disabled={this.state.input ? false : true}
                  onClick={this.props.sendDataHere}
                >
                  Start
                </Button>
              </td>
            </tr>
            <tr>
              <th>Show Timetable</th>
              <td>
                {this.state.generation ? (
                  <span class="material-icons" style={{ color: "green" }}>
                    check_circle
                  </span>
                ) : (
                  <span class="material-icons" style={{ color: "red" }}>
                    error
                  </span>
                )}
              </td>
              <td>
                <Button
                  variant="success"
                  id="timetable"
                  style={{
                    backgroundColor: "#00adb5",
                    borderColor: "#00adb5",
                    width: "75%",
                  }}
                  disabled={this.state.generation ? false : true}
                  onClick={this.props.sendDataHere}
                >
                  Show
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
        <p></p>
      </Jumbotron>
    );
  }
}

export default TimetableDetails;
