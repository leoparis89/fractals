import React from "react";
import logo from "./logo.svg";
import "./App.css";

const canvasStyle = {
  border: "1px solid blue",
  width: 200,
  height: 200
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>hello</h1>
      </header>
      <canvas style={canvasStyle}></canvas>
    </div>
  );
}

export default App;
