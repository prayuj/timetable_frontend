import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class StudentGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.sendStudentGroupsHandler = this.sendStudentGroupsHandler.bind(this);
    // this.props.onStudentGroupsHandler = this.props.onStudentGroupsHandler.bind(this);
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.update_index === this.state.index;
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.student_group) !==
      JSON.stringify(this.props.student_group)
    )
      this.setState({ student_group: this.props.student_group });
    else if (
      JSON.stringify(prevProps.courses) !== JSON.stringify(this.props.courses)
    )
      this.setState({ courses: this.props.courses });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () =>
        this.sendStudentGroupsHandler()
      );
    }
  }

  sendStudentGroupsHandler() {
    if (this.state.alert) {
      this.props.sendStudentGroupDetails(
        this.state.student_group,
        this.state.index
      );
    }
  }

  onStudentGroupsHandler(event) {
    let id = event.target.id;
    if (id.includes("add")) {
      let student_group = JSON.parse(JSON.stringify(this.state.student_group));
      student_group.courses.push("");
      this.setState({
        student_group,
      });
    } else if (id.includes("del")) {
      let student_group = JSON.parse(JSON.stringify(this.state.student_group));
      student_group.courses.pop();
      this.setState({
        student_group,
      });
    } else if (id.includes("student_grp")) {
      const index = parseInt(id.split(" ")[2]);
      let student_group = JSON.parse(JSON.stringify(this.state.student_group));
      student_group.courses[index] = event.target.values;
      this.setState({
        student_group,
      });
    } else {
      let student_group = JSON.parse(JSON.stringify(this.state.student_group));
      student_group.name = event.target.values;
      this.setState({
        student_group,
      });
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
        <h3>Student Group #{this.state.index + 1}</h3>
        <br></br>
        <Row style={{ padding: "2.5%" }}>
          <Col xs={6} style={{ textAlign: "left" }}>
            <Form.Label>Student Group Name</Form.Label>
          </Col>
          <Col>
            <Form.Control
              size="sm"
              className="student_grp"
              id={"" + this.state.index}
              value={this.state.student_group.name}
              onChange={this.props.onStudentGroupsHandler}
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
        {this.state.student_group.courses.map((course, index) => (
          <div>
            <Row style={{ padding: "2.5%" }}>
              <Col xs={6} style={{ textAlign: "left" }}>
                {"Course " + (index + 1)}
              </Col>

              <Col>
                <Form.Control
                  as="select"
                  onChange={this.props.onStudentGroupsHandler}
                  id={"student_grp " + this.state.index + " " + index}
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
          onClick={this.props.onStudentGroupsHandler}
          class="room"
          id={"add " + this.state.index}
          style={{ margin: "2%" }}
        >
          +
        </Button>
        <Button
          variant="danger"
          class="room"
          onClick={this.props.onStudentGroupsHandler}
          id={"del " + this.state.index}
          style={{ margin: "2%" }}
        >
          -
        </Button>
      </div>
    );
  }
}

export default StudentGroup;
