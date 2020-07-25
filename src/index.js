import App from "./App";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fonts/AnnieUseYourTelescope-Regular.ttf";
import "./fonts/ArchitectsDaughter-Regular.ttf";
import "./fonts/Cabin-Regular.ttf";
import "./fonts/GiveYouGlory-Regular.ttf";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
