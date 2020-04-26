import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Course from "./course";

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.onCoursesHandler = this.onCoursesHandler.bind(this);
    this.getCourseDetails = this.getCourseDetails.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.courses) !== JSON.stringify(this.props.courses)
    )
      this.setState({ courses: this.props.courses });
    else if (
      JSON.stringify(prevProps.rooms) !== JSON.stringify(this.props.rooms)
    )
      this.setState({ rooms: this.props.rooms });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert });
    }
  }

  onCoursesHandler(event) {
    let id = event.target.id;
    console.log(id);
    if (id === "add") {
      this.setState({
        courses: [
          ...this.state.courses,
          {
            course_id: "",
            course_name: "",
            no_of_hours_to_schedule_when_assigning: "",
            max_no_hours_per_day: "",
            no_hours_per_week: "",
            max_consecutive_hours_per_day: "",
            valid_rooms: [""],
          },
        ],
        update_index: undefined,
      });
    } else if (id === "del") {
      this.setState({
        courses: this.state.courses.slice(0, this.state.courses.length - 1),
        update_index: undefined,
      });
    } else if (id.includes("room")) {
      const course_index = parseInt(id.split(" ")[1]);
      const room_index = parseInt(id.split(" ")[2]);
      let temp_courses = JSON.parse(JSON.stringify(this.state.courses));
      temp_courses[course_index].valid_rooms[room_index] = event.target.value;
      this.setState({
        courses: temp_courses,
        update: true,
        update_index: course_index,
      });
    } else if (id.includes("add")) {
      const course_index = parseInt(id.split(" ")[1]);
      let temp_courses = JSON.parse(JSON.stringify(this.state.courses));
      temp_courses[course_index].valid_rooms.push("");
      this.setState({
        courses: temp_courses,
        update: true,
        update_index: course_index,
      });
    } else if (id.includes("del")) {
      const course_index = parseInt(id.split(" ")[1]);
      let temp_courses = JSON.parse(JSON.stringify(this.state.courses));
      temp_courses[course_index].valid_rooms.pop();
      this.setState({
        courses: temp_courses,
        update: true,
        update_index: course_index,
      });
    } else {
      const attribute = id.split(" ")[0];
      const course_index = parseInt(id.split(" ")[1]);
      let temp_courses = JSON.parse(JSON.stringify(this.state.courses));
      temp_courses[course_index][attribute] = event.target.value;
      this.setState({
        courses: temp_courses,
        update: true,
        update_index: course_index,
      });
    }
  }

  getCourseDetails(update, course, index) {
    // console.log(update, course, index);
    // if (update) {
    //   // let courses = JSON.parse(JSON.stringify(this.state.courses));
    //   // courses[index] = JSON.parse(JSON.stringify(course));
    //   this.setState(
    //     { updated: [...this.state.updated, { index: index }] },
    //     () => console.log(this.state.updated)
    //   );
    // }
    this.props.sendCoursesHere(this.state.update, this.state.courses);
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
          Enter Course Details
        </h2>
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getCourseDetails}
        >
          Save & Go Back
        </Button>
        {this.state.courses.map((course, key) => (
          <Course
            course={course}
            index={key}
            key={key}
            update={false}
            rooms={this.state.rooms}
            sendCourseDetails={this.getCourseDetails}
            onCoursesHandler={this.onCoursesHandler}
            alert={this.state.alert}
            update_index={this.state.update_index}
          ></Course>
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
    );
  }
}

export default Courses;
