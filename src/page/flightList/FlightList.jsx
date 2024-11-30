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

  const fetchClassFlight = async (flight) => {
    try {
      const response = await axios.get(`https://cantozil.pythonanywhere.com/api/flight/1/availability/2024-11-10`);
      console.log(response)

      // const data = [{"code": "sdfsd", "name": "Hola cimo est"}, {"code": "sdfsd43", "name": "Hola cimo est434"}]
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

        console.log(response.data)
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
          <h2 className="mb-4">Vuelos desde {origin} hacia {destination}</h2>

          {/* Day Selector */}
          <div className="mt-2">
            <div className='day-selector overflow-x-auto d-flex d- justify-content-between mb-4 px-2'>
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
                            <span onClick={() => handleShowModal(flight.vuelos)} className='link-span'>{flight.vuelos.length - 1} Escala(s)</span> :
                            <span onClick={() => handleShowModal(flight.vuelos)} className='link-span'>Directo</span>
                        }
                        <div className="position-absolute text-dark end-0">

                          <span className='h2  font-weight-bold ' style={{ fontWeight: 700 }}>
                            {Number(flight.precio).toLocaleString('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                            })} </span> COP
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-center mt-3">
                        <div className="flight-details-divider"></div>
                        <MdFlight className="flight-details-icon" />
                        <div className="flight-details-divider"></div>
                      </div>
                      <div className="flight-duration">{flight.duration}</div>
                    </div>

                    <Accordion defaultActiveKey={0}>
                      <Accordion.Header variant="outline-primary" onClick={handleShowClass} className='center-text-accordion-button btn-outline-primary'>
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

