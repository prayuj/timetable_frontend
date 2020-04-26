import React, { Component } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Courses from "./input/courses";
import Lecturers from "./input/lecturers";
import StudentGroups from "./input/student groups";
import Days from "./input/days";
import Hours from "./input/hours";
import Rooms from "./input/rooms";
import PopulationAndIteration from "./input/population_and_iteration";

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.data };
    this.state["timetableObjectID"] = props.timetableObjectID;
    this.state["userid"] = props.userid;
    this.state["alert"] = false;
    this.state["current"] = "main";
    this.state["loading"] = false;
    this.onDaysHandler = this.onDaysHandler.bind(this);
    this.onHoursHandler = this.onHoursHandler.bind(this);
    this.onRoomsHandler = this.onRoomsHandler.bind(this);
    this.onCoursesHandler = this.onCoursesHandler.bind(this);
    this.onStudentGroupsHandler = this.onStudentGroupsHandler.bind(this);
    this.onLecturersHandler = this.onLecturersHandler.bind(this);
    this.onPopulationAndIterationsHandler = this.onPopulationAndIterationsHandler.bind(
      this
    );
    this.onSaveHandler = this.onSaveHandler.bind(this);
    this.onButtonHandler = this.onButtonHandler.bind(this);
  }

  onDaysHandler(update, days) {
    this.setState({ current: "main" });
    if (update) {
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      if (this.state.days.length > days.length) {
        for (let i = 0; i < temp_lecturers.length; i++) {
          temp_lecturers[i]["availability"] = temp_lecturers[i][
            "availability"
          ].slice(0, days.length);
        }
      } else if (this.state.days.length < days.length) {
        for (let i = 0; i < temp_lecturers.length; i++) {
          for (let j = this.state.days.length; j < days.length; j++) {
            let new_row = [];
            for (let k = 0; k < this.state.hours.length; k++) {
              new_row.push(true);
            }
            temp_lecturers[i]["availability"].push(new_row);
          }
        }
      }
      this.setState({
        days: days,
        lecturers: temp_lecturers,
      });
    }
  }

  onHoursHandler(update, hours) {
    this.setState({ current: "main" });
    if (update) {
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      if (this.state.hours.length > hours.length) {
        for (let i = 0; i < temp_lecturers.length; i++) {
          for (let j = 0; j < this.state.days.length; j++) {
            temp_lecturers[i]["availability"][j] = temp_lecturers[i][
              "availability"
            ][j].slice(0, hours.length);
          }
        }
      } else if (this.state.hours.length < hours.length) {
        for (let i = 0; i < temp_lecturers.length; i++) {
          for (let j = 0; j < this.state.days.length; j++) {
            for (let k = this.state.hours.length; k < hours.length; k++)
              temp_lecturers[i]["availability"][j].push(true);
          }
        }
      }
      this.setState({
        hours: hours,
        lecturers: temp_lecturers,
      });
    }
  }

  onRoomsHandler(update, rooms) {
    this.setState({ current: "main" });
    if (update) {
      this.setState({
        rooms,
      });
    }
  }

  onCoursesHandler(update, courses) {
    this.setState({ current: "main" });
    if (update) {
      this.setState({
        courses,
      });
    }
  }

  onStudentGroupsHandler(update, student_groups) {
    this.setState({ current: "main" });
    if (update) {
      this.setState({
        student_groups,
      });
    }
  }

  onLecturersHandler(update, lecturers) {
    this.setState({ current: "main" });
    if (update) {
      this.setState({
        lecturers,
      });
    }
  }

  onPopulationAndIterationsHandler(update, population_size, iterations) {
    this.setState({ current: "main" });
    if (update) {
      this.setState({
        population_size,
        iterations,
      });
    }
  }

  onSaveHandler(event) {
    if (this.state.alert) {
      axios
        .post("http://127.0.0.1:5000/update_timetable", this.state)
        .then((res) => {
          window.location.href = "/mainapp/" + this.state.timetableObjectID;
        });
    } else {
      this.setState({
        alert: true,
      });
    }
  }

  onButtonHandler(event) {
    this.setState({
      current: event.target.id,
    });
  }

  rendrSwitch(param) {
    switch (param) {
      case "main":
        return (
          <Jumbotron
            style={{
              backgroundColor: "white",
              margin: "1% 25%",
              padding: "0% 10% 5% 10%",
            }}
          >
            <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
              Set Details
            </h2>
            <Container>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>Day Details</h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="day"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>Hour Details</h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="hour"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>Room Details</h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="room"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>Course Details</h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="course"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>Lecturer Details</h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="lecturer"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>Student Group Details</h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="student group"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col xs={9} style={{ margin: "auto" }}>
                  <h5 style={{ textAlign: "left" }}>
                    Genetic Algorithm Settings
                  </h5>
                </Col>
                <Col xs={3}>
                  <Button
                    variant="success"
                    style={{
                      backgroundColor: "#00adb5",
                      borderColor: "#00adb5",
                      width: "75%",
                    }}
                    id="population and iteration"
                    onClick={this.onButtonHandler}
                  >
                    Set
                  </Button>
                </Col>
              </Row>
              <Row style={{ padding: "2.5%" }}>
                <Col>
                  <Button variant="primary" onClick={this.onSaveHandler}>
                    Save Changes
                  </Button>
                </Col>
              </Row>
            </Container>
            <Alert
              show={this.state.alert}
              variant="danger"
              style={{
                padding: "1%",
                width: "25%",
                position: "fixed",
                top: "20%",
                left: "37%",
              }}
              onClose={() => this.setState({ alert: false })}
              dismissible
            >
              <Alert.Heading>Alert!</Alert.Heading>
              <hr></hr>
              Saving will remove all Generation progress
              <Button
                onClick={this.onSaveHandler}
                variant="outline-danger"
                style={{ marginTop: "5%" }}
              >
                Save
              </Button>
            </Alert>
          </Jumbotron>
        );
      case "day":
        return (
          <Days
            days={this.state.days}
            update={false}
            sendDaysHere={this.onDaysHandler}
          ></Days>
        );
      case "hour":
        return (
          <Hours
            hours={this.state.hours}
            update={false}
            sendHoursHere={this.onHoursHandler}
          ></Hours>
        );
      case "room":
        return (
          <Rooms
            rooms={this.state.rooms}
            update={false}
            sendRoomsHere={this.onRoomsHandler}
          ></Rooms>
        );

      case "course":
        return (
          <Courses
            courses={this.state.courses}
            update={false}
            rooms={this.state.rooms}
            sendCoursesHere={this.onCoursesHandler}
          ></Courses>
        );

      case "lecturer":
        return (
          <Lecturers
            lecturers={this.state.lecturers}
            courses={this.state.courses}
            alert={this.state.current !== "lecturer"}
            update={false}
            sendLecturersHere={this.onLecturersHandler}
            days={this.state.days}
            hours={this.state.hours}
          ></Lecturers>
        );

      case "student group":
        return (
          <StudentGroups
            student_groups={this.state.student_groups}
            courses={this.state.courses}
            alert={this.state.current !== "student_group"}
            update={false}
            sendStudentGroups={this.onStudentGroupsHandler}
          ></StudentGroups>
        );
      case "population and iteration":
        return (
          <PopulationAndIteration
            population_size={this.state.population_size}
            iterations={this.state.iterations}
            alert={this.state.current !== "population"}
            update={false}
            sendPopulationAndIterationsHere={
              this.onPopulationAndIterationsHandler
            }
          ></PopulationAndIteration>
        );
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        {this.state.current === "main" ? (
          <Button
            style={{
              position: "fixed",
              top: "10%",
              left: "1%",
            }}
            id="main"
            onClick={this.props.backButton}
          >
            <span
              class="material-icons"
              id="main"
              style={{ verticalAlign: "bottom" }}
              onClick={this.props.backButton}
            >
              arrow_back
            </span>
            Go to Main Page
          </Button>
        ) : (
          <></>
        )}
        {this.rendrSwitch(this.state.current)}
        {/* <Tabs
          defaultActiveKey="days"
          id="uncontrolled-tab-example"
          style={{ margin: "5% 20%" }}
          activeKey={this.state.current}
          onSelect={(e) => {
            this.setState({ current: e });
          }}
        >
          <Tab eventKey="days" title="Days">
            <Days
              days={this.state.days}
              alert={this.state.current !== "days"}
              sendDaysHere={this.onDaysHandler}
            ></Days>
          </Tab>
          <Tab eventKey="hours" title="Hours">
            <Hours
              hours={this.state.hours}
              alert={this.state.current !== "hours"}
              sendHoursHere={this.onHoursHandler}
            ></Hours>
          </Tab>
          <Tab eventKey="rooms" title="Rooms">
            <Rooms
              rooms={this.state.rooms}
              alert={this.state.current !== "hours"}
              sendRoomsHere={this.onRoomsHandler}
            ></Rooms>
          </Tab>
          <Tab eventKey="course" title="Course">
            <Courses
              courses={this.state.courses}
              rooms={this.state.rooms}
              alert={this.state.current !== "course"}
              sendCoursesHere={this.onCoursesHandler}
            ></Courses>
          </Tab>
          <Tab eventKey="lecturer" title="Lecturer">
            <Lecturers
              lecturers={this.state.lecturers}
              courses={this.state.courses}
              alert={this.state.current !== "lecturer"}
              sendLecturersHere={this.onLecturersHandler}
              days={this.state.days}
              hours={this.state.hours}
            ></Lecturers>
          </Tab>
          <Tab eventKey="student_group" title="Student Group">
            <StudentGroups
              student_groups={this.state.student_groups}
              courses={this.state.courses}
              alert={this.state.current !== "student_group"}
              sendStudentGroups={this.onStudentGroupsHandler}
            ></StudentGroups>
          </Tab>
          <Tab eventKey="population" title="Population and Iterations">
            <PopulationAndIteration
              population_size={this.state.population_size}
              iterations={this.state.iterations}
              alert={this.state.current !== "population"}
              sendPopulationAndIterationsHere={
                this.onPopulationAndIterationsHandler
              }
            ></PopulationAndIteration>
          </Tab>

          <Tab eventKey="save" title="Save">
            <Jumbotron
              style={{
                backgroundColor: "white",
                margin: "5% 30%",
                padding: "5% 10%",
              }}
            >
              <h1>Save and Continue?</h1>
              <p>
                <Button variant="primary" onClick={this.onSaveHandler}>
                  Save
                </Button>
              </p>
            </Jumbotron>
          </Tab>
        </Tabs>
        <Alert
          show={this.state.alert}
          variant="danger"
          style={{
            padding: "1%",
            width: "25%",
            position: "fixed",
            top: "20%",
            left: "37%",
          }}
          onClose={() => this.setState({ alert: false })}
          dismissible
        >
          <Alert.Heading>Alert!</Alert.Heading>
          <hr></hr>
          Saving will remove all Generation progress
          <Button
            onClick={this.onSaveHandler}
            variant="outline-danger"
            style={{ marginTop: "5%" }}
          >
            Save
          </Button>
        </Alert>
       */}
      </div>
    );
  }
}

export default Input;
