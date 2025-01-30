import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./Dashboard";
import ParkingBooking from "./ParkingBooking";
import "./App.css";

function App() {
  return (
    <div className="container">
      <div>
        <Dashboard />
      </div>
      <div>
        <ParkingBooking />
      </div>
    </div>
  );
}

export default App;
