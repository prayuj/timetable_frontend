import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    // this.props.onCoursesHandler = this.props.onCoursesHandler.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.update_index === this.state.index;
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.course) !== JSON.stringify(this.props.course))
      this.setState({ course: this.props.course });
    else if (
      JSON.stringify(prevProps.rooms) !== JSON.stringify(this.props.rooms)
    )
      this.setState({ rooms: this.props.rooms });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () =>
        this.sendCourseDetailsHandler()
      );
    }
  }

  sendCourseDetailsHandler() {
    if (this.state.alert) {
      this.props.sendCourseDetails(
        this.state.update,
        this.state.course,
        this.state.index
      );
    }
  }

  onCoursesHandler(event) {
    let id = event.target.id;
    if (id.includes("room")) {
      const course_index = parseInt(id.split(" ")[1]);
      const room_index = parseInt(id.split(" ")[2]);
      let temp_course = JSON.parse(JSON.stringify(this.state.course));
      temp_course.valid_rooms[room_index] = event.target.value;
      this.setState({ course: temp_course, update: true });
    } else if (id.includes("add")) {
      const course_index = parseInt(id.split(" ")[1]);
      let temp_course = JSON.parse(JSON.stringify(this.state.course));
      temp_course.valid_rooms.push("");
      this.setState({ course: temp_course, update: true });
    } else if (id.includes("del")) {
      const course_index = parseInt(id.split(" ")[1]);
      let temp_course = JSON.parse(JSON.stringify(this.state.course));
      temp_course.valid_rooms.pop();
      this.setState({ course: temp_course, update: true });
    } else {
      const attribute = id.split(" ")[0];
      const course_index = parseInt(id.split(" ")[1]);
      let temp_course = JSON.parse(JSON.stringify(this.state.course));
      temp_course[attribute] = event.target.value;
      this.setState({ course: temp_course, update: true });
    }
  }

  render() {
    return (
      <div
        style={{
          padding: "5%",
          border: "3px solid #393e46",
          margin: "5%",
        }}
      >
        <h3>Course #{this.state.index + 1}</h3>
        <br></br>
        <Row style={{ padding: "2.5%" }}>
          <Col xs={6} style={{ textAlign: "left" }}>
            <Form.Label>Course Id</Form.Label>
          </Col>
          <Col>
            <Form.Control
              size="sm"
              id={"course_id " + this.state.index}
              value={this.state.course.course_id}
              onChange={this.props.onCoursesHandler}
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
              id={"course_name " + this.state.index}
              value={this.state.course.course_name}
              onChange={this.props.onCoursesHandler}
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
              id={"no_hours_per_week " + this.state.index}
              value={this.state.course.no_hours_per_week}
              onChange={this.props.onCoursesHandler}
            ></Form.Control>
          </Col>
        </Row>
        <Row style={{ padding: "2.5%" }}>
          <Col xs={6} style={{ textAlign: "left" }}>
            <Form.Label>Number of Hours to Schedule when Assigning</Form.Label>
          </Col>
          <Col style={{ margin: "auto" }}>
            <Form.Control
              size="sm"
              id={"no_of_hours_to_schedule_when_assigning " + this.state.index}
              value={this.state.course.no_of_hours_to_schedule_when_assigning}
              onChange={this.props.onCoursesHandler}
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
              id={"max_no_hours_per_day " + this.state.index}
              value={this.state.course.max_no_hours_per_day}
              onChange={this.props.onCoursesHandler}
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
              id={"max_consecutive_hours_per_day " + this.state.index}
              value={this.state.course.max_consecutive_hours_per_day}
              onChange={this.props.onCoursesHandler}
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
        {this.state.course.valid_rooms.map((room, index) => (
          <div key={index}>
            <Row style={{ padding: "2.5%" }}>
              <Col xs={6} style={{ textAlign: "left" }}>
                {"Room " + (index + 1)}
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  onChange={this.props.onCoursesHandler}
                  id={"room " + this.state.index + " " + index}
                  value={room}
                >
                  (<option value="">Make a selection</option>)
                  {this.state.rooms.map((aval_room, i) => (
                    <option value={aval_room} key={i}>
                      {aval_room}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Row>
          </div>
        ))}
        <Button
          variant="primary"
          onClick={this.props.onCoursesHandler}
          class="room"
          id={"add " + this.state.index}
          style={{ margin: "2%" }}
        >
          +
        </Button>
        <Button
          variant="danger"
          class="room"
          onClick={this.props.onCoursesHandler}
          id={"del " + this.state.index}
          style={{ margin: "2%" }}
        >
          -
        </Button>
      </div>
    );
  }
}

export default Course;
