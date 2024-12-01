
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
const Header = () => {


    return (
        <header className="header mb-4 d-flex justify-content-between align-items-center">
            <Link to="/">
                <img
                    src={logo}
                    width="150"
                    height="60"
                    alt="Logo Portal de Pago Air"
                    className="logo-left"
                />
            </Link>

            <Link
                to="/userConsultation"
            >
                <Button
                    variant="outline-primary"
                    className="me-4"
                >
                    Consultar Reserva
                </Button>
            </Link>
        </header>
    )
}

export default Header