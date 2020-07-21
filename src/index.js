import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./fonts/AnnieUseYourTelescope-Regular.ttf";
import "./fonts/ArchitectsDaughter-Regular.ttf";
import "./fonts/Cabin-Regular.ttf";
import "./fonts/GiveYouGlory-Regular.ttf";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faFistRaised,
  faDragon,
  faPaintBrush,
  faUtensilSpoon,
  faHammer,
  faFemale,
  faTshirt,
  faDumbbell,
  faPizzaSlice,
  faGamepad,
  faSeedling,
  faCampground,
  faFilm,
  faMusic,
  faMoon,
  faCat,
  faBookOpen,
  faPrayingHands,
  faFutbol,
  faMicrochip,
  faTheaterMasks,
  faPlane,
  faUndo,
  faComments,
  faTimes,
  faStar,
  faDoorOpen,
  faCog,
  faTh,
  faCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faFistRaised,
  faDragon,
  faPaintBrush,
  faUtensilSpoon,
  faHammer,
  faFemale,
  faTshirt,
  faDumbbell,
  faPizzaSlice,
  faGamepad,
  faSeedling,
  faCampground,
  faFilm,
  faMusic,
  faMoon,
  faCat,
  faBookOpen,
  faPrayingHands,
  faFutbol,
  faMicrochip,
  faTheaterMasks,
  faPlane,
  faUndo,
  faComments,
  faTimes,
  faStar,
  faStarRegular,
  faDoorOpen,
  faCog,
  faTh,
  faCheck,
  faEnvelope
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
