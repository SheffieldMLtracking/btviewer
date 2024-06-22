import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';



import Sessions from './components/Sessions.jsx';

function App() {
    return (
        <div className="App">
            <Container>    
            <Row>
                <Col sm={4}>
                    <h1>Btviewer</h1>
                    <h4>Instructions</h4>
                    <p>Zoom In: mouseclick + alt</p>
                    <p>Zoom Out: mouseclick + windows/cmd</p>
                    <p>Confident tag: mouseclick + ctrl</p>
                    <p>Unconfident tag: mouseclick + shift</p>
                </Col>
                <Col sm={8}>
                <Sessions/>  {/*It should be a component, which in turn have all the children component to fetch session, camera, device etc.*/}

                </Col>
            </Row>
                  
                    
            </Container>    

        </div>
    );
}

export default App;
