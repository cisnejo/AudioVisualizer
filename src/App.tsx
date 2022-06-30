import './App.css';
import Description from './Description';
import { Physics } from './Physics'
const App: React.FC = () => {
  return (
    <div className="App">
      <Physics />
      <Description />
    </div>
  );
}

export default App;
