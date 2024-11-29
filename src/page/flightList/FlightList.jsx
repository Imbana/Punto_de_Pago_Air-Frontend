import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button } from 'react-bootstrap';
import { MdFlight } from 'react-icons/md';
import { useSearchParams } from "react-router";
import { useStoreFlight } from '../../store/store'
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import axios from 'axios';


import { getWeekDays } from "../../helpers/utils"


const FlightList = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
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
    setModalContent([]);
  };

  const handleSelectFlight = () => {

    info_flight(modalContent)
    navigate('/userReservation', { replace: true });
  };
  useEffect(() => {
    setLoading(true);
    const fetchFlightList = async () => {
      try {

        const response = await axios.get('https://cantozil.pythonanywhere.com/api/flights/search', {
          params: { origin, destination, date }
        });

        setResults(response.data);

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
          <div className="day-selector d-flex justify-content-between mb-4 px-2">
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
                        <h5 className="flight-info-header">
                          {
                            new Date(flight.fecha_inicio).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                          }
                        </h5>
                        <span className="flight-info-sub">{flight.origin.code}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h5 className="flight-info-header">
                          {
                            new Date(flight.fecha_final).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                          }
                        </h5>
                        <span className="flight-info-sub">{flight.destination.code}</span>
                      </div>
                    </div>
                    <div className="text-center mb-3">
                      <div className="flight-type position-relative">
                        {
                          flight.vuelos.length > 1 ?
                            <span>{flight.vuelos.length - 1} Escalas</span> :
                            <span>Directo</span>

                        }
                        <div className="position-absolute text-dark end-0">
                          <span>Cop </span>
                          <span className='h2  font-weight-bold ' style={{fontWeight: 700}}>{flight.precio} </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-center mt-3">
                        <div className="flight-details-divider"></div>
                        <MdFlight className="flight-details-icon" />
                        <div className="flight-details-divider"></div>
                      </div>
                      <div className="flight-duration">{flight.duration}</div>
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleShowModal(flight.vuelos)}
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
                modalContent.map((flight) => (
                  <div key={flight.id}>
                    <p><strong>Origen:</strong> {flight.origin} </p>
                    <p><strong>Destino:</strong> {flight.destination} </p>
                    {/* <p><strong>Duración:</strong> {flight.duration}</p> */}
                    <p><strong>Hora de salida:</strong> {flight.departure_time}</p>
                    <p><strong>Hora de llegada:</strong> {flight.arrival_time}</p>
                    <hr />
                  </div>
                )))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSelectFlight}>
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

