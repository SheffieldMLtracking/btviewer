import Image from './components/Image.jsx';
import Sessions from './components/Sessions.jsx';

function App() {
    return (
        <div className="App">
            <Sessions/>  {/*It should be a component, which in turn have all the children component to fetch session, camera, device etc.*/}
        </div>
    );
}

export default App;
