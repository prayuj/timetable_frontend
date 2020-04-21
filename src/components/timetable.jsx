import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Draggable from "react-draggable";
import Card from "react-bootstrap/Card";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

class Timetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timetableObjectID: props.timetableObjectID,
      generation_with_maximum: props.generation_with_maximum,
      maximum_chromosome: props.maximum_chromosome,
      show: false,
      popoverShow: false,
      target: "",
      slots_left_to_schedule: [],
      jumbotron_title: "Slots Left to Schedule",
      add_select: false,
      show_alert: false,
    };
    this.handleSlotClick = this.handleSlotClick.bind(this);
    this.removeSlot = this.removeSlot.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleScheduleSlotClick = this.handleScheduleSlotClick.bind(this);
  }

  componentDidMount() {
    axios
      .post("http://127.0.0.1:5000/get_complete_timetable", {
        timetableObjectID: this.state.timetableObjectID,
      })
      .then((res) => {
        this.setState(res.data);
      });
  }

  removeSlot() {
    axios
      .post("http://127.0.0.1:5000/remove_slot", {
        timetableObjectID: this.state.timetableObjectID,
        column_number: parseInt(
          this.state.target.getAttribute("column_number")
        ),
        row_number: parseInt(this.state.target.getAttribute("row_number")),
      })
      .then((res) => {
        this.setState(res.data);
      });
  }

  handleSlotClick(event) {
    this.setState({
      popoverShow: this.state.target,
      target: event.target,
    });
  }

  handleAddClick(event) {
    this.setState({
      day_to_add: event.target.getAttribute("day"),
      hour_to_add: event.target.getAttribute("hour"),
      show: true,
      jumbotron_title: "Choose Slot to Schedule",
    });
  }

  handleScheduleSlotClick(event) {
    if (
      this.state.show &&
      this.state.jumbotron_title === "Choose Slot to Schedule"
    )
      axios
        .post("http://127.0.0.1:5000/add_slot", {
          timetableObjectID: this.state.timetableObjectID,
          day: parseInt(this.state.day_to_add),
          hour: parseInt(this.state.hour_to_add),
          column_number: parseInt(event.target.getAttribute("column_number")),
        })
        .then((res) => {
          if (res.data.status === "done") this.setState(res.data);
          else
            this.setState({
              show_alert: true,
            });
          this.setState({
            show: false,
          });
        });
  }
  render() {
    return (
      <div style={{ position: "absolute" }}>
        <Jumbotron
          style={{
            backgroundColor: "white",
          }}
        >
          <table style={{ tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "2.5%" }}>Day</th>
                <th style={{ width: "5%" }}>Time</th>
                {this.state.student_groups ? (
                  <>
                    {this.state.student_groups.map((val, index) => (
                      <th>{val}</th>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {this.state.table_data ? (
                <>
                  {this.state.table_data.map((data, index) => (
                    <tr>
                      {data.map((item, key) =>
                        item.item == "day" ? (
                          <td
                            rowSpan={this.state.no_of_hours}
                            style={{ writingMode: "sideways-lr" }}
                          >
                            {item.iterable}
                          </td>
                        ) : item.item == "slot" ? (
                          <td>{item.iterable}</td>
                        ) : (
                          <td style={{ width: "100%", height: "100%" }}>
                            <table
                              style={{
                                tableLayout: "fixed",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              <tbody>
                                <tr>
                                  {item.iterable.map((slot, i) =>
                                    i == item.iterable.length - 1 ? (
                                      <>
                                        <td
                                          onClick={this.handleSlotClick}
                                          style={{
                                            backgroundColor: slot.color,
                                          }}
                                          column_number={slot.column_number}
                                          row_number={slot.row_number}
                                        >
                                          {slot.slot}
                                        </td>
                                        <td
                                          style={{ width: "10%" }}
                                          day={slot.day}
                                          hour={slot.hour}
                                          onClick={this.handleAddClick}
                                        >
                                          <span
                                            class="material-icons"
                                            day={slot.day}
                                            hour={slot.hour}
                                          >
                                            add_circle_outline
                                          </span>
                                        </td>
                                      </>
                                    ) : (
                                      <td
                                        onClick={this.handleSlotClick}
                                        style={{ backgroundColor: slot.color }}
                                        column_number={slot.column_number}
                                        row_number={slot.row_number}
                                      >
                                        {slot.slot}
                                      </td>
                                    )
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </>
              ) : (
                <h1>Loading</h1>
              )}
            </tbody>
          </table>
        </Jumbotron>
        {this.state.show ? (
          <Draggable>
            <Jumbotron
              style={{
                backgroundColor: "white",
                margin: "5% 25%",
                textAlign: "center",
                position: "fixed",
                bottom: "2%",
                border: "2px solid black",
              }}
              show={false}
            >
              <h1>{this.state.jumbotron_title}</h1>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  overflow: "auto",
                  height: "250px",
                }}
              >
                {this.state.slots_left_to_schedule.map((slot, index) => (
                  <>
                    <Card
                      style={{
                        margin: "1%",
                        width: "25%",
                        background: slot.color,
                      }}
                      column_number={slot.column_number}
                      onClick={this.handleScheduleSlotClick}
                    >
                      <Card.Body column_number={slot.column_number}>
                        {slot.slot}
                        <Badge variant="primary">{slot.available}</Badge>
                      </Card.Body>
                    </Card>
                  </>
                ))}
              </div>
              <p>
                <Button
                  variant="danger"
                  onClick={() => this.setState({ show: false })}
                >
                  Close
                </Button>
              </p>
            </Jumbotron>
          </Draggable>
        ) : (
          <Button
            variant="success"
            style={{
              position: "fixed",
              top: "10%",
              left: "1%",
            }}
            onClick={() =>
              this.setState({
                show: true,
                jumbotron_title: "Slots Left to Schedule",
              })
            }
          >
            Show
          </Button>
        )}
        <Overlay
          show={this.state.popoverShow}
          target={this.state.target}
          placement="bottom"
          containerPadding={20}
        >
          <Popover
            id="popover-contained"
            style={{ width: "100%", textAlign: "center" }}
            dismissible
          >
            <Popover.Title as="h3">
              Action
              <button style={{ float: "right" }}>
                <span
                  class="material-icons"
                  onClick={() => this.setState({ popoverShow: false })}
                >
                  highlight_off
                </span>
              </button>
            </Popover.Title>
            <Popover.Content>
              <Button
                style={{ width: "60%", margin: "2.5%" }}
                variant="danger"
                onClick={this.removeSlot}
              >
                Remove
              </Button>
              <br></br>
              <Button
                style={{ width: "60%", margin: "2.5%" }}
                variant="primary"
                onClick={this.removeSlot}
              >
                Change Room
              </Button>
            </Popover.Content>
          </Popover>
        </Overlay>

        <Alert
          variant="danger"
          style={{
            position: "fixed",
            top: "10%",
            width: "25%",
            left: "40%",
          }}
          dismissible
          onClose={() => this.setState({ show_alert: false })}
          show={this.state.show_alert}
        >
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>The Slot could not be Scheduled</p>
        </Alert>
      </div>
    );
  }
}

export default Timetable;
