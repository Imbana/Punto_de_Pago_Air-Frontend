import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { MdFlight } from 'react-icons/md';
import { useSearchParams } from "react-router";
import logo from '../../assets/logo.png';
import axios from 'axios';
 
const dataList = {
  "direct_flights": [
    {
      "id": 1,
      "origin": {
        "code": "BOG",
        "name": "Bogotá"
      },
      "destination": {
        "code": "MDE",
        "name": "Medellín"
      },
      "departure_time": "06:00:00",
      "arrival_time": "07:30:00",
      "days_of_week": ["Monday", "Wednesday", "Friday"],
      "duration": "1 horas, 30 minutos"
    }
  ],
  "routes_with_stops": [ {
    "id": 1,
    "origin": {
      "code": "BOG",
      "name": "Bogotá"
    },
    "destination": {
      "code": "CTG",
      "name": "Cartagena"
    },
    "flights": [
      {
        "departure_time": "08:00:00",
        "arrival_time": "09:30:00",
        "origin": "BOG",
        "destination": "MDE",
        "duration": "1 horas, 30 minutos"
      },
      {
        "departure_time": "10:30:00",
        "arrival_time": "12:00:00",
        "origin": "MDE",
        "destination": "CTG",
        "duration": "1 horas, 30 minutos"
      }
    ],
    "total_duration": "4 horas, 0 minutos",
    "days_of_week": ["Tuesday", "Thursday", "Saturday"]
  },
  {
    "id": 2,
    "origin": {
      "code": "BOG",
      "name": "Bogotá"
    },
    "destination": {
      "code": "CLO",
      "name": "Cali"
    },
    "flights": [
      {
        "departure_time": "07:00:00",
        "arrival_time": "08:30:00",
        "origin": "BOG",
        "destination": "BAQ",
        "duration": "1 horas, 30 minutos"
      },
      {
        "departure_time": "09:30:00",
        "arrival_time": "11:00:00",
        "origin": "BAQ",
        "destination": "CLO",
        "duration": "1 horas, 30 minutos"
      }
    ],
    "total_duration": "4 horas, 0 minutos",
    "days_of_week": ["Monday", "Wednesday", "Friday"]
  },
  {
    "id": 3,
    "origin": {
      "code": "BOG",
      "name": "Bogotá"
    },
    "destination": {
      "code": "SMR",
      "name": "Santa Marta"
    },
    "flights": [
      {
        "departure_time": "05:00:00",
        "arrival_time": "06:30:00",
        "origin": "BOG",
        "destination": "MDE",
        "duration": "1 horas, 30 minutos"
      },
      {
        "departure_time": "07:30:00",
        "arrival_time": "09:00:00",
        "origin": "MDE",
        "destination": "SMR",
        "duration": "1 horas, 30 minutos"
      }
    ],
    "total_duration": "4 horas, 0 minutos",
    "days_of_week": ["Sunday"]
  }]
};
 
const FlightList = () => {
  const [results, setResults] = useState(dataList);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
 
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
 
  const handleShowModal = (flight) => {
    setModalContent(flight);
    setShowModal(true);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent({});
  };
 
  useEffect(() => {
    setLoading(true);
 
    const fetchFlightList = async () => {
      try {
        // Uncomment and update API logic here if needed
        // const response = await axios.get('/api/flights', {
        //   params: { origin, destination, date }
        // });
        // setResults(response.data);
      } catch (err) {
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchFlightList();
  }, [date, destination, origin]);
 
  const filteredFlights = results.direct_flights.filter(flight =>
    flight.days_of_week.includes(selectedDay)
  );
 
  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="plane-loader">
            <div className="plane"></div>
            <div className="cloud cloud1"></div>
            <div className="cloud cloud2 animated"></div>
            <div className="cloud cloud3 animated"></div>
          </div>
        </div>
      )}
<header className="header mb-4">
                <img
                    src={logo}
                    width="150"
                    height="60"
                    alt="Logo Portal de Pago Air"
                    className="logo-left"
                />
            </header>
      <div className="results-container">
        <Container className="mt-5 mb-5">
          <h2 className="mb-5">Vuelos desde {origin} hacia {destination}</h2>
 
          {/* Day Selector */}
          <div className="day-selector d-flex justify-content-between mb-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <button
                key={day}
                className={`btn ${day === selectedDay ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
 
          {/* Flights */}
          <Row className="g-4">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight, index) => (
                <Col key={index} xs={12}>
                  <Card className="card-flight">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div style={{ textAlign: 'left' }}>
                        <h5 className="flight-info-header">{flight.departure_time}</h5>
                        <span className="flight-info-sub">{flight.origin.code}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h5 className="flight-info-header">{flight.arrival_time}</h5>
                        <span className="flight-info-sub">{flight.destination.code}</span>
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <div className="flight-type">Directo</div>
                      <div className="d-flex align-items-center justify-content-center mt-3">
                        <div className="flight-details-divider"></div>
                        <MdFlight className="flight-details-icon" />
                        <div className="flight-details-divider"></div>
                      </div>
                      <div className="flight-duration">{flight.duration}</div>
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleShowModal(flight)}
                    >
                      Ver detalles
                    </Button>
                  </Card>
                </Col>
              ))
            ) : (
              <div className="no-flights-message">
                <Card className="no-flights-card text-center p-4 mt-3">
                  <Card.Body>
                    <Card.Title className='text-dark display-5 fw-bold'>No hay vuelos disponibles</Card.Title>
                    <Card.Text>
                      <p className='badge bg-danger'>Intenta con otra fecha o destino.</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Row>
 
          {/* Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del vuelo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalContent && (
                <>
                  <p><strong>Origen:</strong> {modalContent.origin?.name} ({modalContent.origin?.code})</p>
                  <p><strong>Destino:</strong> {modalContent.destination?.name} ({modalContent.destination?.code})</p>
                  <p><strong>Duración:</strong> {modalContent.duration}</p>
                  <p><strong>Hora de salida:</strong> {modalContent.departure_time}</p>
                  <p><strong>Hora de llegada:</strong> {modalContent.arrival_time}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </>
  );
};
 
export default FlightList;
 