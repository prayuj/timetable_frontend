import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Days extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.getDayDetails = this.getDayDetails.bind(this);
    this.onDaysHandler = this.onDaysHandler.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.days) !== JSON.stringify(this.props.days))
      this.setState({ days: this.props.days });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () => this.getDayDetails());
    }
  }
  getDayDetails() {
    this.props.sendDaysHere(this.state.update, this.state.days);
  }
  onDaysHandler(event) {
    if (event.target.id == "add") {
      let temp_days = JSON.parse(JSON.stringify(this.state.days));
      temp_days[temp_days.length] = "";

      this.setState({
        days: temp_days,
        update: true,
      });
    } else if (event.target.className.includes("day")) {
      let temp_days = [...this.state.days];
      temp_days[parseInt(event.target.id)] = event.target.value;
      this.setState({
        days: temp_days,
        update: true,
      });
    } else if (event.target.id == "del") {
      this.setState({
        days: this.state.days.slice(0, this.state.days.length - 1),
        update: true,
      });
    }
  }
  render() {
    return (
      <Jumbotron
        style={{
          backgroundColor: "white",
          margin: "5% 25%",
          padding: "0% 10% 5% 10%",
        }}
      >
        <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
          Enter Day Details
        </h2>
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getDayDetails}
        >
          Save & Go Back
        </Button>
        {this.state.days.map((day, key) => (
          <Row style={{ padding: "2.5%" }}>
            <Col xs={3}>
              <Form.Label>Day {key + 1}</Form.Label>
            </Col>
            <Col>
              <Form.Control
                size="sm"
                className="day input"
                placeholder="Enter Day..."
                id={"" + key}
                value={day}
                onChange={this.onDaysHandler}
                type="text"
              />
            </Col>
          </Row>
        ))}
        <Button
          variant="primary"
          onClick={this.onDaysHandler}
          id="add"
          style={{ margin: "2%" }}
        >
          Add
        </Button>
        <Button
          variant="danger"
          onClick={this.onDaysHandler}
          id="del"
          style={{ margin: "2%" }}
        >
          Del
        </Button>
      </Jumbotron>
    );
  }
}

export default Days;
