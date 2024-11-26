import { useEffect, useState } from "react";
import axios from "axios";
import logo from '../../assets/logo.png';
import { Form, Button, InputGroup, FormControl, Container, } from 'react-bootstrap';
import { MdFlightTakeoff, MdFlightLand, MdDateRange } from 'react-icons/md';
import './flightSearch.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useStoreFlight} from  '../../store/store'


const FlightSearch = () => {
    const [airports, setAirports] = useState([])
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const { info_flight, start_flight } = useStoreFlight()
    const handleOriginChange = (e) => {
        const selectedOrigin = e.target.value;
        // If the selected origin is the same as current destination, reset destination
        if (selectedOrigin === destination) {
            setDestination('');
        } 
        setOrigin(selectedOrigin);
    };

    const handleDestinationChange = (e) => {
        const selectedDestination = e.target.value;
        
        // If the selected destination is the same as current origin, reset origin
        if (selectedDestination === origin) {
            setOrigin('');
        }
        
        setDestination(selectedDestination);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const searchParams = new URLSearchParams({
            origin: origin,
            destination: destination,
            date: date
        });

        console.log({ origin, destination, date });
        info_flight({ origin, destination, date })
        window.open(`/flightList?${searchParams.toString()}`);
    };

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                start_flight()
                const response = await axios.get('https://jsonplaceholder.typicode.com/users?_limit=5');

                const data = [{"code": "sdfsd", "name": "Hola cimo est"}, {"code": "sdfsd43", "name": "Hola cimo est434"}]
                setAirports(data);


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

                                    <Form.Select aria-label="Default select example"
                                        placeholder="Origen"
                                        value={origin}
                                        onChange={handleOriginChange}
                                        required
                                        
                                    >
                                        <option disabled value="" >Selecciona Origen</option>
                                        {airports.map((airport) => (
                                                <option
                                                    key={airport.code}>
                                                    {airport.name} - {airport.code}
                                                </option>
                                            ))}
                                    </Form.Select>
         
                                </InputGroup>

                                <InputGroup className="mb-3" style={{ maxWidth: '260px' }}>
                                    <InputGroup.Text>
                                        <MdFlightLand />
                                    </InputGroup.Text>
        

                                    <Form.Select aria-label="Default select example"
                                            placeholder="Destino"
                                            value={destination}
                                            onChange={handleDestinationChange}            
                                            required

                                        >
                                        <option value=""  disabled>Selecciona Destino</option>
                                        {airports.map((airport) => (
                                                <option
                                                    key={airport.code}>
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


        </>

    )
}

export default FlightSearch