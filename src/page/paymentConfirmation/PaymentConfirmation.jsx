import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import imgFlight from '../../assets/avion.png'
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Container, Col, Card, Button, Row } from "react-bootstrap";
import { useStoreFlight } from '../../store/store';

const PaymentConfirmation = () => {

    const { information } = useStoreFlight()

    // Estados
    const [paymentStatus, setPaymentStatus] = useState('Pendiente'); // Estado del pago
    const [paymentAmount] = useState(450000); // Valor a pagar
    const [codeReservation] = useState(1)

    const statusPaymentClass = paymentStatus === 'Pendiente' ? 'badge bg-warning-subtle border-warning-subtle text-warning-emphasis rounded-pill' : ' bg-success-subtle border-success-subtle text-success-emphasis rounded-pill';

    // Formatear el monto en COP usando Intl.NumberFormat
    const formattedAmount = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,  // Opcional: para mostrar sin decimales
        maximumFractionDigits: 2,  // Opcional: limitar a dos decimales
    }).format(paymentAmount);

    useEffect(() => {
        const fetchcodePayment = async () => {
            try {
                const response = await axios.get(`https://cantozil.pythonanywhere.com/api/bookings/payments/${codeReservation}`);
                console.log(response)

            } catch (err) {
                console.error('Error fetching get code payment:', err);
            }
        };
        fetchcodePayment();
    });
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
            </header>
            <Container className="mt-5">

                <Row className="row-cols-1 row-cols-md-3 g-4">
                    <Col md={6}>

                        <Card className={`shadow-sm  'border-primary'`}>
                            <Card.Body>
                                <Card.Title className="text-center">
                                    <span className={statusPaymentClass}>Pago {paymentStatus}</span>
                                </Card.Title>
                                <Card.Subtitle className="text-center mb-3">
                                    Monto a Pagar  <strong>{formattedAmount}</strong> COP
                                </Card.Subtitle>
                                <Card.Body>
                                    <h5>Detalles del Vuelo</h5>
                                    <p><strong>Aerolínea:</strong>PDP</p>
                                    <p><strong>Origen:</strong> BOG</p>
                                    <p><strong>Destino:</strong> CAL</p>
                                    <p><strong>Hora Salida:</strong> 12:23</p>
                                    <p><strong>Fecha Llegada:</strong> 15:00</p>
                                    <p><strong>Código de Reserva:</strong>1</p>
                                    <hr />
                                    {
                                        paymentStatus === "Completado" ? (
                                            <span>Gracias por confiar en nuestros, su pago se realizó con éxito.</span>
                                        ) : (
                                            <span>Para finalizar correctamente su reserva por favor realizar el pago con el siguiente código <strong>8cecd6c86b4c4d1e969f3ab7e0d807ed</strong> junto con el código de reserva</span>
                                        )
                                    }

                                    <div style={{ paddingTop: "10px" }}>
                                        <Button
                                            className="btn"
                                            disabled={paymentStatus === "Completado" ? true : false}
                                        >
                                            <i className="bi bi-arrow-clockwise"></i> {paymentStatus === "Completado" ? "Pago Confirmado" : "Refrescar"}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Columna para la imagen */}
                    <Col md={6} className="d-flex justify-content-center">
                        <img
                            src={imgFlight}
                            alt="Reserva logo"
                            className="img-fluid rounded"
                            style={{ maxWidth: "80%", height: "auto", maxHeight: "250px" }} // Ajustar tamaño de la imagen
                        />
                    </Col>
                </Row>


            </Container >

        </>

    )

}

export default PaymentConfirmation