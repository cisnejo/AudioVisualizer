import React, { useEffect } from 'react';
import './App.css';
//import { Visualizer } from './Visualizer'
import { Physics } from './Physics'
const App: React.FC = () => {

  return (
    <div className="App">
      {/*} <Visualizer /> {*/}
      <Physics />
    </div>
  );
}

export default App;
