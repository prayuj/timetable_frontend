import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

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
      show: false,
      modal_text: "",
      border: "",
    };
    this.startMainApp = this.startMainApp.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.setState(this.props);
    }
  }

  onDeleteHandler() {
    if (this.state.modal_text === "DELETE") {
      axios
        .post("http://127.0.0.1:5000/deletetimetable", {
          timetableObjectID: this.state.timetableObjectID,
        })
        .then((res) => (window.location.href = "/"));
    } else {
      this.setState({ border: "2px solid red" });
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
          margin: "1% 25%",
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
          <Link
            style={{ color: "black" }}
            onClick={() => this.setState({ show: true })}
          >
            <span class="material-icons">delete</span>
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
        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Timetable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label style={{ padding: "2%" }}>
                Type "DELETE" to remove this Timetable!
              </Form.Label>
              <Form.Control
                type="text"
                style={{
                  textAlign: "left",
                  padding: "2%",
                  border: this.state.border,
                }}
                value={this.state.modal_text}
                onChange={(e) =>
                  this.setState({ modal_text: e.target.value, border: "" })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ show: false })}
            >
              Close
            </Button>
            <Button variant="primary" onClick={this.onDeleteHandler}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Jumbotron>
    );
  }
}

export default TimetableDetails;
