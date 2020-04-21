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
            <Card.Text>Start Generating a New Timetable.</Card.Text>
            <Button variant="success">
              <Link to="/newtimetable" style={{ color: "white" }}>
                Let's Go!
              </Link>
            </Button>
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
              <Button
                variant="primary"
                style={{
                  backgroundColor: "#00adb5",
                  borderColor: "#00adb5",
                }}
              >
                <Link
                  to={"/mainapp/" + timetables[i]._id}
                  style={{ color: "white" }}
                >
                  See Timetable!
                </Link>
              </Button>
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
        <Row style={{ paddingLeft: "15%", paddingRight: "15%" }}>
          {columns.slice(i, i + 3).map((column, key) => column)}
        </Row>
      );
    }
    return <>{rows.map((row) => row)}</>;
  }

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>Timetables</h1>
          <p>
            This is a simple hero unit, a simple jumbotron-style component for
            calling extra attention to featured content or information.
          </p>
          <p>
            <Button
              variant="primary"
              style={{
                backgroundColor: "#00adb5",
                borderColor: "#00adb5",
              }}
            >
              Learn more
            </Button>
          </p>
        </Jumbotron>
        {this.displayTimetableDetails(this.state.timetables)}
      </div>
    );
  }
}

export default Dashboard;
