import { useState, useEffect } from "react";
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/avion.png'
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useSearchParams } from "react-router";
import axios from "axios";

const UserConsultationForm = () => {

  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");



  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get('id');
  const email = searchParams.get('email');
 
  const [searchId, setSearchId] = useState(id);
  const [searchEmail, setSearchEmail] = useState(email);
  useEffect(() => {

    const fetchReservation = async () => {
      try {

        const response = await axios.get(`https://cantozil.pythonanywhere.com/api/bookings/${id}`, {
          params: { email }
        });
        
        if (response.data){
          setReservation(response.data[0])
          setError("")
        }else{
          setReservation(null)
          setError("La reserva  no fue encontrada.")
        }


      } catch (err) {
          setReservation(null)
          console.error('Error fetching flights:', err);
          setError("La reserva  no fue encontrada.");
        
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
    setSearchParams({
      "id": searchId,
      "email": searchEmail
    })
  }

  return (
    <><header className="header mb-4">
      <img
        src={logo}
        width="150"
        height="60"
        alt="Logo Portal de Pago Air"
        className="logo-left" />
    </header>
      <Container className="mt-5">
        <Row className="align-items-center">
          {/* Columna para el formulario */}
          <Col md={6}>
            <h2 className="mb-4">Consulta tu Reserva</h2>
            <Form>
              <Form.Group controlId="formDocumentNumber" className="mb-3">
                <Form.Label>Número de Reserva</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu número de documento"
                  name="documentNumber"
                  value={searchId}
                  onChange={handleChangeID}
                  required
                />
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
                />
              </Form.Group>
              <div className="text-center">
                <Button variant="primary" onClick={handleSearch}>
                  Buscar Reserva
                </Button>
              </div>
            </Form>
          </Col>

          {/* Columna para la imagen */}
          <Col md={6} className="d-flex justify-content-center">
            <img
              src={imgFlight}
              alt="Reserva logo"
              className="img-fluid rounded"
              style={{ maxWidth: "80%", height: "auto" }} // Ajustar tamaño de la imagen
            />
          </Col>
        </Row>

        {/* Mostrar resultado debajo */}
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            {reservation && (
              <Card className="p-4">
                <Card.Body>
                  <Card.Title className="mb-3">Detalles de la Reserva</Card.Title>
                  <p><strong>Reserva id:</strong> {reservation.id}</p>
                  <p><strong>Vuelo origen:</strong> {reservation.flight.origin.name}</p>
                  <p><strong>Vuelo destino:</strong> {reservation.flight.destination.name}</p>
                  <p><strong>Hora salida</strong> {reservation.flight.departure_time}</p>
                  <p><strong>Hora llegada:</strong> {reservation.flight.arrival_time}</p>

                  <hr />
                  <h3>Personas</h3>
                  {
                    reservation.passengers.map((person) => (
                      <div key={person.email}>
                        <p><strong>Nombre:</strong> {person.first_name}</p>
                        <p><strong>Apellido:</strong> {person.last_name}</p>
                        <p><strong>Correo:</strong> {person.email}</p>
                        <hr />
                      </div>
                    ))
                  }

                </Card.Body>
              </Card>
            )}
            {error && (
              <Card className="p-4 bg-danger text-white">
                <Card.Body>
                  <Card.Text>{error}</Card.Text>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container></>
  );
};

export default UserConsultationForm;
