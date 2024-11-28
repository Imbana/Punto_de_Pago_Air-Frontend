
import './App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom";

import FlightSearch from './page/flightSearch/FlightSearch';
import FlightList from './page/flightList/FlightList';
import UserReservationForm from './page/userReservationForm.py/UserReservationForm';
import UserConsultationForm from './page/userConsultationForm/UserConsultationform';
import PaymentConfirmation from './page/paymentConfirmation/paymentConfirmation';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<FlightSearch />} />
        <Route path="/flightList" element={<FlightList />} />
        <Route path="/userReservation" element={<UserReservationForm />} />
        <Route path="/userConsultation" element={<UserConsultationForm/>} />
        <Route path="/paymentConfirmation" element={<PaymentConfirmation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
