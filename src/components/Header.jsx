
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
const Header = () => {


    return (
        <header className="header m-4 d-flex justify-content-between align-items-center px-4">
            <Link to="/">
                <img src={logo} width="100" alt="Logo" className="logo-left" />
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