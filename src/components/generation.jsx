import React, { Component } from "react";
import axios from "axios";
import Line from "./line";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

class Generation extends Component {
  constructor(props) {
    super(props);
    this.state = props.state;
    this.state["current"] = "initialised";
    this.state["stop"] = false;
    this.state["progress"] = 0;
    this.getIterationWithMaximum = this.getIterationWithMaximum.bind(this);
    this.processPopulation = this.processPopulation.bind(this);
  }
  getIterationWithMaximum() {
    console.log("getIterationWithMaximum");
    let chart_data = this.state.chart_data.slice(1);
    let iterationWithMaximum = 0;
    let maximumFitness = 0;
    for (let i = 0; i <= this.state.data.iterations; i++) {
      console.log(i);
      if (maximumFitness <= chart_data[i][1]) {
        iterationWithMaximum = i;
        maximumFitness = chart_data[i][1];
      }
      this.setState({
        generation_with_maximum: iterationWithMaximum,
      });
    }
    if (iterationWithMaximum === 0) {
      iterationWithMaximum = "Intial Population";
    } else if (iterationWithMaximum === 1) {
      iterationWithMaximum = "First Generation";
    } else if (iterationWithMaximum === 2) {
      iterationWithMaximum = "Two Generation";
    } else if (iterationWithMaximum === 3) {
      iterationWithMaximum = "Three Generation";
    } else if (iterationWithMaximum === 4) {
      iterationWithMaximum = "Four Generation";
    } else if (iterationWithMaximum === 5) {
      iterationWithMaximum = "Fifth Generation";
    } else if (iterationWithMaximum === 6) {
      iterationWithMaximum = "Sixth Generation";
    } else if (iterationWithMaximum === 7) {
      iterationWithMaximum = "Seventh Generation";
    } else if (iterationWithMaximum === 8) {
      iterationWithMaximum = "Eighth Generation";
    } else if (iterationWithMaximum === 9) {
      iterationWithMaximum = "Ninth Generation";
    } else if (iterationWithMaximum === 10) {
      iterationWithMaximum = "Tenth Generation";
    }
    this.setState({
      iterationWithMaximum,
      maximumFitness,
      current: "done",
    });
  }

  processPopulation() {
    console.log("processPopulation");
    this.setState(
      {
        current: "processing",
      },
      () => {
        if (!this.state.stop)
          for (let i = 0; i < this.state.data.population_size; i++) {
            console.log(i);
            axios
              .post("http://127.0.0.1:5000/fill_target_matrix", {
                i: i,
                column_numbers: this.state.population[i],
                generation: this.state.generation,
                timetableObjectID: this.state.timetableObjectID,
              })
              .then((res) => {
                console.log(res.data);
                this.setState(
                  {
                    progress: this.state.progress + 1,
                  },
                  () => {
                    if (
                      this.state.data.population_size <= this.state.progress &&
                      this.state.data.iterations > this.state.generation
                    ) {
                      console.log("Cond 1");
                      axios
                        .post("http://127.0.0.1:5000/genetic_algorithm", {
                          generation: this.state.generation,
                          timetableObjectID: this.state.timetableObjectID,
                        })
                        .then((result) => {
                          let new_chart_data = this.state.chart_data;
                          new_chart_data.push([
                            this.state.generation,
                            result.data.maximum,
                            result.data.average,
                            result.data.minimum,
                          ]);
                          this.setState(
                            {
                              chart_data: new_chart_data,
                              progress: 0,
                              population: result.data.new_population,
                              generation: this.state.generation + 1,
                            },
                            () => {
                              this.processPopulation();
                            }
                          );
                        });
                    } else if (
                      this.state.data.population_size <= this.state.progress &&
                      this.state.data.iterations <= this.state.generation
                    ) {
                      console.log("Cond 2");
                      axios
                        .post("http://127.0.0.1:5000/genetic_algorithm", {
                          generation: this.state.generation,
                          timetableObjectID: this.state.timetableObjectID,
                        })
                        .then((result) => {
                          let new_chart_data = this.state.chart_data;
                          new_chart_data.push([
                            this.state.generation,
                            result.data.maximum,
                            result.data.average,
                            result.data.minimum,
                          ]);
                          this.setState(
                            {
                              chart_data: new_chart_data,
                              progress: 0,
                              generation: this.state.generation + 1,
                              // current: "start_processing_popultaion",
                              // generation: "first_generation",
                            },
                            () => {
                              this.setState({ current: "compute_maximum" });
                            }
                          );
                        });
                    }
                  }
                );
              })
              .catch((err) => {
                console.log(err);
              });
          }
      }
    );
  }

  renderSwitch(data) {
    console.log(data);
    switch (data) {
      case "initialising":
        return (
          <div>
            Initialising
            <Spinner animation="border" />
          </div>
        );

      case "initialised":
        if (this.state.generation > this.state.data.iterations)
          this.setState({ current: "compute_maximum" });
        return (
          <div>
            <h3>Current Iteration: Generation{this.state.generation}</h3>
            {this.state.generation == 0 ? (
              <Button
                variant="success"
                onClick={() => {
                  this.processPopulation();
                }}
                style={{
                  backgroundColor: "#ff2e63",
                  borderColor: "#ff2e63",
                }}
              >
                Begin?
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => {
                  this.processPopulation();
                }}
                style={{
                  backgroundColor: "#ff2e63",
                  borderColor: "#ff2e63",
                }}
              >
                Resume
              </Button>
            )}
          </div>
        );

      case "start_processing_popultaion":
        console.log("Here");
        // this.processPopulation();
        return <div>Start New</div>;
      case "processing":
        return (
          <div>
            <h3>Current Iteration: Generation{this.state.generation}</h3>
            {this.state.progress}/{this.state.data.population_size} done
            {this.state.stop ? (
              <Button
                variant="success"
                onClick={() => {
                  this.processPopulation();
                  this.setState({ stop: false });
                }}
              >
                Resume
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => {
                  this.setState({ stop: true });
                }}
              >
                STOP
              </Button>
            )}
          </div>
        );
      case "compute_maximum":
        this.getIterationWithMaximum();
        break;
      case "done":
        return (
          <div>
            <h3>All Iterations are complete</h3>
            <h4>
              Looks like the <b>{this.state.iterationWithMaximum}</b> has the
              highest fitness of {this.state.maximumFitness}
            </h4>
            <Button
              variant="success"
              onClick={() => {
                this.props.sendDataHere({
                  generation_with_maximum: this.state.generation_with_maximum,
                  timetableObjectID: this.state.timetableObjectID,
                });
              }}
            >
              Proceed to Display Timetable
            </Button>
          </div>
        );
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
            textAlign: "center",
            padding: "5%",
            margin: "5%",
            backgroundColor: "white",
          }}
        >
          <h1>Genetic Algorithm </h1>

          <Row>
            <Col>
              {this.state.chart_data.length == 1 ? (
                <div>
                  <h3>This Chart will load once data comes in</h3>
                </div>
              ) : (
                <Line
                  data={this.state.chart_data}
                  iterations={this.state.data.iterations}
                ></Line>
              )}
            </Col>
            <Col>
              {this.renderSwitch(this.state.current)}
              <ProgressBar
                style={{ margin: "2%" }}
                animated
                now={
                  (this.state.progress * 100) / this.state.data.population_size
                }
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Generation;
