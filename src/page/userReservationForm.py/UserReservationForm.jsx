
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/avion.png'
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import {useStoreFlight} from  '../../store/store';


const UserReservationForm = () => {
    const navigate = useNavigate();
 
    const { information } = useStoreFlight()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data) => {
        try {
            console.log("data")
            console.log(data)
            console.log(data)
            // Replace with your actual API endpoint
            // const response = await axios.post('/api/reservations', data);
            const response = { "data": [2, 5, 4] }

            // Successful reservation
            if (response.data) {
                
                reset(); // Clear form
                navigate("/userConsultation");
            } else {
                alert('Error al realizar la reserva');
            }
        } catch (error) {
            console.error('Error en la reserva:', error);
            alert('Ocurrió un error al procesar la reserva');
        }
    };

    console.log("information")
    console.log({...information})
    const goToReservationLookup = () => {
        navigate("/userConsultation"); // Navegar a la vista de consulta
    };

    return (
        <>
            <header className="header mb-4 d-flex justify-content-between align-items-center">
                <img
                    src={logo}
                    width="150"
                    height="60"
                    alt="Logo Portal de Pago Air"
                    className="logo-left"
                />
                <Button
                    variant="outline-primary"
                    onClick={goToReservationLookup}
                    className="me-4"
                >
                    Consultar Reserva
                </Button>
            </header>

            <Container className="mt-5">
                <Row className="align-items-center">
                    {/* Formulario a la izquierda */}
                    <Col md={6}>
                        <h2 className="mb-4">Formulario de Reserva</h2>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formLastName" className="mb-3">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu apellido"
                                            {...register('lastName', {
                                                required: 'El apellido es obligatorio',
                                                minLength: {
                                                    value: 2,
                                                    message: 'El apellido debe tener al menos 2 caracteres'
                                                }
                                            })}
                                            isInvalid={!!errors.lastName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formFirstName" className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            {...register('firstName', {
                                                required: 'El nombre es obligatorio',
                                                minLength: {
                                                    value: 2,
                                                    message: 'El nombre debe tener al menos 2 caracteres'
                                                }
                                            })}
                                            isInvalid={!!errors.firstName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.firstName?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formGender" className="mb-3">
                                        <Form.Label>Género</Form.Label>
                                        <Form.Select
                                            {...register('gender', {
                                                required: 'Selecciona un género'
                                            })}
                                            isInvalid={!!errors.gender}
                                        >
                                            <option value="">Selecciona tu género</option>
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.gender?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingresa tu correo"
                                            {...register('email', { 
                                                required: 'El correo es obligatorio',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Correo electrónico inválido'
                                                }
                                            })}
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email?.message}
                                        </Form.Control.Feedback>
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
                                            {...register('phone', { 
                                                required: 'El número de celular es obligatorio',
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: 'Número de celular inválido (10 dígitos)'
                                                }
                                            })}
                                            isInvalid={!!errors.phone}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.phone?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formDocumentType" className="mb-3">
                                        <Form.Label>Tipo de Documento</Form.Label>
                                        <Form.Select
                                             {...register('documentType', { 
                                                required: 'Selecciona un tipo de documento'
                                            })}
                                            isInvalid={!!errors.documentType}
                                        >
                                            <option value="">Selecciona el tipo de documento</option>
                                            <option value="dni">Cédula</option>
                                            <option value="passport">Pasaporte</option>
                                            <option value="idCard">Número de Identidad</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.documentType?.message}
                                        </Form.Control.Feedback>
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
                                            {...register('documentNumber', { 
                                                required: 'El número de documento es obligatorio',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Número de documento inválido'
                                                }
                                            })}
                                            isInvalid={!!errors.documentNumber}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.documentNumber?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="text-center">
                                <Button variant="primary" type="submit">
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