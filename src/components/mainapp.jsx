import React, { Component } from "react";
import Input from "./input update";
import axios from "axios";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Generation from "./generation";
import Timetable from "./timetable";
import TimetableDetails from "./timetabledetails";

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      desc: "",
      current: "main",
      timetableObjectID: window.location.pathname.split("/mainapp/")[1],
      userid: this.props.objectID,
      data: {
        availability: [[true]],
        courses: [
          {
            course_id: "",
            course_name: "",
            max_consecutive_hours_per_day: "",
            max_no_hours_per_day: "",
            no_hours_per_week: "",
            no_of_hours_to_schedule_when_assigning: "",
            valid_rooms: [""],
          },
        ],
        days: [""],
        hours: [
          {
            name: "",
            status: true,
          },
        ],
        iterations: 10,
        lecturers: [
          {
            availability: [[true]],
            courses: [""],
            department: "",
            max_consecutive_hours: "",
            max_no_hours_per_day: "",
            max_no_hours_per_week: "",
            name: "",
            rank: "",
          },
        ],
        population_size: 20,
        rooms: [""],
        student_groups: [
          {
            courses: [""],
            name: "",
          },
        ],
      },
    };
    this.getTimetableDetails = this.getTimetableDetails.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleGeneration = this.handleGeneration.bind(this);
  }
  componentDidMount() {
    this.getTimetableDetails();
  }

  handleGeneration(data) {
    console.log(data);
    axios
      .post("http://127.0.0.1:5000/save_maximum", data)
      .then((res) => this.setState({ current: "timetable" }));
  }
  getTimetableDetails() {
    axios
      .get(
        "http://127.0.0.1:5000/timetabledetails/user=" +
          this.state.userid +
          "&timetableObjectID=" +
          this.state.timetableObjectID
      )
      .then((res) => {
        this.setState(res.data);
      });
  }

  handleClick(event) {
    this.setState({ current: event.target.id });
    console.log(event.target.id);
    if (event.target.id === "main") this.getTimetableDetails();
  }

  renderSwitch(param) {
    console.log(param);
    switch (param) {
      case "main":
        return (
          <TimetableDetails
            userid={this.state.userid}
            timetableObjectID={this.state.timetableObjectID}
            sendDataHere={this.handleClick}
            input={this.state.population ? true : false}
            generation={this.state.generation_with_maximum ? true : false}
            title={this.state.title}
            desc={this.state.desc}
          ></TimetableDetails>
        );
      // return (
      //   <Jumbotron
      //     style={{
      //       backgroundColor: "white",
      //       margin: "5% 25%",
      //       padding: "5% 10%",
      //       textAlign: "center",
      //     }}
      //   >
      //     <div
      //       style={{
      //         margin: "3%",
      //         padding: "3%",
      //         borderBottom: "2px solid #222831",
      //       }}
      //     >
      //       <h1>Timetable Generation Status</h1>
      //     </div>

      //     <div style={{ margin: "3%", padding: "3%" }}>
      //       <h3>Set Timetable Constraints</h3>
      //       <Button
      //         variant="success"
      //         style={{
      //           backgroundColor: "#00adb5",
      //           borderColor: "#00adb5",
      //         }}
      //         id="input"
      //         onClick={this.handleClick}
      //       >
      //         Start
      //       </Button>
      //     </div>
      //     <div style={{ margin: "3%", padding: "3%" }}>
      //       <h3>Start Generation</h3>
      // <Button
      //   variant="success"
      //   id="generation"
      //   style={{
      //     backgroundColor: "#00adb5",
      //     borderColor: "#00adb5",
      //   }}
      //   disabled={this.state.population ? false : true}
      //   onClick={() => {
      //     this.setState({ current: "generation" });
      //   }}
      // >
      //   Start
      // </Button>
      //     </div>
      //     <div style={{ margin: "3%", padding: "3%" }}>
      //       <h3>Show Timetable</h3>
      //       <Button
      //         variant="success"
      //         style={{
      //           backgroundColor: "#00adb5",
      //           borderColor: "#00adb5",
      //         }}
      //         disabled={this.state.generation_with_maximum ? false : true}
      //         id="timetable"
      //         onClick={this.handleClick}
      //       >
      //         Start
      //       </Button>
      //     </div>
      //   </Jumbotron>
      // );
      case "input":
        return (
          <Input
            data={JSON.parse(JSON.stringify(this.state.data))}
            timetableObjectID={this.state.timetableObjectID}
            userid={this.state.userid}
            backButton={this.handleClick}
          ></Input>
        );

      case "generation":
        return (
          <Generation
            state={this.state}
            sendDataHere={this.handleGeneration}
            backButton={this.handleClick}
          ></Generation>
        );
      case "timetable":
        return (
          <Timetable
            timetableObjectID={this.state.timetableObjectID}
            sendDataHere={this.handleClick}
          ></Timetable>
        );
      default:
        break;
    }
  }
  render() {
    return this.renderSwitch(this.state.current);
  }
}

export default MainApp;
