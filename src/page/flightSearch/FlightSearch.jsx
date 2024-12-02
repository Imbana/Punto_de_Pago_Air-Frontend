import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { es } from 'date-fns/locale';
import { Form, Button, InputGroup, FormControl, Container, Modal, Card, Row, Col } from 'react-bootstrap';
import { MdFlightTakeoff, MdFlightLand, MdDateRange, MdSearch, MdRemove, MdAdd } from 'react-icons/md';
import './flightSearch.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStoreFlight } from '../../store/store'
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

const FlightSearch = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState(null); // Date state
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, babies: 0 }); // Pasajeros
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const [showCalendar, setShowCalendar] = useState(false); // Estado para mostrar el calendario
    const { start_flight } = useStoreFlight();
    const inputRef = useRef();

    // Fetch airports on mount
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                start_flight();
                const response = await axios.get('https://cantozil.pythonanywhere.com/api/airports/');
                setAirports(response.data);
            } catch (err) {
                console.error('Error fetching airports:', err);
            }
        };
        fetchAirports();
    }, [start_flight]);

    // Handle passengers modal
    const handlePassengersChange = (type, operation) => {
        setPassengers((prev) => {
            let value = operation === 'increase' ? prev[type] + 1 : prev[type] - 1;

            // Validación de cantidad máxima de pasajeros según tipo
            if (type === 'adults' && (value < 1 || value > 9)) return prev; // Mínimo 1 adulto, máximo 9
            if (type === 'children' && (value < 0 || value > prev.adults)) return prev; // Máximo 1 niño por adulto
            if (type === 'babies' && (value < 0 || value > prev.adults)) return prev; // Máximo 1 bebé por adulto

            // Validación de un adulto por cada niño o bebé
            const totalChildrenAndBabies = prev.children + prev.babies;
            if (type === 'adults' && value < totalChildrenAndBabies) {
                return prev;
            }

            return { ...prev, [type]: value };
        });
    };



    // Handle input click to toggle calendar
    const handleInputClick = () => {
        setShowCalendar(!showCalendar);
    };

    // Close calendar if clicked outside
    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowCalendar(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams({
            origin: origin,
            destination: destination,
            date: date ? format(date, 'yyyy-MM-dd') : '',
            adults: passengers.adults,
            children: passengers.children,
            babies: passengers.babies
        });
        navigate(`/flightList?${searchParams.toString()}`);
    };

    return (
        <>
            <header className="header m-4 d-flex justify-content-between align-items-center px-4">
                <Link to="/">
                    <img src={logo} width="100" alt="Logo" className="logo-left" />
                </Link>
            </header>

            <div className="hero-section d-flex align-items-end" style={{ backgroundSize: 'cover', padding: '5rem 0', color: '#fff', minHeight: '70vh', position: 'relative' }}>
                <Container className="text-center" style={{ marginBottom: '3rem' }}>
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
                                            onChange={(e) => setOrigin(e.target.value)}
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
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
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
                                    <div ref={inputRef} className="position-relative">
                                        <InputGroup onClick={handleInputClick}>
                                            <InputGroup.Text>
                                                <MdDateRange />
                                            </InputGroup.Text>
                                            <FormControl
                                                type="text"
                                                value={date ? format(date, 'dd/MM/yyyy') : ''}
                                                placeholder="Selecciona fecha"
                                                readOnly
                                                required
                                            />
                                        </InputGroup>

                                        {showCalendar && (
                                            <div className="day-picker-popup position-absolute">
                                                <DayPicker
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(selectedDate) => {
                                                        setDate(selectedDate);
                                                        setShowCalendar(false);
                                                    }}
                                                    fromDate={new Date()} // Permitir seleccionar desde la fecha actual
                                                    disabled={[
                                                        { before: new Date() } // Deshabilitar todas las fechas antes de hoy
                                                    ]}
                                                    styles={{
                                                        today: { backgroundColor: '#349dd4', color: '#ffffff' },
                                                        selected: { backgroundColor: '#0e3b5e', color: '#ffffff' },
                                                        disabled: { opacity: 0.3 } // Opcional: para estilizar las fechas deshabilitadas
                                                    }}
                                                    locale={es}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Col>



                                <Col xs={12} md={2}>
                                    <Button className="btn-passenger w-100" onClick={() => setShowModal(true)}>
                                        {passengers.adults + passengers.children + passengers.babies} Pasajeros
                                    </Button>
                                </Col>
                                <Col xs={12} md={1} className="d-flex align-items-center">
                                    <Button type="submit" className="btn-search w-100">
                                        <MdSearch />
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Container>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¿Quiénes vuelan?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {["adults", "children", "babies"].map((type) => (
                        <div key={type} className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 className="mb-0 text-capitalize">
                                    {type === "adults" ? "Adultos" : type === "children" ? "Niños" : "Bebés"}
                                </h6>
                                <small className="text-muted">
                                    {type === 'adults' && 'Desde 15 años'}
                                    {type === 'children' && 'Menores de 12 años'}
                                    {type === 'babies' && 'Menores de 2 años'}
                                </small>
                            </div>
                            <div className="d-flex align-items-center">
                                <Button variant="outline-secondary" size="sm" onClick={() => handlePassengersChange(type, 'decrease')} disabled={passengers[type] === 0}>
                                    <MdRemove />
                                </Button>
                                <span className="mx-3 fs-5">{passengers[type]}</span>
                                <Button variant="outline-secondary" size="sm" onClick={() => handlePassengersChange(type, 'increase')}>
                                    <MdAdd />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="" className="w-100 bg-cyan text-white fw-medium" onClick={() => setShowModal(false)}>
                        Confirmar
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FlightSearch;
