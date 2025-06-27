import logo from './logo.svg';
import './App.css';
import SimCanvas from './simCanvas';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Симуляция эпидемии</h1>
      <SimCanvas />
    </div>
  );
}

export default App;
