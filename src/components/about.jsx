import React, { Component } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";

class About extends Component {
  state = {};
  render() {
    return (
      <Jumbotron
        style={{
          backgroundColor: "white",
          margin: "1% 25%",
          padding: "0% 10% 5% 10%",
        }}
      >
        <h2 style={{ padding: "5%", borderBottom: "1px solid #222831" }}>
          About
        </h2>
        <p style={{ textAlign: "justify" }}>
          Timetable generation is an important part of every educational
          institution and is a complex and multi constraint satisfaction
          problem. It appears to be a monotonous job in every academic institute
          once or twice a year. In earlier days, timetable scheduling was done
          manually by a single person or a group of individuals, which is a very
          tedious task and takes a lot of effort and time. Planning a timetable
          is a very complex task. Timetable generation involves the efficient
          allocation of resources such as Rooms, Lecturers, Student Groups, etc.
          keeping in mind the availability, preferences and conveniences of the
          resource. The preferences and conveniences of the resource can include
          frequencies of a lecture, number of hours in a day and week, preferred
          time slots of a day, preferred working days, etc. This paper discusses
          the use of Genetic Algorithm and its operations, viz. Selection,
          Crossover and Mutation for solving of this problem. Based on the
          research, Genetic Algorithm is proved to improve this process as it
          focuses on various constraints and provides a global optimal solution
          rather that converging on a premature local optima. The paper gives a
          conceptual design for the generation of a timetable for an institution
          using Genetic Algorithm.
        </p>
      </Jumbotron>
    );
  }
}

export default About;
