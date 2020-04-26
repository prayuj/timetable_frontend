import React, { Component } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

class Input extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = props.data;
    this.state["timetableObjectID"] = props.timetableObjectID;
    this.state["userid"] = props.userid;
    this.state["alert"] = false;
    this.onDaysHandler = this.onDaysHandler.bind(this);
    this.onHoursHandler = this.onHoursHandler.bind(this);
    this.onRoomsHandler = this.onRoomsHandler.bind(this);
    this.onCoursesHandler = this.onCoursesHandler.bind(this);
    this.onStudentGroupsHandler = this.onStudentGroupsHandler.bind(this);
    this.onLecturersHandler = this.onLecturersHandler.bind(this);
    this.onSaveHandler = this.onSaveHandler.bind(this);
  }

  onDaysHandler(event) {
    if (event.target.id == "add") {
      let temp_days = JSON.parse(JSON.stringify(this.state.days));
      temp_days[temp_days.length] = "";
      // Update Lecturer Availability
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      let new_row = [];
      for (let j = 0; j < this.state.hours.length; j++) {
        new_row.push(true);
      }
      console.log(new_row);
      for (let i = 0; i < temp_lecturers.length; i++) {
        temp_lecturers[i]["availability"].push(new_row);
      }

      this.setState({
        days: temp_days,
        lecturers: temp_lecturers,
      });
    } else if (event.target.className.includes("day")) {
      let temp_days = [...this.state.days];
      temp_days[parseInt(event.target.id)] = event.target.value;
      this.setState({
        days: temp_days,
      });
    } else if (event.target.id == "del") {
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      for (let i = 0; i < temp_lecturers.length; i++) {
        temp_lecturers[i]["availability"] = temp_lecturers[i][
          "availability"
        ].slice(0, this.state.days.length - 1);
      }

      this.setState({
        days: this.state.days.slice(0, this.state.days.length - 1),
        lecturers: temp_lecturers,
      });
    }
  }
  onHoursHandler(event) {
    if (event.target.id == "add") {
      let temp_hours = this.state.hours;
      temp_hours[temp_hours.length] = { name: "", status: true };

      let temp_lecturers = this.state.lecturers;
      for (let i = 0; i < temp_lecturers.length; i++)
        for (let j = 0; j < this.state.days.length; j++) {
          temp_lecturers[i]["availability"][j].push(true);
        }

      this.setState({
        hours: temp_hours,
        lecturers: temp_lecturers,
      });
    } else if (event.target.className.includes("hour")) {
      let temp_hours = this.state.hours;
      temp_hours[parseInt(event.target.id)].name = event.target.value;
      this.setState({
        hours: temp_hours,
      });
    } else if (event.target.className == "custom-control-input") {
      let temp_hours = this.state.hours;
      let index = parseInt(event.target.id.split(" ")[1]);
      temp_hours[index].status = !temp_hours[index].status;
      this.setState({
        hours: temp_hours,
      });
    } else if (event.target.id == "del") {
      let temp_lecturers = this.state.lecturers;
      for (let i = 0; i < temp_lecturers.length - 1; i++) {
        temp_lecturers[i]["availability"] = temp_lecturers[i][
          "availability"
        ].slice(0, this.state.hours.length - 1);
      }
      this.setState({
        hours: this.state.hours.slice(0, this.state.hours.length - 1),
        lecturers: temp_lecturers,
      });
    }
  }
  onRoomsHandler(event) {
    if (event.target.id == "add") {
      let temp_rooms = this.state.rooms;
      temp_rooms[temp_rooms.length] = "";
      this.setState({
        rooms: temp_rooms,
      });
    } else if (event.target.className.includes("room")) {
      let temp_rooms = this.state.rooms;
      temp_rooms[parseInt(event.target.id)] = event.target.value;
      this.setState({
        rooms: temp_rooms,
      });
    } else if (event.target.id == "del") {
      this.setState({
        rooms: this.state.rooms.slice(0, this.state.rooms.length - 1),
      });
    }
  }
  onStudentGroupsHandler(event) {
    console.log(event.target);
    if (event.target.id == "add") {
      let temp_student_groups = this.state.student_groups;
      temp_student_groups[temp_student_groups.length] = {
        name: "",
        courses: [""],
      };
      this.setState({
        student_groups: temp_student_groups,
      });
    } else if (event.target.id == "del") {
      this.setState({
        student_groups: this.state.student_groups.slice(
          0,
          this.state.student_groups.length - 1
        ),
      });
    } else if (event.target.id.split(" ")[0] === "add") {
      let temp_student_groups = this.state.student_groups;
      temp_student_groups[parseInt(event.target.id.split(" ")[1])]["courses"][
        temp_student_groups[parseInt(event.target.id.split(" ")[1])][
          "courses"
        ].length
      ] = "";
      this.setState({
        student_groups: temp_student_groups,
      });
    } else if (event.target.id.split(" ")[0] === "del") {
      let temp_student_groups = this.state.student_groups;
      temp_student_groups[parseInt(event.target.id.split(" ")[1])][
        "courses"
      ] = temp_student_groups[parseInt(event.target.id.split(" ")[1])][
        "courses"
      ].slice(
        0,
        temp_student_groups[parseInt(event.target.id.split(" ")[1])]["courses"]
          .length - 1
      );
      this.setState({
        student_groups: temp_student_groups,
      });
    } else if (event.target.className.includes("student_grp")) {
      let temp_student_groups = this.state.student_groups;
      temp_student_groups[parseInt(event.target.id)]["name"] =
        event.target.value;
      this.setState({
        student_groups: temp_student_groups,
      });
    } else if (event.target.id.split(" ")[0] === "student_grp") {
      let temp_student_groups = this.state.student_groups;
      for (let i = 0; i < temp_student_groups.length; i++) {
        if (i == event.target.id.split(" ")[1]) {
          for (let j = 0; j < temp_student_groups[i]["courses"].length; j++) {
            if (j == event.target.id.split(" ")[2]) {
              temp_student_groups[i]["courses"][j] = event.target.value;
              break;
            }
          }
          break;
        }
      }
      this.setState({
        student_groups: temp_student_groups,
      });
    }
  }
  onCoursesHandler(event) {
    console.log(event.target);
    // Add new Course
    if (event.target.id == "add") {
      let temp_courses = this.state.courses;
      temp_courses[temp_courses.length] = {
        course_id: "",
        course_name: "",
        no_of_hours_to_schedule_when_assigning: "",
        max_no_hours_per_day: "",
        no_hours_per_week: "",
        max_consecutive_hours_per_day: "",
        valid_rooms: [""],
      };
      this.setState({
        courses: temp_courses,
      });
    }
    // Delete Last Course
    else if (event.target.id == "del") {
      this.setState({
        courses: this.state.courses.slice(0, this.state.courses.length - 1),
      });
    }
    //Add New rooms to Course
    else if (event.target.id.split(" ")[0] === "add") {
      let temp_courses = this.state.courses;
      let index = parseInt(event.target.id.split(" ")[1]);
      temp_courses[index]["valid_rooms"][
        temp_courses[index]["valid_rooms"].length
      ] = "";
      this.setState({
        courses: temp_courses,
      });
    }
    //Delete Last room of Course
    else if (event.target.id.split(" ")[0] === "del") {
      let temp_courses = this.state.courses;
      let index = parseInt(event.target.id.split(" ")[1]);
      temp_courses[index]["valid_rooms"] = temp_courses[index][
        "valid_rooms"
      ].slice(0, temp_courses[index]["valid_rooms"].length - 1);
      this.setState({
        courses: temp_courses,
      });
    }
    // Edit Valid Room Details
    else if (event.target.id.split(" ")[0] === "room") {
      let temp_courses = this.state.courses;
      let index1 = parseInt(event.target.id.split(" ")[1]);
      let index2 = parseInt(event.target.id.split(" ")[2]);
      temp_courses[index1]["valid_rooms"][index2] = event.target.value;
      this.setState({
        courses: temp_courses,
      });
    }
    // Edit other properties
    else {
      let temp_courses = this.state.courses;
      temp_courses[parseInt(event.target.id.split(" ")[1])][
        event.target.id.split(" ")[0]
      ] = event.target.value;
      this.setState({
        courses: temp_courses,
      });
    }
  }
  onLecturersHandler(event) {
    console.log(event.target);
    // Add new Lecturer
    if (event.target.id == "add") {
      let temp_lecturers = this.state.lecturers;
      let availability = [];
      for (let i = 0; i < this.state.days.length; i++) {
        let row = [];
        for (let j = 0; j < this.state.hours.length; j++) {
          row.push(true);
        }
        availability.push(row);
      }
      temp_lecturers[temp_lecturers.length] = {
        name: "",
        department: "",
        max_no_hours_per_day: "",
        max_no_hours_per_week: "",
        max_consecutive_hours: "",
        rank: "",
        availability: availability,
        courses: [""],
      };
      this.setState({
        lecturers: temp_lecturers,
      });
    }
    // Delete Last Lecturer
    else if (event.target.id == "del") {
      this.setState({
        lecturers: this.state.lecturers.slice(
          0,
          this.state.lecturers.length - 1
        ),
      });
    }
    //Add New Course to Leturer
    else if (event.target.id.split(" ")[0] === "add") {
      let temp_lecturers = this.state.lecturers;
      for (let i = 0; i < temp_lecturers.length; i++) {
        if (i == event.target.id.split(" ")[1]) {
          console.log("Here");
          temp_lecturers[i]["courses"][temp_lecturers[i]["courses"].length] =
            "";
          break;
        }
      }
      this.setState({
        lecturers: temp_lecturers,
      });
    }
    //Delete Last Course of Lecturer
    else if (event.target.id.split(" ")[0] === "del") {
      let temp_lecturers = this.state.lecturers;
      for (let i = 0; i < temp_lecturers.length; i++) {
        if (i == event.target.id.split(" ")[1]) {
          temp_lecturers[i]["courses"] = temp_lecturers[i]["courses"].slice(
            0,
            temp_lecturers[i]["courses"].length - 1
          );
          break;
        }
      }
      this.setState({
        lecturers: temp_lecturers,
      });
    }
    // Edit Valid Course Details
    else if (event.target.id.split(" ")[0] === "lecturer") {
      let temp_lecturers = this.state.lecturers;
      for (let i = 0; i < temp_lecturers.length; i++) {
        if (i == event.target.id.split(" ")[2]) {
          for (let j = 0; j < temp_lecturers[i]["courses"].length; j++) {
            if (j == event.target.id.split(" ")[3]) {
              if (event.target.id.split(" ")[1] == "course") {
                temp_lecturers[i]["courses"][j] =
                  event.target.value +
                  " " +
                  temp_lecturers[i]["courses"][j].split(" ")[1];
              } else {
                temp_lecturers[i]["courses"][j] =
                  temp_lecturers[i]["courses"][j].split(" ")[0] +
                  " " +
                  event.target.value;
              }
              break;
            }
          }
          break;
        }
      }
      this.setState({
        lecturers: temp_lecturers,
      });
    }
    // Edit other properties
    else {
      let temp_lecturers = this.state.lecturers;
      let attr = event.target.id.split(" ")[0];
      if (attr === "avail") {
        let index = parseInt(event.target.id.split(" ")[1]);
        let i = parseInt(event.target.id.split(" ")[2]);
        let j = parseInt(event.target.id.split(" ")[3]);
        temp_lecturers[index].availability[i][j] = !temp_lecturers[index]
          .availability[i][j];
      } else {
        let index = parseInt(event.target.id.split(" ")[1]);
        temp_lecturers[index][attr] = event.target.value;
      }
      this.setState({
        lecturers: temp_lecturers,
      });
    }
  }

  onSaveHandler() {
    if (this.state.alert)
      axios
        .post("http://127.0.0.1:5000/update_timetable", this.state)
        .then((res) => {
          window.location.href = "/mainapp/" + this.state.timetableObjectID;
        });
    else
      this.setState({
        alert: true,
      });
  }
  render() {
    return (
      <div>
        {/* <Button style={{ margin: "5%" }}>Save</Button> */}
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
        </Button>

        <Tabs
          defaultActiveKey="days"
          id="uncontrolled-tab-example"
          style={{ margin: "5% 20%" }}
        >
          <Tab eventKey="days" title="Days">
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
          </Tab>
          <Tab eventKey="hours" title="Hours">
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
          </Tab>
          <Tab eventKey="rooms" title="Rooms">
            <Jumbotron
              style={{
                backgroundColor: "white",
                margin: "5% 25%",
                padding: "0% 10% 5% 10%",
              }}
            >
              <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
                Enter Room Details
              </h2>
              {this.state.rooms.map((room, key) => (
                <Row style={{ padding: "2.5%" }}>
                  <Col xs={3}>
                    <Form.Label>Room {key + 1}</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      size="sm"
                      type="text"
                      className="room input"
                      placeholder="Enter Room..."
                      id={"" + key}
                      value={room}
                      onChange={this.onRoomsHandler}
                    />
                  </Col>
                  <br></br>
                </Row>
              ))}

              <Button
                variant="primary"
                onClick={this.onRoomsHandler}
                id="add"
                style={{ margin: "2%" }}
              >
                Add
              </Button>
              <Button
                variant="danger"
                onClick={this.onRoomsHandler}
                id="del"
                style={{ margin: "2%" }}
              >
                Del
              </Button>
            </Jumbotron>
          </Tab>
          <Tab eventKey="course" title="Course">
            <Jumbotron
              style={{
                backgroundColor: "white",
                margin: "5% 25%",
                padding: "0% 5% 5% 5%",
              }}
            >
              <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
                Enter Course Details
              </h2>
              {this.state.courses.map((course, key) => (
                <div
                  style={{
                    padding: "5%",
                    border: "3px solid #393e46",
                    margin: "5%",
                  }}
                >
                  <h3>Course #{key + 1}</h3>
                  <br></br>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Course Id</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"course_id " + key}
                        value={course.course_id}
                        onChange={this.onCoursesHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Course Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"course_name " + key}
                        value={course.course_name}
                        onChange={this.onCoursesHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>No of Hours per Week:</Form.Label>
                    </Col>
                    <Col style={{ margin: "auto" }}>
                      <Form.Control
                        size="sm"
                        id={"no_hours_per_week " + key}
                        value={course.no_hours_per_week}
                        onChange={this.onCoursesHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>
                        Number of Hours to Schedule when Assigning
                      </Form.Label>
                    </Col>
                    <Col style={{ margin: "auto" }}>
                      <Form.Control
                        size="sm"
                        id={"no_of_hours_to_schedule_when_assigning " + key}
                        value={course.no_of_hours_to_schedule_when_assigning}
                        onChange={this.onCoursesHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Maximum number of hours per day</Form.Label>
                    </Col>
                    <Col style={{ margin: "auto" }}>
                      <Form.Control
                        size="sm"
                        id={"max_no_hours_per_day " + key}
                        value={course.max_no_hours_per_day}
                        onChange={this.onCoursesHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Maximum consecutive hours per day</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"max_consecutive_hours_per_day " + key}
                        value={course.max_consecutive_hours_per_day}
                        onChange={this.onCoursesHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      margin: "2.5%",
                    }}
                  >
                    <Col>
                      <h5
                        style={{
                          margin: "2.5%",
                          padding: "2.5%",
                          borderBottom: "1px solid #222831",
                        }}
                      >
                        Valid Rooms
                      </h5>
                    </Col>
                  </Row>
                  {course.valid_rooms.map((room, index) => (
                    <div>
                      <Row style={{ padding: "2.5%" }}>
                        <Col xs={6} style={{ textAlign: "left" }}>
                          {"Room " + (index + 1)}
                        </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            onChange={this.onCoursesHandler}
                            id={"room " + key + " " + index}
                            value={room}
                          >
                            (<option value="">Make a selection</option>)
                            {this.state.rooms.map((aval_room) => (
                              <option value={aval_room}>{aval_room}</option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    onClick={this.onCoursesHandler}
                    class="room"
                    id={"add " + key}
                    style={{ margin: "2%" }}
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    class="room"
                    onClick={this.onCoursesHandler}
                    id={"del " + key}
                    style={{ margin: "2%" }}
                  >
                    -
                  </Button>
                </div>
              ))}

              <Button
                variant="primary"
                onClick={this.onCoursesHandler}
                id="add"
                style={{ margin: "2%" }}
              >
                Add
              </Button>
              <Button
                variant="danger"
                onClick={this.onCoursesHandler}
                id="del"
                style={{ margin: "2%" }}
              >
                Del
              </Button>
            </Jumbotron>
          </Tab>
          <Tab eventKey="student_group" title="Student Group">
            <Jumbotron
              style={{
                backgroundColor: "white",
                margin: "5% 25%",
                padding: "0% 5% 5% 5%",
              }}
            >
              <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
                Enter Student Group Details
              </h2>
              {this.state.student_groups.map((student_group, key) => (
                <div
                  style={{
                    padding: "5%",
                    border: "3px solid #393e46",
                    margin: "5%",
                  }}
                >
                  <h3>Student Group #{key + 1}</h3>
                  <br></br>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Student Group Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        className="student_grp"
                        id={"" + key}
                        value={student_group.name}
                        onChange={this.onStudentGroupsHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      margin: "2.5%",
                    }}
                  >
                    <Col>
                      <h5
                        style={{
                          margin: "2.5%",
                          padding: "2.5%",
                          borderBottom: "1px solid #222831",
                        }}
                      >
                        Valid Courses
                      </h5>
                    </Col>
                  </Row>
                  {student_group.courses.map((course, index) => (
                    <div>
                      <Row style={{ padding: "2.5%" }}>
                        <Col xs={6} style={{ textAlign: "left" }}>
                          {"Course " + (index + 1)}
                        </Col>

                        <Col>
                          <Form.Control
                            as="select"
                            onChange={this.onStudentGroupsHandler}
                            id={"student_grp " + key + " " + index}
                            value={course}
                          >
                            <option value="">Make a selection</option>
                            {this.state.courses.map((aval_course) => (
                              <option value={aval_course.course_id}>
                                {aval_course.course_id}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    onClick={this.onStudentGroupsHandler}
                    class="room"
                    id={"add " + key}
                    style={{ margin: "2%" }}
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    class="room"
                    onClick={this.onStudentGroupsHandler}
                    id={"del " + key}
                    style={{ margin: "2%" }}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button
                variant="primary"
                onClick={this.onStudentGroupsHandler}
                id="add"
                style={{ margin: "2%" }}
              >
                Add
              </Button>
              <Button
                variant="danger"
                onClick={this.onStudentGroupsHandler}
                id="del"
                style={{ margin: "2%" }}
              >
                Del
              </Button>
            </Jumbotron>
          </Tab>
          <Tab eventKey="lecturer" title="Lecturer">
            <Jumbotron
              style={{
                backgroundColor: "white",
                margin: "5% 25%",
                padding: "0% 5% 5% 5%",
              }}
            >
              <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
                Enter Lecturer Details
              </h2>
              {this.state.lecturers.map((lecturer, key) => (
                <div
                  style={{
                    padding: "5%",
                    border: "3px solid #393e46",
                    margin: "5%",
                  }}
                >
                  <h3>Lecturer #{key + 1}</h3>
                  <br></br>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Lecturer Name</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"name " + key}
                        value={lecturer.name}
                        onChange={this.onLecturersHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Department</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"department " + key}
                        value={lecturer.department}
                        onChange={this.onLecturersHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Maximum number of hours per day</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"max_no_hours_per_day " + key}
                        value={lecturer.max_no_hours_per_day}
                        onChange={this.onLecturersHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Maximum number of Hours per Week</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"max_no_hours_per_week " + key}
                        value={lecturer.max_no_hours_per_week}
                        onChange={this.onLecturersHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Maximum consecutive hours per day</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"max_consecutive_hours " + key}
                        value={lecturer.max_consecutive_hours}
                        onChange={this.onLecturersHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Rank</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        size="sm"
                        id={"rank " + key}
                        value={lecturer.rank}
                        onChange={this.onLecturersHandler}
                      ></Form.Control>
                    </Col>
                  </Row>
                  <Row style={{ padding: "2.5%" }}>
                    <Col xs={6} style={{ textAlign: "left" }}>
                      <Form.Label>Availabilty Slots</Form.Label>
                    </Col>
                    <Col>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>D\H</th>
                            {this.state.hours.map((hour, num) => (
                              <th>{num + 1}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.days.map((day, i) => (
                            <tr>
                              <th>{i + 1}</th>
                              {this.state.hours.map((hour, j) => (
                                <th>
                                  <Form.Check
                                    id={"avail " + key + " " + i + " " + j}
                                    checked={lecturer.availability[i][j]}
                                    onChange={this.onLecturersHandler}
                                  ></Form.Check>
                                </th>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row
                    style={{
                      margin: "2.5%",
                    }}
                  >
                    <Col>
                      <h5
                        style={{
                          margin: "2.5%",
                          padding: "2.5%",
                          borderBottom: "1px solid #222831",
                        }}
                      >
                        Courses
                      </h5>
                    </Col>
                  </Row>
                  {lecturer.courses.map((course, index) => (
                    <div>
                      <Row style={{ padding: "2.5%" }}>
                        <Col xs={3} style={{ textAlign: "left" }}>
                          {"Course " + (index + 1)}
                        </Col>
                        <Col sm={5}>
                          <Form.Control
                            size="sm"
                            as="select"
                            onChange={this.onLecturersHandler}
                            id={"lecturer course " + key + " " + index}
                            value={course.split(" ")[0]}
                          >
                            <option value="">Select</option>
                            {this.state.courses.map((aval_course) => (
                              <option value={aval_course.course_id}>
                                {aval_course.course_id}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                        <Col sm={4}>
                          <Form.Control
                            size="sm"
                            className="type_course"
                            id={"lecturer type_course " + key + " " + index}
                            value={course.split(" ")[1]}
                            onChange={this.onLecturersHandler}
                          ></Form.Control>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    variant="primary"
                    onClick={this.onLecturersHandler}
                    class="course"
                    style={{ margin: "2%" }}
                    id={"add " + key}
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    class="course"
                    style={{ margin: "2%" }}
                    onClick={this.onLecturersHandler}
                    id={"del " + key}
                  >
                    -
                  </Button>
                </div>
              ))}

              <Button
                variant="primary"
                onClick={this.onLecturersHandler}
                id="add"
                style={{ margin: "2%" }}
              >
                Add
              </Button>
              <Button
                variant="danger"
                onClick={this.onLecturersHandler}
                id="del"
                style={{ margin: "2%" }}
              >
                Del
              </Button>
            </Jumbotron>
          </Tab>
          <Tab eventKey="population" title="Population and Iterations">
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
                      if (
                        !isNaN(event.target.value) &&
                        event.target.value != ""
                      ) {
                        if (
                          0 <= parseInt(event.target.value) &&
                          100 >= parseInt(event.target.value)
                        )
                          this.setState({
                            population_size: parseInt(event.target.value),
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
                      if (
                        !isNaN(event.target.value) &&
                        event.target.value != ""
                      ) {
                        if (
                          0 <= parseInt(event.target.value) &&
                          100 >= parseInt(event.target.value)
                        )
                          this.setState({
                            iterations: parseInt(event.target.value),
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
                      })
                    }
                    custom
                    min={0}
                    max={100}
                  />
                </Col>
              </Row>
            </Jumbotron>
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
      </div>
    );
  }
}

export default Input;
