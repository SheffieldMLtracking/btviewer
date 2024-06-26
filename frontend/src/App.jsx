import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import Sessions from "./components/Sessions.jsx";
import Instructions from "./components/Instructions.jsx";

function App() {
  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={3}>
            <Instructions />
          </Col>
          <Col sm={8}>
            <Sessions />{" "}
            {/*It should be a component, which in turn have all the children component to fetch session, camera, device etc.*/}
          </Col>
        </Row>
        </Container>
    </div>
  );
}

export default App;
