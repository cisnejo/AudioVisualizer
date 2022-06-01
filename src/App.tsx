import React, { useEffect } from 'react';
import './App.css';
//import { Visualizer } from './Visualizer'
import { Physics } from './Physics'
import { Visualizer } from './Visualizer';
const App: React.FC = () => {

  return (
    <div className="App">
      {/*} <Visualizer /> {*/}
      <Physics />
    </div>
  );
}

export default App;
