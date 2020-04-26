import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import StudentGroup from "./student group";

class StudentGroups extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.onStudentGroupsHandler = this.onStudentGroupsHandler.bind(this);
    this.getStudentGroupsDetails = this.getStudentGroupsDetails.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.student_groups) !==
      JSON.stringify(this.props.student_groups)
    )
      this.setState({ student_groups: this.props.student_groups });
    if (
      JSON.stringify(prevProps.courses) !== JSON.stringify(this.props.courses)
    )
      this.setState({ courses: this.props.courses });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert });
    }
  }

  onStudentGroupsHandler(event) {
    let id = event.target.id;
    console.log(id);
    if (id === "add") {
      this.setState({
        student_groups: [
          ...this.state.student_groups,
          {
            name: "",
            courses: [""],
          },
        ],
        update_index: undefined,
        update: true,
      });
    } else if (id === "del") {
      this.setState({
        student_groups: this.state.student_groups.slice(
          0,
          this.state.student_groups.length - 1
        ),
        update_index: undefined,
        update: true,
      });
    } else if (id.includes("add")) {
      const sg_index = parseInt(id.split(" ")[1]);
      let student_groups = JSON.parse(
        JSON.stringify(this.state.student_groups)
      );
      student_groups[sg_index].courses.push("");
      this.setState({
        student_groups,
        update: true,
        update_index: sg_index,
      });
    } else if (id.includes("del")) {
      const sg_index = parseInt(id.split(" ")[1]);
      let student_groups = JSON.parse(
        JSON.stringify(this.state.student_groups)
      );
      student_groups[sg_index].courses.pop();
      this.setState({
        student_groups,
        update: true,
        update_index: sg_index,
      });
    } else if (id.includes("student_grp")) {
      const sg_index = parseInt(id.split(" ")[1]);
      const index = parseInt(id.split(" ")[2]);
      let student_groups = JSON.parse(
        JSON.stringify(this.state.student_groups)
      );
      student_groups[sg_index].courses[index] = event.target.value;
      this.setState({
        student_groups,
        update: true,
        update_index: sg_index,
      });
    } else {
      const sg_index = parseInt(id);
      let student_groups = JSON.parse(
        JSON.stringify(this.state.student_groups)
      );
      student_groups[sg_index].name = event.target.value;
      this.setState({
        student_groups,
        update: true,
        update_index: sg_index,
      });
    }
  }

  getStudentGroupsDetails(student_group, index) {
    this.props.sendStudentGroups(this.state.update, this.state.student_groups);
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
          Enter Student Group Details
        </h2>
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getStudentGroupsDetails}
        >
          Save & Go Back
        </Button>
        {this.state.student_groups.map((student_group, key) => (
          <StudentGroup
            student_group={student_group}
            index={key}
            key={key}
            courses={this.state.courses}
            alert={this.state.alert}
            update_index={this.state.update_index}
            onStudentGroupsHandler={this.onStudentGroupsHandler}
            sendStudentGroupDetails={this.getStudentGroupsDetails}
          ></StudentGroup>
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
    );
  }
}

export default StudentGroups;
