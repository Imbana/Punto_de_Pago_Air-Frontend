import { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Modal, Button, Accordion } from 'react-bootstrap';
import { PiSeatLight, PiSuitcaseRollingLight } from "react-icons/pi";
import { MdFlight } from 'react-icons/md';
import './flighList.css';

import { useSearchParams } from "react-router";
import { useStoreFlight } from '../../store/store'
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import axios from 'axios';
import { Link } from "react-router-dom";

import { getWeekDays } from "../../helpers/utils"
import { BsBackpack3 } from 'react-icons/bs';
import { LuBaggageClaim } from 'react-icons/lu';
import { FaPlaneCircleCheck } from 'react-icons/fa6';

const FlightList = () => {
  const [results, setResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { info_flight } = useStoreFlight()
  const [activeIndex, setActiveIndex] = useState(null)
  const [classflight, setClassFlight] = useState(null)

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);

  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const babies = searchParams.get('babies');

  const navigate = useNavigate();

  const handleSelectClass = (flight, classSeat) => {
    const flightAndFilters = {
      flight: flight,
      filters: {
        origen: origin,
        destination: destination,
        date: date,
        adults: adults,
        children: children,
        babies: babies,
        seat_class: classSeat,
      }
    }
    info_flight(flightAndFilters)
    navigate('/userReservation', { replace: true });
  }

  const handleShowModal = (flight) => {
    setModalContent(flight);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent([]);
  };

  const fetchClassFlight = async () => {
    try {
      const response = await axios.get(`https://cantozil.pythonanywhere.com/api/flight/1/availability/2024-11-10`);
      setClassFlight(response.data);
    } catch (err) {
      console.error('Error fetching class flight:', err);
    }
  };

  const handleShowClass = (flight, index) => {
    if (activeIndex === index) {
      setActiveIndex(null)
      return;
    }

    setActiveIndex(index)
    fetchClassFlight(flight)
  }

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
        // Añadir un retardo de 1 segundo antes de desactivar el indicador de carga
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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
      date,
      children,
      babies,
      adults
    });
  };

  const scrollDaySelector = (direction) => {
    const daySelector = document.querySelector('.day-selector');
    if (direction === 'left') {
      daySelector.scrollBy({ left: -150, behavior: 'smooth' });
    } else if (direction === 'right') {
      daySelector.scrollBy({ left: 150, behavior: 'smooth' });
    }
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
      <header className="header m-4 d-flex justify-content-between align-items-center px-4">
        <Link to="/">
          <img src={logo} width="100" alt="Logo" className="logo-left" />
        </Link>
      </header>
      <div className="results-container">
        <Container className="mt-5 mb-5">

          <div className="hero-list mb-4">
            {/* Título Vuelos */}
            <h2 className="flight-title mb-2 text-center">Vuelos</h2>

            {/* Texto del origen y destino */}
            <div className="flight-path d-flex align-items-center justify-content-between mt-3">
              {/* Punto de origen */}
              <h4 className="flight-origin">{origin}</h4>

              {/* Contenedor de la línea y el avión */}
              <div className="flight-line-container d-flex align-items-center flex-grow-1 mx-3 position-relative">
                {/* Línea punteada a la izquierda */}
                <div className="flight-line flex-grow-1"></div>

                {/* Ícono del avión centrado */}
                <MdFlight className="plane-icon position-absolute start-50 translate-middle" />

                {/* Línea punteada a la derecha */}
                <div className="flight-line flex-grow-1"></div>
              </div>

              {/* Punto de destino */}
              <h4 className="flight-destination">{destination}</h4>
            </div>
          </div>





          {/* Day Selector */}
          <div className="mt-2">
            <div className="day-selector-wrapper position-relative d-flex align-items-center">
              {/* Botón de desplazamiento hacia la izquierda */}
              <button className="scroll-button left-button" onClick={() => scrollDaySelector('left')}>
                &#8249;
              </button>

              <div className="day-selector overflow-x-auto d-flex justify-content-between mb-4 px-2">
                {weekDays.map((date) => {
                  const dayName = new Intl.DateTimeFormat('es-CO', { weekday: 'short' }).format(new Date(date + 'T00:00:00-05:00')); // Abreviación del día
                  const dayNumber = new Date(date).getDate(); // Número del día
                  const monthName = new Intl.DateTimeFormat('es-CO', { month: 'short' }).format(new Date(date + 'T00:00:00-05:00')); // Abreviación del mes

                  return (
                    <button
                      key={date}
                      className={`btn day-button ${date === selectedDate ? 'btn-selected' : ''}`}
                      onClick={() => handleDayClick(date)}
                    >
                      {`${dayName}. ${dayNumber} ${monthName}.`}
                    </button>
                  );
                })}
              </div>

              {/* Botón de desplazamiento hacia la derecha */}
              <button className="scroll-button right-button" onClick={() => scrollDaySelector('right')}>
                &#8250;
              </button>
            </div>
          </div>






          {/* Flights */}
          <Row className="g-4">
            {results.length > 0 ? (
              results.map((flight, index) => (
                <Col key={index} xs={12}>
                  <Card className="card-flight">
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ textAlign: 'left' }}>
                        <h5 className="flight-info-header">
                          {
                            new Date(flight.fecha_inicio).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                          }
                        </h5>
                        <span className="flight-info-sub text-code">{flight.origin.code}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <h5 className="flight-info-header">
                          {
                            new Date(flight.fecha_final).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                          }
                        </h5>
                        <span className="flight-info-sub text-code">{flight.destination.code}</span>
                      </div>
                    </div>



                    <div className="text-center mb-3">
                      <div className="flight-type position-relative">
                        {
                          flight.vuelos.length > 1 ?
                            <span onClick={() => handleShowModal(flight.vuelos)} className='link-span'>{flight.vuelos.length - 1} Escala(s)</span> :
                            <span onClick={() => handleShowModal(flight.vuelos)} className='link-span'>Directo</span>
                        }
                      </div>

                      <div className="text-center flight-duration text-duration">{flight.duracion}</div>


                      <div className="flight-route d-flex align-items-center justify-content-center mt-3">
                        <div className="flight-point"></div>
                        <div className="flight-details-divider"></div>
                        <MdFlight className="flight-details-icon" />
                        <div className="flight-details-divider"></div>
                        <div className="flight-point"></div>
                      </div>



                    </div>


                    <div className="text-center mb-2">
                      <span className='h2 font-weight-bold' style={{ fontWeight: 700 }}>
                        {Number(flight.precio).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                        })} </span> COP
                    </div>


                    <Accordion defaultActiveKey={0} activeKey={activeIndex === index ? '0' : null} onSelect={() => handleShowClass(flight, index)}>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header className='center-text-accordion-button'>
                          Elige como quieres volar
                        </Accordion.Header>
                        <Accordion.Body>
                          <div className="container">
                            <h2 className="text-center">Nuestros Planes</h2>
                            {classflight ? (
                              <Row className="row-cols-1 row-cols-md-3 g-4">
                                {/* Clase Económica */}
                                <Col>
                                  <Card className='shadow-sm'>
                                    <Card.Body className='card-body'>
                                      <Card.Title className='text-center'>Económico</Card.Title>
                                      <Card.Subtitle className='text-center mb-3'>
                                        {
                                          (flight.precio + (flight.precio * (classflight.economy_class_available.percentage / 100))).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                          })
                                        }
                                      </Card.Subtitle>
                                      <ul className="list-unstyled">
                                        <li>
                                          <BsBackpack3 className='red-icon' /> 1 artículo personal (bolso)
                                        </li>
                                        <li>
                                          <PiSuitcaseRollingLight className='red-icon' /> 1 equipaje de mano (10 kg)
                                        </li>
                                        <li>
                                          <LuBaggageClaim className='red-icon' /> 1 equipaje de bodega (23 kg)
                                        </li>
                                        <li>
                                          <FaPlaneCircleCheck className='red-icon' /> Check-in en aeropuerto
                                        </li>
                                        <li>
                                          <PiSeatLight className='red-icon' /> Asiento Economy incluido
                                        </li>
                                      </ul>

                                    </Card.Body>
                                    <Button disabled={classflight.economy_class_available.cant_seat > 0 ? false : true} variant='primary' block='true' className='btn' onClick={() => handleSelectClass(flight.vuelos, 'economy_class')}>
                                      {classflight.economy_class_available.cant_seat > 0 ? 'Seleccionar' : 'Asientos No Disponibles'}
                                    </Button>
                                    <Card.Text className='gray-label'>Precio por pasajero</Card.Text>
                                  </Card>
                                </Col>

                                {/* Clase Ejecutiva */}
                                <Col>
                                  <Card className='shadow-sm'>
                                    <Card.Body className='card-body'>
                                      <Card.Title className='text-center'>Ejecutiva</Card.Title>
                                      <Card.Subtitle className='text-center mb-3'>
                                        {
                                          (flight.precio + (flight.precio * (classflight.business_class_available.percentage / 100))).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                          })
                                        }
                                      </Card.Subtitle>
                                      <ul className="list-unstyled">
                                        <li>
                                          <BsBackpack3 className='orange-icon' /> 1 artículo personal (bolso)
                                        </li>
                                        <li>
                                          <PiSuitcaseRollingLight className='orange-icon' /> 1 equipaje de mano (10 kg)
                                        </li>
                                        <li>
                                          <LuBaggageClaim className='orange-icon' /> 1 equipaje de bodega (23 kg)
                                        </li>
                                        <li>
                                          <FaPlaneCircleCheck className='orange-icon' /> Check-in en aeropuerto
                                        </li>
                                        <li>
                                          <PiSeatLight className='orange-icon' /> Asiento Ejecutivo incluido
                                        </li>
                                      </ul>

                                    </Card.Body>
                                    <Button disabled={classflight.business_class_available.cant_seat > 0 ? false : true} variant='primary' block='true' className='btn' onClick={() => handleSelectClass(flight.vuelos, 'business_class')}>
                                      {classflight.business_class_available.cant_seat > 0 ? 'Seleccionar' : 'Asientos No Disponibles'}
                                    </Button>
                                    <Card.Text className='gray-label'>Precio por pasajero</Card.Text>
                                  </Card>
                                </Col>

                                {/* Primera Clase */}
                                <Col>
                                  <Card className='shadow-sm'>
                                    <Card.Body className='card-body'>
                                      <Card.Title className='text-center'>Primera Clase</Card.Title>
                                      <Card.Subtitle className='text-center mb-3'>
                                        {
                                          (flight.precio + (flight.precio * (classflight.first_class_available.percentage / 100))).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                          })
                                        }
                                      </Card.Subtitle>
                                      <ul className="list-unstyled">
                                        <li>
                                          <BsBackpack3 className='purple-icon' /> 1 artículo personal (bolso)
                                        </li>
                                        <li>
                                          <PiSuitcaseRollingLight className='purple-icon' /> 1 equipaje de mano (10 kg)
                                        </li>
                                        <li>
                                          <LuBaggageClaim className='purple-icon' /> 1 equipaje de bodega (23 kg)
                                        </li>
                                        <li>
                                          <FaPlaneCircleCheck className='purple-icon' /> Check-in en aeropuerto
                                        </li>
                                        <li>
                                          <PiSeatLight className='purple-icon' /> Asiento Primera Clase Incluido
                                        </li>
                                      </ul>

                                    </Card.Body>
                                    <Button disabled={classflight.first_class_available.cant_seat > 0 ? false : true} variant='primary' block='true' className='btn' onClick={() => handleSelectClass(flight.vuelos, 'first_class')}>
                                      {classflight.first_class_available.cant_seat > 0 ? 'Seleccionar' : 'Asientos No Disponibles'}
                                    </Button>
                                    <Card.Text className='gray-label'>Precio por pasajero</Card.Text>
                                  </Card>
                                </Col>

                              </Row>
                            ) : (
                              <Row className="row-cols-1 row-cols-md-3 g-4">
                                <p className='text-center'>Cargando...</p>
                              </Row>
                            )}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

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
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del vuelo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalContent && (
                modalContent.map((flight) => (
                  <div key={flight.id}>
                    <p><strong>Origen:</strong> {flight.origin} </p>
                    <p><strong>Destino:</strong> {flight.destination} </p>
                    <p><strong>Hora de salida:</strong> {flight.departure_time}</p>
                    <p><strong>Hora de llegada:</strong> {flight.arrival_time}</p>
                    <hr />
                  </div>
                )))}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>


        </Container>
      </div >
    </>
  );
};

export default FlightList;
