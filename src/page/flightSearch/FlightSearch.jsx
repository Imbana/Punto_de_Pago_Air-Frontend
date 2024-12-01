import { useEffect, useState } from "react";
import axios from "axios";
import logo from '../../assets/logo.png';
import { Form, Button, InputGroup, FormControl, Container, Modal } from 'react-bootstrap';
import { MdFlightTakeoff, MdFlightLand, MdDateRange, MdGroup } from 'react-icons/md';
import './flightSearch.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStoreFlight } from '../../store/store'
import CardSearch from "../../components/CardSearch"
import caliImg from "../../assets/cali.jpg"
import medellinImg from "../../assets/medellin.jpg"

const cards = [{
    "city": "Cali",
    "description": "Sumérgete en la cultura y la energía de Cali con precios especiales para tu viaje.",
    "discount": "7",
    "pathImg": caliImg
},
{
    "city": "Medellin",
    "description": "Explora la ciudad de la eterna primavera con increíbles ofertas y paquetes especiales.",
    "discount": "10",
    "pathImg": medellinImg
},
]

const FlightSearch = () => {
    const [airports, setAirports] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, babies: 0 }); // Pasajeros
    const [showModal, setShowModal] = useState(false); // Estado para el modal
    const { start_flight } = useStoreFlight();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams({
            origin: origin,
            destination: destination,
            date: date,
            adults: passengers.adults,
            children: passengers.children,
            babies: passengers.babies
        });
        window.open(`/flightList?${searchParams.toString()}`);
    };

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
            <div className="hero-section">
                <Container>
                    <div className="hero-content">
                        <h1 className="mb-4">Explora el mundo y disfruta de su belleza</h1>
                        <p className="mb-5">Encuentra y comparte tus experiencias alrededor del mundo.</p>
                    </div>
                    <div className="search-card">
                        <Form onSubmit={handleSubmit} className="w-100">
                            <div className="d-flex flex-wrap gap-3 justify-content-center">
                                <InputGroup className="mb-3" style={{ maxWidth: '260px' }}>
                                    <InputGroup.Text>
                                        <MdFlightTakeoff />
                                    </InputGroup.Text>
                                    <Form.Select
                                        placeholder="Origen"
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        required
                                    >
                                        <option disabled value="">Selecciona Origen</option>
                                        {airports.map((airport) => (
                                            <option key={airport.code} value={airport.code}>
                                                {airport.name} - {airport.code}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </InputGroup>

                                <InputGroup className="mb-3" style={{ maxWidth: '260px' }}>
                                    <InputGroup.Text>
                                        <MdFlightLand />
                                    </InputGroup.Text>
                                    <Form.Select
                                        placeholder="Destino"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        required
                                    >
                                        <option disabled value="">Selecciona Destino</option>
                                        {airports.map((airport) => (
                                            <option key={airport.code} value={airport.code}>
                                                {airport.name} - {airport.code}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </InputGroup>

                                <InputGroup className="mb-3" style={{ maxWidth: '200px' }}>
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

                                <Button variant="secondary" onClick={() => setShowModal(true)} className="mb-3">
                                    <MdGroup /> {passengers.adults + passengers.children + passengers.babies} pasajeros
                                </Button>

                                <Button
                                    type="submit"
                                    className="mb-3 btn-search"
                                >
                                    Buscar
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Container>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Quiénes vuelan?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {["adults", "children", "babies"].map((type, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                            <span>
                                {type === "adults" ? "Adultos" : type === "children" ? "Niños" : "Bebés"}
                            </span>
                            <div className="d-flex align-items-center gap-2">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => handlePassengersChange(type, "decrease")}
                                >
                                    -
                                </Button>
                                <span>{passengers[type]}</span>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => handlePassengersChange(type, "increase")}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="containerCards">
                {cards.map((item) => (
                    <CardSearch key={item.city} data={item} />
                ))}
            </div>
        </>
    );
};

export default FlightSearch;
