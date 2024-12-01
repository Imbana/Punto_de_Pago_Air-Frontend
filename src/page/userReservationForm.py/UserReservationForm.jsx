import { Form, Button, Container, Row, Col, Accordion } from "react-bootstrap";
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/image-form.jpg';
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from 'react-hook-form';
import { useStoreFlight } from '../../store/store';
import axios from "axios";
import { Link } from "react-router-dom";
import { dataReservation } from "../../helpers/utils";

const UserReservationForm = () => {
    const navigate = useNavigate();
    const { information } = useStoreFlight();

    // Obtener los filtros de pasajeros, calculando el número total de pasajeros
    const adults = parseInt(information.flight.filters.adults || 0);
    const babies = parseInt(information.flight.filters.babies || 0);
    const children = parseInt(information.flight.filters.children || 0);
    const passengersCount = adults + children + babies || 1;
    const seat_class = information.flight.filters.seat_class || 'economy_class';

    const {
        register,
        handleSubmit,
        control, // Necesario para useFieldArray
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            seat_class: seat_class,
            passengers: [...Array(passengersCount).keys()].map((index) => ({
                firstName: '',
                lastName: '',
                gender: '',
                email: '',
                birthDate: '',
                phone: '',
                documentType: '',
                documentNumber: '',
                type: index < adults ? 'adult' : index < adults + children ? 'child' : 'baby'
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

            if (!information.flight) {
                alert("No se encontró información del vuelo. Por favor, selecciona un vuelo válido.");
                return;
            }

            const dataEndpoint = dataReservation(information.flight, data);
            console.log("Datos enviados al servidor:", dataEndpoint);

            const response = await axios.post('https://cantozil.pythonanywhere.com/api/bookings_scales/', dataEndpoint);

            if (response.data) {
                reset();
                const params = new URLSearchParams({ id: response.data.id, email: response.data.passenger_email });
                navigate(`/userConsultation?${params.toString()}`);
            } else {
                alert('Error al realizar la reserva. Intenta de nuevo.');
            }
        } catch (error) {


            if (error.response && error.response.status === 404) {
                console.log("Hola mundoooooooo", error.response.data)
                const { error: errorMessage } = error.response.data;
                alert(`Error:  ${errorMessage} .`);
            }
            // console.error("Error al procesar la solicitud:", error.message);
            // alert(`Ocurrió un error: ${error.message}`);
        }
    };

    const goToReservationLookup = () => {
        navigate("/userConsultation", { replace: false });
    };

    return (
        <>
            <header className="header m-4 d-flex justify-content-between align-items-center px-4">
                <Link to="/">
                    <img src={logo} width="100" alt="Logo" className="logo-left" />
                </Link>
                <Button
                    variant="primary"
                    onClick={goToReservationLookup}
                    className="me-4 btn-primary"
                >
                    Consultar Reserva
                </Button>
            </header>




            <Container fluid>
                <Row className="align-item-center m-2 m-md-0">
                    {/* Imagen a la derecha */}
                    <Col md={6} className="position-relative d-none d-md-flex align-items-center justify-content-center rounded-4" style={{ minHeight: '80vh' }}>
                        <img src={imgFlight} alt="Vuelos" className="img-fluid h-100 w-100 rounded-4 col-image" style={{ objectFit: 'cover' }} />
                    </Col>


                    {/* Formulario a la izquierda */}
                    <Col md={6} className="d-flex flex-column align-items-start justify-content-start rounded-4 col-form p-3 p-md-5" style={{ minHeight: '100vh' }}>
                        <h2 className="mb-4 fw-bold">Formulario de Reserva</h2>
                        <Form onSubmit={handleSubmit(onSubmit)} className="w-100">
                            <Accordion defaultActiveKey="0">
                                {/* Generar secciones dinámicas según el número de pasajeros */}
                                {fields.map((item, index) => {
                                    const hasErrors = Object.keys(errors?.passengers?.[index] || {}).length > 0;
                                    return (
                                        <Accordion.Item eventKey={index.toString()} key={item.id} className={hasErrors ? 'border-danger' : 'border-success'}>
                                            <Accordion.Header className={hasErrors ? 'text-danger' : 'text-success'}>
                                                Pasajero {index + 1} ({item.type === 'adult' ? 'Adulto' : item.type === 'child' ? 'Niño' : 'Bebé'})
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div className={`mb-4 ${hasErrors ? 'bg-danger bg-opacity-10 p-3 rounded' : 'bg-success bg-opacity-10 p-3 rounded'}`}>
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
                                                                    max={
                                                                        item.type === 'adult'
                                                                            ? new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]
                                                                            : item.type === 'child'
                                                                                ? new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]
                                                                                : new Date(new Date().getFullYear() - 2, new Date().getMonth(), new Date().getDate()).toISOString().split('T')[0]
                                                                    }
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
                                                                    {item.type === 'adult' && <option value="dni">Cédula</option>}
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
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion>
                            <div className="d-flex justify-content-end">
                                <Button type="submit" variant="primary" className="mt-4">Reservar</Button>
                            </div>
                        </Form>
                    </Col>


                </Row>
            </Container>

        </>
    );
};

export default UserReservationForm;
