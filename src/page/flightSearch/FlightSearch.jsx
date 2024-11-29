import { useEffect, useState } from "react";
import axios from "axios";
import logo from '../../assets/logo.png';
import { Form, Button, InputGroup, FormControl, Container, Row, Col, Card, Modal, Spinner } from 'react-bootstrap';
import { MdFlightTakeoff, MdFlightLand, MdDateRange, MdSearch, MdRemove, MdAdd, MdFlight, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import './flightSearch.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStoreFlight } from '../../store/store';

// Esta es una implementación simplificada de la función getWeekDays
const getWeekDays = (selectedDate) => {
    const days = [];
    if (!selectedDate) return days;
    const startDate = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + i);
        days.push(newDate.toISOString().split('T')[0]);
    }
    return days;
};

const FlightSearch = () => {
    const [airports, setAirports] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [travelers, setTravelers] = useState({ adults: 1, youths: 0, children: 0, infants: 0 });
    const [showTravelerModal, setShowTravelerModal] = useState(false);
    const { start_flight, info_flight } = useStoreFlight();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [weekDays, setWeekDays] = useState([]);

    useEffect(() => {
        setWeekDays(getWeekDays(date || selectedDate));
    }, [date, selectedDate]);

    // Cambios en origen y destino
    const handleOriginChange = (e) => {
        const selectedOrigin = e.target.value;
        if (selectedOrigin === destination) {
            setDestination('');
        }
        setOrigin(selectedOrigin);
    };

    const handleDestinationChange = (e) => {
        const selectedDestination = e.target.value;
        if (selectedDestination === origin) {
            setOrigin('');
        }
        setDestination(selectedDestination);
    };

    // Cambios en cantidad de pasajeros
    const handleTravelerChange = (type, operation) => {
        setTravelers((prev) => {
            const newValue = operation === 'increment' ? prev[type] + 1 : prev[type] - 1;
            return {
                ...prev,
                [type]: Math.max(newValue, 0),
            };
        });
    };

    // Envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchFlights(date);
    };

    // Obtención de vuelos
    const fetchFlights = async (selectedDate) => {
        setLoading(true);
        try {
            const response = await axios.get('https://cantozil.pythonanywhere.com/api/flights/search', {
                params: { origin, destination, date: selectedDate }
            });
            setResults(response.data);
            setShowResults(true);
            setSelectedDate(selectedDate);
        } catch (err) {
            console.error('Error fetching flights:', err);
        } finally {
            setLoading(false);
        }
    };

    // Mostrar detalles del vuelo en un modal
    const handleShowModal = (flight) => {
        setModalContent(flight);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent([]);
    };

    const handleSelectFlight = () => {
        info_flight(modalContent);
        setShowModal(false);
    };

    // Manejar el cambio de día usando los botones
    const handleDayClick = (newDate) => {
        setSelectedDate(newDate);
        fetchFlights(newDate);
    };

    const handleLeftClick = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate.toISOString().split('T')[0]);
        fetchFlights(newDate.toISOString().split('T')[0]);
    };

    const handleRightClick = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate.toISOString().split('T')[0]);
        fetchFlights(newDate.toISOString().split('T')[0]);
    };

    // Obtención de aeropuertos
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                start_flight(); // Se mantiene la invocación de start_flight
                const response = await axios.get('https://cantozil.pythonanywhere.com/api/airports/');
                setAirports(response.data);
            } catch (err) {
                console.error('Error fetching airports:', err);
            }
        };
        fetchAirports();
    }, [start_flight]);

    return (
        <>
            <header className="header m-4 d-flex justify-content-between align-items-center px-4">
                <img src={logo} width="100" alt="Logo" className="logo-left" />
            </header>

            <div className="hero-section" style={{ backgroundSize: 'cover', padding: '5rem 0', color: '#fff' }}>
                <Container className="text-center">
                    <h1 className="display-4 fw-medium mb-2">Explora el mundo y disfruta de su belleza</h1>
                    <h4 className="mb-5">Encuentra y comparte tus experiencias alrededor del mundo</h4>
                    <Card className="p-4 mx-auto" style={{ maxWidth: '900px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '1rem' }}>
                        <Form onSubmit={handleSubmit}>
                            <Row className="g-3">
                                <Col xs={12} md={3}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <MdFlightTakeoff />
                                        </InputGroup.Text>
                                        <Form.Select
                                            aria-label="Origen"
                                            value={origin}
                                            onChange={handleOriginChange}
                                            required
                                        >
                                            <option disabled value="">
                                                Origen
                                            </option>
                                            {airports.map((airport) => (
                                                <option key={airport.code} value={airport.code}>
                                                    {airport.name} - {airport.code}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </InputGroup>
                                </Col>
                                <Col xs={12} md={3}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <MdFlightLand />
                                        </InputGroup.Text>
                                        <Form.Select
                                            aria-label="Destino"
                                            value={destination || ''}
                                            onChange={handleDestinationChange}
                                            required
                                        >
                                            <option value="" disabled>
                                                Destino
                                            </option>
                                            {airports.map((airport) => (
                                                <option key={airport.code} value={airport.code}>
                                                    {airport.name} - {airport.code}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </InputGroup>
                                </Col>
                                <Col xs={12} md={3}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <MdDateRange />
                                        </InputGroup.Text>
                                        <FormControl
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                </Col>
                                <Col xs={12} md={2}>
                                    <Button className="btn-secondary" onClick={() => setShowTravelerModal(true)}>
                                        {Object.values(travelers).reduce((a, b) => a + b, 0)} Pasajeros
                                    </Button>
                                </Col>
                                <Col xs={12} md={1} className="d-flex align-items-center">
                                    <Button type="submit" className="btn-search">
                                        <MdSearch />
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Container>
            </div>

            <Modal show={showTravelerModal} onHide={() => setShowTravelerModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¿Quiénes vuelan?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {['adults', 'infants'].map((type) => (
                        <div key={type} className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 className="mb-0 text-capitalize">
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </h6>
                                <small className="text-muted">
                                    {type === 'adults' && 'Desde 15 años'}
                                    {type === 'infants' && 'Menores de 2 años'}
                                </small>
                            </div>
                            <div className="d-flex align-items-center">
                                <Button variant="outline-secondary" size="sm" onClick={() => handleTravelerChange(type, 'decrement')} disabled={travelers[type] === 0}>
                                    <MdRemove />
                                </Button>
                                <span className="mx-3 fs-5">{travelers[type]}</span>
                                <Button variant="outline-secondary" size="sm" onClick={() => handleTravelerChange(type, 'increment')}>
                                    <MdAdd />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="primary" className="w-100" onClick={() => setShowTravelerModal(false)}>
                        Confirmar
                    </Button>
                </Modal.Body>
            </Modal>

            {showResults && (
                <Container className="mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="text-dark">Resultados del vuelo</h2>
                    </div>

                    {/* Nuevo diseño del Day Selector */}
                    <div className="day-selector-container mt-4 mb-5">
                        <div className="d-flex align-items-center justify-content-between">
                            <Button variant="light" onClick={handleLeftClick}>
                                <MdChevronLeft size={30} />
                            </Button>
                            <div className="d-flex overflow-auto">
                                {weekDays.map((day) => {
                                    const dayDate = new Date(day + 'T00:00:00-05:00');
                                    const dayName = dayDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
                                    const hasFlights = results.some(result => result.date === day);

                                    return (
                                        <div
                                            key={day}
                                            className={`day-item d-flex flex-column align-items-center mx-2 p-2 ${day === selectedDate ? 'day-selected' : 'day-unselected'}`}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            <span className={`day-name ${day === selectedDate ? 'fw-bold' : ''}`}>{dayName}</span>
                                            <span className={`day-price ${hasFlights ? 'text-dark' : 'text-muted'}`}>
                                                {hasFlights ? 'COP 913.800' : 'Sin vuelos'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <Button variant="light" onClick={handleRightClick}>
                                <MdChevronRight size={30} />
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {results.length > 0 ? (
                                results.map((flight, index) => (
                                    <Col key={index} xs={12}>
                                        <Card className="card-flight">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div style={{ textAlign: 'left' }}>
                                                    <h5 className="flight-info-header">
                                                        {new Date(flight.fecha_inicio).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                                                    </h5>
                                                    <span className="flight-info-sub">{flight.origin.code}</span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <h5 className="flight-info-header">
                                                        {new Date(flight.fecha_final).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                                                    </h5>
                                                    <span className="flight-info-sub">{flight.destination.code}</span>
                                                </div>
                                            </div>
                                            <div className="text-center mb-3">
                                                <div className="flight-type">
                                                    {flight.vuelos.length > 1 ? (
                                                        <span>{flight.vuelos.length - 1} Escalas</span>
                                                    ) : (
                                                        <span>Directo</span>
                                                    )}
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
                    )}

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles del vuelo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {modalContent && modalContent.map((flight) => (
                                <div key={flight.id}>
                                    <p><strong>Origen:</strong> {flight.origin} </p>
                                    <p><strong>Destino:</strong> {flight.destination} </p>
                                    <p><strong>Hora de salida:</strong> {flight.departure_time}</p>
                                    <p><strong>Hora de llegada:</strong> {flight.arrival_time}</p>
                                    <hr />
                                </div>
                            ))}
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
            )}
        </>
    );
};

export default FlightSearch;
