import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import axios from "axios";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timetables: [],
      userid: props.objectID,
    };
  }

  componentDidMount() {
    axios
      .get("http://127.0.0.1:5000/gettimetables/" + this.state.userid)
      .then((res) => {
        this.setState(res.data);
      });
  }

  displayTimetableDetails(timetables) {
    // display = timetables.map((timetabe, key)=>{
    //   if
    // })
    let columns = [
      <Col sm={4}>
        <Card className="newtimetablecard">
          <Card.Body>
            <Card.Title>New Timetable</Card.Title>
            <Card.Text style={{ height: "72px" }}>
              Start Generating a New Timetable.
            </Card.Text>
            <Link to="/newtimetable">
              <Button variant="success">Let's Go!</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>,
    ];
    for (let i = 0; i < timetables.length; i++) {
      columns.push(
        <Col sm={4}>
          <Card className="timetablecard">
            <Card.Body>
              <Card.Title>{timetables[i].title}</Card.Title>
              <Card.Text
                style={{
                  height: "72px",
                  overflow: "hidden",
                  textOfverflow: "ellipsis",
                }}
              >
                {timetables[i].desc}
              </Card.Text>
              <Link to={"/mainapp/" + timetables[i]._id}>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: "#00adb5",
                    borderColor: "#00adb5",
                  }}
                >
                  See Timetable!
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      );
    }
    let rows = [];
    console.log("columns length = ", columns.length);
    for (let i = 0; i < columns.length; i = i + 3) {
      console.log(i);
      rows.push(
        <Row style={{ paddingLeft: "15%", paddingRight: "15%", margin: "1%" }}>
          {columns.slice(i, i + 3).map((column, key) => column)}
        </Row>
      );
    }
    return <>{rows.map((row) => row)}</>;
  }

  render() {
    return (
      <div>
        <Jumbotron
          style={{
            backgroundColor: "white",
            margin: "1% 25%",
            padding: "5% 10%",
          }}
        >
          <h1>Start Generating a New Timetable</h1>
          <p>
            Click on the first Card to Start Generating a new Timetable. View
            other Timetables you have created
          </p>
          <p>
            <Link to={"/about"}>
              <Button
                variant="primary"
                style={{
                  backgroundColor: "#00adb5",
                  borderColor: "#00adb5",
                }}
              >
                About
              </Button>
            </Link>
          </p>
        </Jumbotron>
        {this.displayTimetableDetails(this.state.timetables)}
      </div>
    );
  }
}

export default Dashboard;
