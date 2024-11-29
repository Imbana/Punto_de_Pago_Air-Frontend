export const getWeekDays = (baseDate) => {

    const date = new Date(baseDate + 'T00:00:00-05:00');

    const days = date.getDay(); 
    
    const monday = new Date(date);
    monday.setDate(date.getDate() - (days === 0 ? 6 : days - 1));

    const weekDays = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        
        weekDays.push(day.toISOString().split('T')[0]);
    }

    return weekDays;
};



export const dataReservation = (infoFlight, inforUser) => {
    // Asegúrate de acceder a infoFlight.flight si es necesario
    const flightData = Array.isArray(infoFlight.flight) ? infoFlight.flight[0] : infoFlight[0];

    if (!flightData?.id) {
        throw new Error("El vuelo no está definido o es inválido.");
    }

    const passengers = inforUser.passengers.map((passenger) => ({
        first_name: passenger.firstName,
        last_name: passenger.lastName,
        email: passenger.email,
        date_of_birth: passenger.birthDate,
        is_infant: passenger.birthDate && new Date().getFullYear() - new Date(passenger.birthDate).getFullYear() < 2,
    }));

    return {
        seat_class: "economy_class",
        flight_id: String(flightData.id),
        passengers,
        luggage_hand: true,
        luggage_hold: true,
        extra_luggage: 0,
        extra_meal: 0,
    };
};




export const  processFlightData = (flights) => {
    const processedFlights = [];

    if (flights.direct_flights) {
        flights.direct_flights.forEach(flight => {
            processedFlights.push({
                origin: flight.origin.code,
                destination: flight.destination.code,
                departure_date: flight.departure_time, // Tomamos la hora de salida del vuelo directo
                arrival_date: flight.arrival_time, // Tomamos la hora de llegada del vuelo directo
                vuelos: [flight] // Solo un vuelo en la lista
            });
        });
    }

    if (flights.routes_with_stops) {
        flights.routes_with_stops.forEach(route => {
            const flightsInRoute = route.flights;

            // Tomamos el primer vuelo para la fecha de salida y origen
            const firstFlight = flightsInRoute[0];
            // Tomamos el último vuelo para la fecha de llegada y destino
            const lastFlight = flightsInRoute[flightsInRoute.length - 1];

            processedFlights.push({
                origin: firstFlight.origin.code,
                destination: lastFlight.destination.code,
                departure_date: firstFlight.departure_time,
                arrival_date: lastFlight.arrival_time,
                vuelos: flightsInRoute // Todos los vuelos de la ruta con escalas
            });
        });
    }

    return processedFlights;
}