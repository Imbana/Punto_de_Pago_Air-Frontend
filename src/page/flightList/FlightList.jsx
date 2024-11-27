import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { MdFlight } from 'react-icons/md';
import { useSearchParams } from "react-router";
import {useStoreFlight} from  '../../store/store'
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import axios from 'axios';

import {getWeekDays} from "../../helpers/utiils"



const FlightList = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { info_flight } = useStoreFlight()
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const navigate = useNavigate();
 
  const handleShowModal = (flight) => {
    setModalContent(flight);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent({});
  };

  const handleSelectFlight = () => {

    info_flight({
      "origin": modalContent.origin?.code,
      "destination": modalContent.origin?.code,
      "time":modalContent.departure_time,
      "date": date
    })
    navigate('/userReservation');
  };
  useEffect(() => {
    setLoading(true);
    const fetchFlightList = async () => {
      try {

        const response = await axios.get('http://127.0.0.1:9696/api/flights/search', {
          params: { origin, destination, date }
        });

        console.log(response.data.direct_flights)
        setResults(response.data.direct_flights);

      } catch (err) {
        console.error('Error fetching flights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlightList();
  }, [date, destination, origin]);

  const [selectedDate, setSelectedDate] = useState(date);

  

  const weekDays = getWeekDays(selectedDate);

  const handleDayClick = (date) => {
      setSelectedDate(date);
      setSearchParams({
          origin,
          destination,
          date, // Actualiza la URL con la nueva fecha
      });
  };

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
            {weekDays.map((date) => {
              const dayName = new Intl.DateTimeFormat('es-CO', { weekday: 'long' }).format(new Date(date + 'T00:00:00-05:00'));

              return (
                <button
                  key={date}
                  className={`btn ${date === selectedDate ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDayClick(date)}
                >
                  {dayName} ({date})
                </button>
              );
            })}
          </div>

          {/* Flights */}
          <Row className="g-4">
            {results.length > 0 ? (
              results.map((flight, index) => (
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
                      <span className='badge bg-danger'>Intenta con otra fecha o destino.</span>
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
              <Button variant="primary"  onClick={handleSelectFlight}>
                Seleccionar
              </Button>
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
 
