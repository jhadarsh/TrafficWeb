import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Button } from "react-bootstrap";
import "./ParkingBooking.css";

// Register the chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const ParkingBooking = () => {
  const [parkingData, setParkingData] = useState({});
  const [selectedImage, setSelectedImage] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);

  const defaultData = {
    "image1.jpg": {
      area1: 0,
      area10: 0,
      area11: 0,
      area12: 0,
      area2: 0,
      area3: 0,
      area4: 0,
      area5: 0,
      area6: 0,
      area7: 0,
      area8: 0,
      area9: 0,
    },
    "image2.jpg": {
      area1: 0,
      area10: 0,
      area11: 0,
      area12: 0,
      area2: 1,
      area3: 0,
      area4: 1,
      area5: 1,
      area6: 1,
      area7: 0,
      area8: 0,
      area9: 0,
    },
    "image3.jpg": {
      area1: 0,
      area10: 0,
      area11: 1,
      area12: 1,
      area2: 1,
      area3: 0,
      area4: 1,
      area5: 0,
      area6: 1,
      area7: 0,
      area8: 1,
      area9: 1,
    },
    "image4.jpg": {
      area1: 0,
      area10: 0,
      area11: 1,
      area12: 0,
      area2: 0,
      area3: 0,
      area4: 0,
      area5: 0,
      area6: 0,
      area7: 0,
      area8: 0,
      area9: 0,
    },
    "image5.jpg": {
      area1: 1,
      area10: 0,
      area11: 0,
      area12: 0,
      area2: 1,
      area3: 0,
      area4: 1,
      area5: 1,
      area6: 0,
      area7: 1,
      area8: 0,
      area9: 1,
    },
  };

  // Fetch parking data from the FastAPI backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/imag")
      .then((response) => {
        setParkingData(response.data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
        setParkingData(defaultData);
      });
  }, []);

  // Function to handle slot booking
  const handleBooking = (slot) => {
    if (bookedSlots.includes(slot)) {
      alert("This slot is already booked!");
    } else {
      setBookedSlots([...bookedSlots, slot]);
      alert(`Successfully booked ${slot}`);
    }
  };

  // Pie Chart Data
  const calculateOccupancy = (data) => {
    let vacant = 0;
    let booked = 0;

    // Loop through each image in the dictionary (data)
    for (let key in data) {
      if (data[key]) {
        // Loop through each slot within the image (each key of the inner object)
        for (let slot in data[key]) {
          // Check if the slot is booked (1) or vacant (0)
          if (data[key][slot] === 1) {
            booked++;
          } else {
            vacant++;
          }
        }
      }
    }

    console.log("Vacant slots:", vacant);
    console.log("Booked slots:", booked);
    return { vacant, booked };
  };

  // Extract the occupancy data for the selected image
  const occupancy = calculateOccupancy({
    [selectedImage]: parkingData[selectedImage],
  });

  // Pie Chart configuration
  const pieData = {
    labels: ["Vacant", "Booked"],
    datasets: [
      {
        data: [occupancy.vacant, occupancy.booked],
        backgroundColor: ["#7cfc00", "#f44336"], // Green for vacant, Red for booked
      },
    ],
  };

  // Limit the slots to 12 for selected image
  const parkingSlots = parkingData[selectedImage]
    ? Object.keys(parkingData[selectedImage]).slice(0, 12)
    : [];

  return (
    <div className="container-parking">
      {/* Sidebar with pie chart */}
      <div className="sidebar">
        <h2>Select Parking Area</h2>
        <ul className="image-list">
          {Object.keys(parkingData).map((image, index) => (
            <li
              key={index}
              className={`image-item ${
                selectedImage === image ? "selected" : ""
              }`}
              onClick={() => setSelectedImage(image)}
            >
              {image}
            </li>
          ))}
        </ul>

        <h3>Occupancy Status</h3>
        <div className="pie-chart">
          <Pie data={pieData} />
        </div>
      </div>

      {/* Parking slots section */}
      <div className="parking-slots">
        <h1>Parking Slot Booking</h1>
        <div className="slots-container">
          {parkingSlots.map((slot, index) => (
            <div
              key={index}
              className={`parking-slot ${
                parkingData[selectedImage][slot] === 0 ? "vacant" : "booked"
              }`}
              onClick={() => handleBooking(slot)}
            >
              <img src={`./car.jpg`} alt={slot} className="parking-image" />
              <div className="parking-status">
                <p>{slot}</p>
                <p>
                  {parkingData[selectedImage][slot] === 0 ? "Vacant" : "Booked"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParkingBooking;
