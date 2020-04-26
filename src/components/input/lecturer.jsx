import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

class Lecturer extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.sendLecturersHandler = this.sendLecturersHandler.bind(this);
    // this.props.onLecturersHandler = this.props.onLecturersHandler.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.update_index === this.state.index;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.lecturer) !== JSON.stringify(this.props.lecturer)
    )
      this.setState({ lecturer: this.props.lecturer });
    if (
      JSON.stringify(prevProps.courses) !== JSON.stringify(this.props.courses)
    )
      this.setState({ courses: this.props.courses });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () =>
        this.sendLecturersHandler()
      );
    } else if (
      prevProps.hours !== this.props.hours ||
      prevProps.days !== this.props.days
    ) {
      this.setState({ hours: this.props.hours, days: this.props.days });
    }
  }
  sendLecturersHandler() {
    if (this.state.alert) {
      this.props.sendLecturerDetails(this.state.lecturer, this.state.index);
    }
  }

  onLecturersHandler(event) {
    let id = event.target.id;
    if (id.includes("add")) {
      const lecturer_index = parseInt(id.split(" ")[1]);
      let temp_lecturer = JSON.parse(JSON.stringify(this.state.lecturer));
      temp_lecturer.courses.push("");
      this.setState({ lecturer: temp_lecturer });
    } else if (id.includes("del")) {
      let temp_lecturer = JSON.parse(JSON.stringify(this.state.lecturer));
      temp_lecturer.courses.pop();
      this.setState({ lecturer: temp_lecturer });
    } else if (id.includes("lecturer course")) {
      const course_index = parseInt(id.split(" ")[3]);
      let temp_lecturer = JSON.parse(JSON.stringify(this.state.lecturer));
      temp_lecturer.courses[course_index] =
        event.target.value +
        " " +
        temp_lecturer.courses[course_index].split(" ")[1];
      this.setState({ lecturer: temp_lecturer });
    } else if (id.includes("lecturer type_course")) {
      const course_index = parseInt(id.split(" ")[3]);
      let temp_lecturer = JSON.parse(JSON.stringify(this.state.lecturer));
      temp_lecturer.courses[course_index] =
        temp_lecturer.courses[course_index].split(" ")[0] +
        " " +
        event.target.value;
      this.setState({ lecturer: temp_lecturer });
    } else {
      let temp_lecturer = JSON.parse(JSON.stringify(this.state.lecturer));
      const attribute = id.split(" ")[0];
      if (attribute === "avail") {
        let i = parseInt(event.target.id.split(" ")[2]);
        let j = parseInt(event.target.id.split(" ")[3]);
        temp_lecturer.availability[i][j] = !temp_lecturer.availability[i][j];
      } else {
        temp_lecturer[attribute] = event.target.value;
      }
      this.setState({ lecturer: temp_lecturer });
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
        <h3>Lecturer #{this.state.index + 1}</h3>
        <br></br>
        <Row style={{ padding: "2.5%" }}>
          <Col xs={6} style={{ textAlign: "left" }}>
            <Form.Label>Lecturer Name</Form.Label>
          </Col>
          <Col>
            <Form.Control
              size="sm"
              id={"name " + this.state.index}
              value={this.state.lecturer.name}
              onChange={this.props.onLecturersHandler}
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
              id={"department " + this.state.index}
              value={this.state.lecturer.department}
              onChange={this.props.onLecturersHandler}
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
              id={"max_no_hours_per_day " + this.state.index}
              value={this.state.lecturer.max_no_hours_per_day}
              onChange={this.props.onLecturersHandler}
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
              id={"max_no_hours_per_week " + this.state.index}
              value={this.state.lecturer.max_no_hours_per_week}
              onChange={this.props.onLecturersHandler}
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
              id={"max_consecutive_hours " + this.state.index}
              value={this.state.lecturer.max_consecutive_hours}
              onChange={this.props.onLecturersHandler}
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
              id={"rank " + this.state.index}
              value={this.state.lecturer.rank}
              onChange={this.props.onLecturersHandler}
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
                    <th key={num}>{num + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.days.map((day, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    {this.state.hours.map((hour, j) => (
                      <th key={i + " " + j}>
                        <Form.Check
                          id={"avail " + this.state.index + " " + i + " " + j}
                          checked={this.state.lecturer.availability[i][j]}
                          onChange={this.props.onLecturersHandler}
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
        {this.state.lecturer.courses.map((course, index) => (
          <div>
            <Row style={{ padding: "2.5%" }}>
              <Col xs={3} style={{ textAlign: "left" }}>
                {"Course " + (index + 1)}
              </Col>
              <Col sm={5}>
                <Form.Control
                  size="sm"
                  as="select"
                  onChange={this.props.onLecturersHandler}
                  id={"lecturer course " + this.state.index + " " + index}
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
                  id={"lecturer type_course " + this.state.index + " " + index}
                  value={course.split(" ")[1]}
                  onChange={this.props.onLecturersHandler}
                ></Form.Control>
              </Col>
            </Row>
          </div>
        ))}
        <Button
          variant="primary"
          onClick={this.props.onLecturersHandler}
          class="course"
          style={{ margin: "2%" }}
          id={"add " + this.state.index}
        >
          +
        </Button>
        <Button
          variant="danger"
          class="course"
          style={{ margin: "2%" }}
          onClick={this.props.onLecturersHandler}
          id={"del " + this.state.index}
        >
          -
        </Button>
      </div>
    );
  }
}

export default Lecturer;
