import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Link } from "react-router-dom";

class UpdateTimetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timetableObjectID: window.location.pathname.split("/updatetimetable/")[1],
      userid: this.props.objectID,
    };
    this.submitForm = this.submitForm.bind(this);
    this.getTimetableDetails = this.getTimetableDetails.bind(this);
  }
  componentDidMount() {
    this.getTimetableDetails();
  }
  getTimetableDetails() {
    axios
      .get(
        "http://127.0.0.1:5000/timetabledetails/user=" +
          this.state.userid +
          "&timetableObjectID=" +
          this.state.timetableObjectID
      )
      .then((res) => {
        this.setState(res.data);
      });
  }
  submitForm(event) {
    event.preventDefault();
    console.log(this.state);
    axios
      .post("http://127.0.0.1:5000/updatetimetabledetails", this.state)
      .then((res) => {
        window.location.href = "/mainapp/" + res.data.timetableObjectID;
      });
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
        <h1>Let's Start Generating a New Timetable</h1>
        <Form onSubmit={this.submitForm}>
          <Form.Group>
            <Form.Label style={{ float: "left" }}>Timetable Title</Form.Label>
            <Form.Control
              type="text"
              value={this.state.title}
              placeholder="Enter Title"
              onChange={(event) => {
                this.setState({
                  title: event.target.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ float: "left" }}>
              Timetable Description
            </Form.Label>
            <Form.Control
              as="textarea"
              value={this.state.desc}
              placeholder="Enter Description"
              onChange={(event) => {
                this.setState({
                  desc: event.target.value,
                });
              }}
            />
          </Form.Group>
          <Button
            variant="primary"
            style={{
              backgroundColor: "#00adb5",
              borderColor: "#00adb5",
            }}
            type="submit"
          >
            Update
          </Button>
        </Form>
        <p></p>
      </Jumbotron>
    );
  }
}

export default UpdateTimetable;
