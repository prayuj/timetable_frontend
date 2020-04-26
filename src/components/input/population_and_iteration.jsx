import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class PopulationAndIteration extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.getPopulationAndIterationDetails = this.getPopulationAndIterationDetails.bind(
      this
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.population_size) !==
      JSON.stringify(this.props.population_size)
    )
      this.setState({ population_size: this.props.population_size });
    else if (
      JSON.stringify(prevProps.iterations) !==
      JSON.stringify(this.props.iterations)
    )
      this.setState({ iterations: this.props.iterations });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () =>
        this.getPopulationAndIterationDetails()
      );
    }
  }
  getPopulationAndIterationDetails() {
    this.props.sendPopulationAndIterationsHere(
      this.state.update,
      this.state.population_size,
      this.state.iterations
    );
  }
  render() {
    return (
      <Jumbotron
        style={{
          backgroundColor: "white",
          margin: "5% 25%",
          padding: "0% 5% 5% 5%",
        }}
      >
        <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
          Enter Population and Iteration Details
        </h2>
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getPopulationAndIterationDetails}
        >
          Save & Go Back
        </Button>
        <Row style={{ padding: "2.5%" }}>
          <Col xs={8}>
            <Form.Label>Population</Form.Label>
          </Col>
          <Col>
            <Form.Control
              size="sm"
              value={this.state.population_size}
              onChange={(event) => {
                console.log(event.target.value);
                if (!isNaN(event.target.value) && event.target.value != "") {
                  if (
                    0 <= parseInt(event.target.value) &&
                    100 >= parseInt(event.target.value)
                  )
                    this.setState({
                      population_size: parseInt(event.target.value),
                      update: true,
                    });
                }
              }}
            ></Form.Control>
          </Col>
        </Row>
        <Row style={{ padding: "2.5%" }}>
          <Col>
            <Form.Control
              type="range"
              value={this.state.population_size}
              onChange={(event) =>
                this.setState({
                  population_size: parseInt(event.target.value),
                  update: true,
                })
              }
              custom
              min={0}
              max={100}
            />
          </Col>
        </Row>
        <Row style={{ padding: "2.5%" }}>
          <Col xs={8}>
            <Form.Label>Iterations</Form.Label>
          </Col>
          <Col>
            <Form.Control
              size="sm"
              value={this.state.iterations}
              onChange={(event) => {
                console.log(event.target.value);
                if (!isNaN(event.target.value) && event.target.value != "") {
                  if (
                    0 <= parseInt(event.target.value) &&
                    100 >= parseInt(event.target.value)
                  )
                    this.setState({
                      iterations: parseInt(event.target.value),
                      update: true,
                    });
                }
              }}
            ></Form.Control>
          </Col>
        </Row>
        <Row style={{ padding: "2.5%" }}>
          <Col>
            <Form.Control
              type="range"
              value={this.state.iterations}
              onChange={(event) =>
                this.setState({
                  iterations: parseInt(event.target.value),
                  update: true,
                })
              }
              custom
              min={0}
              max={100}
            />
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}

export default PopulationAndIteration;
