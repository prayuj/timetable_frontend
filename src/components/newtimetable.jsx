import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Redirect } from "react-router-dom";

class NewTimetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      desc: "",
      userid: this.props.objectID,
    };
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(event) {
    event.preventDefault();
    console.log("Hey There");
    axios.post("http://127.0.0.1:5000/newtimetable", this.state).then((res) => {
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
            Get Started
          </Button>
        </Form>
        <p></p>
      </Jumbotron>
    );
  }
}

export default NewTimetable;
