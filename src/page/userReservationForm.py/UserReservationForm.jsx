import { Form, Button, Container, Row, Col } from "react-bootstrap";
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/avion.png';
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from 'react-hook-form'; 
import { useStoreFlight } from '../../store/store';
import axios from "axios";

import { dataReservation } from "../../helpers/utils";

const UserReservationForm = () => {
    const navigate = useNavigate();
    const { information } = useStoreFlight();

    // Obtener los filtros de pasajeros, calculando el número total de pasajeros
    const adults = parseInt(information.flight.filters.adults || 0);
    const babies = parseInt(information.flight.filters.babies || 0);
    const children = parseInt(information.flight.filters.children || 0);
    const passengersCount = adults + children + babies || 1;

    const {
        register,
        handleSubmit,
        control, // Necesario para useFieldArray
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            passengers: [...Array(passengersCount).keys()].map(() => ({
                firstName: '',
                lastName: '',
                gender: '',
                email: '',
                birthDate: '',
                phone: '',
                documentType: '',
                documentNumber: ''
            }))
        }
    });

    // Usamos useFieldArray para gestionar la lista de pasajeros
    const { fields } = useFieldArray({
        control,
        name: "passengers", // Nombre para los datos del array
        keyName: "id" // Para identificar dinámicamente los elementos
    });
    
    const onSubmit = async (data) => {
        try {
            console.log("Datos del formulario:", data);
            console.log("Información del vuelo:", information.flight);
    
            if (!information.flight ) {
                alert("No se encontró información del vuelo. Por favor, selecciona un vuelo válido.");
                return;
            }
    
            const dataEndpoint = dataReservation(information.flight, data);
            console.log("Datos enviados al servidor:", dataEndpoint);
    
            const response = await axios.post('https://cantozil.pythonanywhere.com/api/bookings/', dataEndpoint);
    
            if (response.data) {
                reset();
                const params = new URLSearchParams({ id: response.data.id, email: response.data.passengers[0].email });
                navigate(`/userConsultation?${params.toString()}`);
            } else {
                alert('Error al realizar la reserva. Intenta de nuevo.');
            }
        } catch (error) {
            console.error("Error al procesar la solicitud:", error.message);
            alert(`Ocurrió un error: ${error.message}`);
        }
    };
    
    const goToReservationLookup = () => {
        navigate("/userConsultation");
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
                            {/* Generar secciones dinámicas según el número de pasajeros */}
                            {fields.map((item, index) => (
                                <div key={item.id} className="mb-4">
                                    <h5>Pasajero {index + 1}</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId={`formFirstName${index}`} className="mb-3">
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresa tu nombre"
                                                    {...register(`passengers.${index}.firstName`, {
                                                        required: 'El nombre es obligatorio',
                                                        minLength: {
                                                            value: 2,
                                                            message: 'El nombre debe tener al menos 2 caracteres'
                                                        }
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.firstName}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.firstName?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId={`formLastName${index}`} className="mb-3">
                                                <Form.Label>Apellido</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresa tu apellido"
                                                    {...register(`passengers.${index}.lastName`, {
                                                        required: 'El apellido es obligatorio',
                                                        minLength: {
                                                            value: 2,
                                                            message: 'El apellido debe tener al menos 2 caracteres'
                                                        }
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.lastName}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.lastName?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {/* Otros campos (género, correo, etc.) para este pasajero */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId={`formGender${index}`} className="mb-3">
                                                <Form.Label>Género</Form.Label>
                                                <Form.Select
                                                    {...register(`passengers.${index}.gender`, {
                                                        required: 'Selecciona un género'
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.gender}
                                                >
                                                    <option value="">Selecciona tu género</option>
                                                    <option value="male">Masculino</option>
                                                    <option value="female">Femenino</option>
                                                    <option value="other">Otro</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.gender?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId={`formEmail${index}`} className="mb-3">
                                                <Form.Label>Correo</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Ingresa tu correo"
                                                    {...register(`passengers.${index}.email`, {
                                                        required: 'El correo es obligatorio',
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Correo electrónico inválido'
                                                        }
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.email?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId={`formBirthDate${index}`} className="mb-3">
                                                <Form.Label>Fecha de Nacimiento</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Ingresa tu fecha de nacimiento"
                                                    {...register(`passengers.${index}.birthDate`, {
                                                        required: 'La fecha de nacimiento es obligatoria',
                                                        validate: value =>
                                                            (new Date(value) <= new Date()) || 'La fecha no puede ser en el futuro'
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.birthDate}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.birthDate?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId={`formPhone${index}`} className="mb-3">
                                                <Form.Label>Celular</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresa tu número de celular"
                                                    {...register(`passengers.${index}.phone`, {
                                                        required: 'El número de celular es obligatorio',
                                                        pattern: {
                                                            value: /^[0-9]{10}$/,
                                                            message: 'Número de celular inválido (10 dígitos)'
                                                        }
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.phone}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.phone?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId={`formDocumentType${index}`} className="mb-3">
                                                <Form.Label>Tipo de Documento</Form.Label>
                                                <Form.Select
                                                    {...register(`passengers.${index}.documentType`, {
                                                        required: 'Selecciona un tipo de documento'
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.documentType}
                                                >
                                                    <option value="">Selecciona el tipo de documento</option>
                                                    <option value="dni">Cédula</option>
                                                    <option value="passport">Pasaporte</option>
                                                    <option value="idCard">Número de Identidad</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.documentType?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId={`formDocumentNumber${index}`} className="mb-3">
                                                <Form.Label>Número de Documento</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Ingresa tu número de documento"
                                                    {...register(`passengers.${index}.documentNumber`, {
                                                        required: 'El número de documento es obligatorio'
                                                    })}
                                                    isInvalid={!!errors?.passengers?.[index]?.documentNumber}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors?.passengers?.[index]?.documentNumber?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            ))}

                            <Button type="submit" variant="primary">Reservar</Button>
                        </Form>
                    </Col>

                    {/* Imagen a la derecha */}
                    <Col md={6}>
                        <img src={imgFlight} alt="Vuelos" className="img-fluid" />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default UserReservationForm;
