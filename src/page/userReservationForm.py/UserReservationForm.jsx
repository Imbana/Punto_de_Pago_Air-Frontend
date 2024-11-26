import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/avion.png'
 
const UserReservationForm = () => {
    const [userInfo, setUserInfo] = useState({
        lastName: "",
        firstName: "",
        gender: "",
        email: "",
        phone: "",
        documentType: "",
        documentNumber: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleReservation = () => {
        console.log("Información del usuario:", userInfo);
        alert("Reserva realizada con éxito!");
    };

    return (

        <>
            <header className="header mb-4">
                <img
                    src={logo}
                    width="150"
                    height="60"
                    alt="Logo Portal de Pago Air"
                    className="logo-left"
                />
            </header>

            <Container className="mt-5">
                <Row className="align-items-center">
                    {/* Formulario a la izquierda */}
                    <Col md={6}>
                        <h2 className="mb-4">Formulario de Reserva</h2>
                        <Form>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formLastName" className="mb-3">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu apellido"
                                            name="lastName"
                                            value={userInfo.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formFirstName" className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            name="firstName"
                                            value={userInfo.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formGender" className="mb-3">
                                        <Form.Label>Género</Form.Label>
                                        <Form.Select
                                            name="gender"
                                            value={userInfo.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona tu género</option>
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingresa tu correo"
                                            name="email"
                                            value={userInfo.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formPhone" className="mb-3">
                                        <Form.Label>Celular</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu número de celular"
                                            name="phone"
                                            value={userInfo.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formDocumentType" className="mb-3">
                                        <Form.Label>Tipo de Documento</Form.Label>
                                        <Form.Select
                                            name="documentType"
                                            value={userInfo.documentType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona el tipo de documento</option>
                                            <option value="dni">Cédula</option>
                                            <option value="passport">Pasaporte</option>
                                            <option value="idCard">Número de Identidad</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formDocumentNumber" className="mb-3">
                                        <Form.Label>Número de Documento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu número de documento"
                                            name="documentNumber"
                                            value={userInfo.documentNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="text-center">
                                <Button variant="primary" onClick={handleReservation}>
                                    Hacer Reserva
                                </Button>
                            </div>

                        </Form>
                    </Col>

                    {/* Imagen a la derecha */}
                    <Col md={6}>
                        <div className="d-flex justify-content-center align-items-center">
                            <img
                                src={imgFlight} // Reemplaza con la URL de tu imagen
                                alt="Reserva logo"
                                className="img-fluid rounded"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>

        </>
    );
}

export default UserReservationForm