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

    const  infoPassengers = {
        "first_name": inforUser.firstName,
        "last_name": inforUser.lastName,
        "email": inforUser.email,
        "date_of_birth": inforUser.birthDate,
        "is_infant": false
    }

    const flights = infoFlight.map((flight) => (flight.id));


    let dataResult = {
        "seat_class": "economy_class",
        "flight_id":  String(flights[0]),
        "passengers": [
            infoPassengers
        ],
        "luggage_hand": true,
        "luggage_hold": true,
        "extra_luggage": 0,
        "extra_meal": 0
    }
    return dataResult

}


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