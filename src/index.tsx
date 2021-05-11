import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

const SIDEBAR_STYLE = {
  padding: '20px',
  width: '265px'
};

ReactDOM.render(
  <App sidebar={SIDEBAR_STYLE} />,
  document.getElementById("root")
);