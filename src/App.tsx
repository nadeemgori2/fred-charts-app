import React from "react";
import ChartManager from "./components/ChartManager/ChartManager";

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Dynamic Chart Manager</h1>
      </header>
      <main>
        <ChartManager />
      </main>
    </div>
  );
};

export default App;
