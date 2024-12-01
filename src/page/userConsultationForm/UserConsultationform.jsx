import { useState, useEffect } from "react";
import imgFlight from '../../assets/consultar.jpg'
import { Form, Button, Container, Row, Col, Card, Accordion } from "react-bootstrap";
import { useSearchParams } from "react-router";
import axios from "axios";
import Header from "../../components/Header";

const UserConsultationForm = () => {
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");

  const statusPaymentClass = reservation && reservation.payment_status === 'PENDIENTE' ? 'badge bg-warning-subtle border-warning-subtle text-warning-emphasis rounded-pill' : ' bg-success-subtle border-success-subtle text-success-emphasis rounded-pill';

  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get('id');
  const email = searchParams.get('email');

  const [searchId, setSearchId] = useState(id);
  const [searchEmail, setSearchEmail] = useState(email);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(`https://cantozil.pythonanywhere.com/api/bookings-scales/${id}`, {
          params: { email }
        });

        console.log(response.data)
        if (response.data) {
          setReservation(response.data)
          setError("")
        } else {
          setReservation(null)
          setError("La reserva no fue encontrada.")
        }
      } catch (err) {
        setReservation(null)
        console.error('Error fetching flights:', err);
        setError("La reserva no fue encontrada.");
      }
    };

    fetchReservation();
  }, [id, email]);

  const handleChangeEmail = (date) => {
    setSearchEmail(date.target.value)
  };
  const handleChangeID = (date) => {
    setSearchId(date.target.value)
  };

  const handleSearch = () => {
    console.log('click')
    setSearchParams({
      "id": searchId,
      "email": searchEmail
    })
  }

  return (
    <>
      <Header />
      <Container className="mt-5">
        <Row className="align-items-center flex-column-reverse flex-md-row">
          {/* Columna para la imagen */}
          <Col xs={12} md={6} className="d-flex justify-content-center mt-4 mt-md-0">
            <img
              src={imgFlight}
              alt="Reserva logo"
              className="img-fluid rounded"
              style={{ maxWidth: "80%", height: "auto" }}
            />
          </Col>

          {/* Columna para el formulario */}
          <Col xs={12} md={6} className="d-flex flex-column align-items-start justify-content-start p-4">
            <h2 className="mb-4">Consulta tu Reserva</h2>
            <Form className="w-100" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <Form.Group controlId="formDocumentNumber" className="mb-3">
                <Form.Label>Número de Reserva</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu número de documento"
                  name="documentNumber"
                  value={searchId}
                  onChange={handleChangeID}
                  required
                  isInvalid={!searchId}
                />
                <Form.Control.Feedback type="invalid">
                  El número de reserva es obligatorio.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu correo"
                  name="email"
                  value={searchEmail}
                  onChange={handleChangeEmail}
                  required
                  isInvalid={!searchEmail}
                />
                <Form.Control.Feedback type="invalid">
                  El correo electrónico es obligatorio.
                </Form.Control.Feedback>
              </Form.Group>
              <div className="text-center">
                <Button type="submit" variant="primary">
                  Buscar Reserva
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        {/* Mostrar resultado debajo */}
        <Row className="justify-content-center mt-4">
          <Col md={10}>
            {reservation && (
              <Card className="p-4">
                <Card.Body>
                  <Card.Title className="mb-3">Detalles de la Reserva</Card.Title>

                  <Row>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Reserva id:</strong> {reservation.id}
                      </Card.Text>
                    </Col>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Fecha del Vuelo:</strong>  Noviembre 28 del 2024
                      </Card.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Fecha de Reserva</strong> {new Date(reservation.booking_date).toLocaleDateString('es-CO')}
                      </Card.Text>
                    </Col>
                    <Col></Col>
                  </Row>
                  <hr />
                  {
                    reservation.flights.map((flight) => (
                      <div key={flight.id}>
                        <Row>
                          <Col md={6}>
                            <Card.Text>
                              <strong>Vuelo origen:</strong> {flight.origin.name}
                            </Card.Text>
                          </Col>
                          <Col md={6}>
                            <Card.Text>
                              <strong>Vuelo destino:</strong> {flight.destination.name}
                            </Card.Text>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Card.Text>
                              <strong>Hora salida</strong> {flight.departure_time}
                            </Card.Text>
                          </Col>
                          <Col md={6}>
                            <Card.Text>
                              <strong>Hora llegada:</strong> {flight.arrival_time}
                            </Card.Text>
                          </Col>
                        </Row>
                        <hr />
                      </div>
                    ))
                  }

                  <Card.Title className="mb-3">Detalles del Pago</Card.Title>
                  <Row>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Costo:</strong>
                        {Number(reservation.total_price).toLocaleString('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                        })}
                      </Card.Text>
                    </Col>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Estado: </strong>
                        <span className={statusPaymentClass}>
                          {reservation.payment_status}
                        </span>
                      </Card.Text>
                    </Col>
                  </Row>
                  {reservation && reservation.payment_status === 'PENDIENTE' && (
                    <Row>
                      <Col md={12}>
                        <Card.Text>
                          <strong>Código de Pago:</strong> {reservation.payment_code} <br />
                          <strong className="text-danger">Importante!</strong> Por favor acercarse a realizar el pago en nuestros puntos.
                        </Card.Text>
                      </Col>
                    </Row>
                  )}

                  <hr />
                  <Card.Title className="mb-3">Pasajero(s)</Card.Title>
                  <Accordion defaultActiveKey={0}>
                    {reservation.passengers &&
                      reservation.passengers.map((person, index) => (
                        <Accordion.Item eventKey={index} key={person.email}>
                          <Accordion.Header variant="link">
                            Pasajero Nº {index + 1} - {person.is_infant ? 'Bebé' : 'Adulto'}
                          </Accordion.Header>
                          <Accordion.Body>
                            <Row>
                              <Col md={6}>
                                <Card.Text>
                                  <strong>Nombre:</strong> {person.first_name}
                                </Card.Text>
                              </Col>
                              <Col md={6}>
                                <Card.Text>
                                  <strong>Apellido:</strong> {person.last_name}
                                </Card.Text>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <Card.Text>
                                  <strong>Correo Eléctronico:</strong> {person.email}
                                </Card.Text>
                              </Col>
                              <Col md={6} className="d-flex">
                                <strong>Vuelos- asiento: </strong>
                                {person.seats.map(seat => (
                                  <div key={seat.id}>
                                    <span>{seat.airplane}</span>
                                    <span>  - </span>
                                    <span> {seat.seat}, </span>
                                  </div>
                                ))}
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <Card.Text>
                                  <strong>Fecha de Nacimiento:</strong> {new Date(person.date_of_birth).toLocaleDateString('es-CO')}
                                </Card.Text>
                              </Col>
                              <Col md={6}></Col>
                            </Row>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))
                    }
                  </Accordion>
                </Card.Body>
              </Card>
            )}
            {error && (
              <Card className="p-4 bg-danger text-white text-center">
                <Card.Body>
                  <Card.Text className="fw-bold">{error}</Card.Text>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserConsultationForm;
