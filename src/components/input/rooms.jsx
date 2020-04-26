import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class Rooms extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.onRoomsHandler = this.onRoomsHandler.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.rooms) !== JSON.stringify(this.props.rooms))
      this.setState({ rooms: this.props.rooms });
    else if (prevProps.alert !== this.props.alert) {
      this.setState({ alert: this.props.alert }, () => this.getRoomDetails());
    }
  }
  getRoomDetails() {
    this.props.sendRoomsHere(this.state.update, this.state.rooms);
  }

  onRoomsHandler(event) {
    if (event.target.id == "add") {
      let temp_rooms = this.state.rooms;
      temp_rooms[temp_rooms.length] = "";
      this.setState({
        rooms: temp_rooms,
        update: true,
      });
    } else if (event.target.className.includes("room")) {
      let temp_rooms = this.state.rooms;
      temp_rooms[parseInt(event.target.id)] = event.target.value;
      this.setState({
        rooms: temp_rooms,
        update: true,
      });
    } else if (event.target.id == "del") {
      this.setState({
        rooms: this.state.rooms.slice(0, this.state.rooms.length - 1),
        update: true,
      });
    }
  }

  render() {
    console.log("Updated Rooms");
    return (
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
        <Button
          style={{
            position: "fixed",
            top: "10%",
            left: "1%",
          }}
          id="main"
          onClick={this.getRoomDetails}
        >
          Save & Go Back
        </Button>
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
    );
  }
}

export default Rooms;
