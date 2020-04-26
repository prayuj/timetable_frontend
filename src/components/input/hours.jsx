import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Hours extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.getHourDetails = this.getHourDetails.bind(this);
    this.onHoursHandler = this.onHoursHandler.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps.hours) !== JSON.stringify(this.props.hours))
      this.setState({ hours: this.props.hours });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () => this.getHourDetails());
    }
  }
  getHourDetails() {
    this.props.sendHoursHere(this.state.update, this.state.hours);
  }
  onHoursHandler(event) {
    if (event.target.id == "add") {
      let temp_hours = JSON.parse(JSON.stringify(this.state.hours));
      temp_hours[temp_hours.length] = { name: "", status: true };

      this.setState({
        hours: temp_hours,
        update: true,
      });
    } else if (event.target.className.includes("hour")) {
      let temp_hours = JSON.parse(JSON.stringify(this.state.hours));
      temp_hours[parseInt(event.target.id)].name = event.target.value;
      this.setState({
        hours: temp_hours,
      });
    } else if (event.target.className == "custom-control-input") {
      let temp_hours = JSON.parse(JSON.stringify(this.state.hours));
      let index = parseInt(event.target.id.split(" ")[1]);
      temp_hours[index].status = !temp_hours[index].status;
      this.setState({
        hours: temp_hours,
        update: true,
      });
    } else if (event.target.id == "del") {
      this.setState({
        hours: this.state.hours.slice(0, this.state.hours.length - 1),
        update: true,
      });
    }
  }
  render() {
    console.log("Updated Hours");
    return (
      <Jumbotron
        style={{
          backgroundColor: "white",
          margin: "5% 25%",
          padding: "0% 10% 5% 10%",
        }}
      >
        <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
          Enter Hour Details
        </h2>
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getHourDetails}
        >
          Save & Go Back
        </Button>
        <Row>
          <Col xs={3}></Col>
          <Col></Col>
          <Col xs={4}>Schedule?</Col>
        </Row>
        {this.state.hours.map((hour, key) => (
          <div style={{ padding: "2.5%" }}>
            <Row>
              <Col xs={3}>
                <Form.Label>Hour {key + 1}</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  size="sm"
                  type="text"
                  className="hour input"
                  placeholder="Enter Hour..."
                  id={"" + key}
                  value={hour.name}
                  onChange={this.onHoursHandler}
                />
              </Col>
              <Col xs={3}>
                <Form.Check
                  type="switch"
                  id={"custom-switch " + key}
                  checked={hour.status}
                  label=""
                  onChange={this.onHoursHandler}
                />
              </Col>
            </Row>
          </div>
        ))}

        <Button
          variant="primary"
          onClick={this.onHoursHandler}
          id="add"
          style={{ margin: "2%" }}
        >
          Add
        </Button>
        <Button
          variant="danger"
          onClick={this.onHoursHandler}
          id="del"
          style={{ margin: "2%" }}
        >
          Del
        </Button>
      </Jumbotron>
    );
  }
}

export default Hours;
