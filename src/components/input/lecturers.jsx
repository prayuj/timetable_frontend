import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Lecturer from "./lecturer";

class Lecturers extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.getLecturerDetails = this.getLecturerDetails.bind(this);
    this.onLecturersHandler = this.onLecturersHandler.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.lecturers) !==
      JSON.stringify(this.props.lecturers)
    )
      this.setState({ lecturers: this.props.lecturers });
    if (
      JSON.stringify(prevProps.courses) !== JSON.stringify(this.props.courses)
    )
      this.setState({ courses: this.props.courses });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert });
    } else if (prevProps.hours !== this.props.hours)
      this.setState({ hours: this.props.hours });
    else if (prevProps.days !== this.props.days)
      this.setState({ days: this.props.days });
  }

  onLecturersHandler(event) {
    let id = event.target.id;
    if (id === "add") {
      let availability = [];
      for (let i = 0; i < this.state.days.length; i++) {
        let row = [];
        for (let j = 0; j < this.state.hours.length; j++) {
          row.push(true);
        }
        availability.push(row);
      }
      this.setState({
        lecturers: [
          ...this.state.lecturers,
          {
            name: "",
            department: "",
            max_no_hours_per_day: "",
            max_no_hours_per_week: "",
            max_consecutive_hours: "",
            rank: "",
            availability: availability,
            courses: [""],
          },
        ],
      });
    } else if (id === "del") {
      this.setState({
        lecturers: this.state.lecturers.slice(
          0,
          this.state.lecturers.length - 1
        ),
      });
    } else if (id.includes("add")) {
      const lecturer_index = parseInt(id.split(" ")[1]);
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      temp_lecturers[lecturer_index].courses.push("");
      this.setState({
        lecturers: temp_lecturers,
        update: true,
        update_index: lecturer_index,
      });
    } else if (id.includes("del")) {
      const lecturer_index = parseInt(id.split(" ")[1]);
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      temp_lecturers[lecturer_index].courses.pop();
      this.setState({
        lecturers: temp_lecturers,
        update: true,
        update_index: lecturer_index,
      });
    } else if (id.includes("lecturer course")) {
      const lecturer_index = parseInt(id.split(" ")[2]);
      const course_index = parseInt(id.split(" ")[3]);
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      temp_lecturers[lecturer_index].courses[course_index] =
        event.target.value +
        " " +
        temp_lecturers.courses[course_index].split(" ")[1];
      this.setState({
        lecturers: temp_lecturers,
        update: true,
        update_index: lecturer_index,
      });
    } else if (id.includes("lecturer type_course")) {
      const lecturer_index = parseInt(id.split(" ")[2]);
      const course_index = parseInt(id.split(" ")[3]);
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      temp_lecturers[lecturer_index].courses[course_index] =
        temp_lecturers[lecturer_index].courses[course_index].split(" ")[0] +
        " " +
        event.target.value;
      this.setState({
        lecturers: temp_lecturers,
        update: true,
        update_index: lecturer_index,
      });
    } else {
      let temp_lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
      const lecturer_index = parseInt(id.split(" ")[1]);
      const attribute = id.split(" ")[0];
      if (attribute === "avail") {
        let i = parseInt(event.target.id.split(" ")[2]);
        let j = parseInt(event.target.id.split(" ")[3]);
        temp_lecturers[lecturer_index].availability[i][j] = !temp_lecturers[
          lecturer_index
        ].availability[i][j];
      } else {
        temp_lecturers[lecturer_index][attribute] = event.target.value;
      }
      this.setState({
        lecturers: temp_lecturers,
        update: true,
        update_index: lecturer_index,
      });
    }
  }

  getLecturerDetails(lecturer, index) {
    // let lecturers = JSON.parse(JSON.stringify(this.state.lecturers));
    // lecturers[index] = JSON.parse(JSON.stringify(lecturer));
    this.props.sendLecturersHere(this.state.update, this.state.lecturers);
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
          Enter Lecturer Details
        </h2>
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getLecturerDetails}
        >
          Save & Go Back
        </Button>
        {this.state.lecturers.map((lecturer, key) => (
          <Lecturer
            lecturer={lecturer}
            index={key}
            key={key}
            courses={this.state.courses}
            alert={this.state.alert}
            sendLecturerDetails={this.getLecturerDetails}
            days={this.state.days}
            hours={this.state.hours}
            onLecturersHandler={this.onLecturersHandler}
            update_index={this.state.update_index}
          ></Lecturer>
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
    );
  }
}

export default Lecturers;
