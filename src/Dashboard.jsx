import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
// import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [locations, setLocations] = useState([]);

  // Function to fetch API data
  const fetchData = async () => {
    if (startLocation && destination) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:5000/api/getPrediction?start=${startLocation}&dest=${destination}`
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    }
  };

  // Fetch data on component mount (and could later be used to load available locations from an API)
  useEffect(() => {
    // Hardcoded locations, you can later replace this with dynamic loading from an API
    setLocations(["Connaught Place", "AIIMS", "Karol Bagh", "Dwarka"]);
  }, []);

  // Chart Data for Time Comparison
  const timeChartData = {
    labels: ["Car", "Bike", "Cycle", "Bus", "Metro"],
    datasets: [
      {
        label: "Travel Time (in minutes)",
        data: [
          data?.Time_Car,
          data?.Time_Bike,
          data?.Time_Cycle,
          data?.Time_Bus,
          data?.Time_Metro,
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Expense Comparison
  const expenseChartData = {
    labels: ["Car", "Bike", "Cycle", "Bus", "Metro"],
    datasets: [
      {
        label: "Travel Expense (in INR)",
        data: [
          data?.Expense_Car,
          data?.Expense_Bike,
          data?.Expense_Cycle,
          data?.Expense_Bus,
          data?.Expense_Metro,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Pollution Exposure Comparison
  const pollutionChartData = {
    labels: ["Car", "Bike", "Cycle", "Bus", "Metro"],
    datasets: [
      {
        label: "Pollution Exposure",
        data: [
          data?.Pollution_Car,
          data?.Pollution_Bike,
          data?.Pollution_Cycle,
          data?.Pollution_Bus,
          data?.Pollution_Metro,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Car - Red
          "rgba(54, 162, 235, 0.2)", // Bike - Blue
          "rgba(255, 206, 86, 0.2)", // Cycle - Yellow
          "rgba(75, 192, 192, 0.2)", // Bus - Teal
          "rgba(153, 102, 255, 0.2)", // Metro - Purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <Row className="my-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Enter Your Route Details</Card.Title>
              <Form>
                <Form.Group controlId="formStartLocation">
                  <Form.Label>Starting Point</Form.Label>
                  <Form.Control
                    as="select"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                  >
                    <option value="">Select Starting Point</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="formEndLocation">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    as="select"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    <option value="">Select Destination</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={fetchData}
                  disabled={!startLocation || !destination}
                >
                  Get Travel Info
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Travel Time Comparison</Card.Title>
              {loading ? <p>Loading...</p> : <Line data={timeChartData} />}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Travel Expense Comparison</Card.Title>
              {loading ? <p>Loading...</p> : <Bar data={expenseChartData} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Pollution Exposure Comparison</Card.Title>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Doughnut data={pollutionChartData} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
