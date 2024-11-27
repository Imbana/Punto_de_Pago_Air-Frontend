import { useState } from "react";
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/avion.png'
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const mockReservations = [
  {
    documentNumber: "12345678",
    email: "juan@example.com",
    reservationDetails: {
      flight: "BOG-MDE",
      departure: "06:00 AM",
      arrival: "07:30 AM",
      date: "2024-12-01",
      seat: "12A",
    },
  },
  {
    documentNumber: "87654321",
    email: "maria@example.com",
    reservationDetails: {
      flight: "BOG-CTG",
      departure: "08:00 AM",
      arrival: "10:30 AM",
      date: "2024-12-02",
      seat: "7C",
    },
  },
];

const UserConsultationForm = () => {
  const [searchInfo, setSearchInfo] = useState({ documentNumber: "", email: "" });
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchInfo({ ...searchInfo, [name]: value });
  };

  const handleSearch = () => {
    // Simular búsqueda 
    const foundReservation = mockReservations.find(
      (res) =>
        res.documentNumber === searchInfo.documentNumber &&
        res.email === searchInfo.email
    );

    if (foundReservation) {
      setReservation(foundReservation.reservationDetails);
      setError("");
    } else {
      setReservation(null);
      setError("No se encontró ninguna reserva con los datos ingresados.");
    }
  };

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
            value={searchInfo.documentNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu correo"
            name="email"
            value={searchInfo.email}
            onChange={handleChange}
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
            <p><strong>Vuelo:</strong> {reservation.flight}</p>
            <p><strong>Fecha:</strong> {reservation.date}</p>
            <p><strong>Salida:</strong> {reservation.departure}</p>
            <p><strong>Llegada:</strong> {reservation.arrival}</p>
            <p><strong>Asiento:</strong> {reservation.seat}</p>
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
