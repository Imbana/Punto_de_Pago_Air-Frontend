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
    console.log(weekDays)
    return weekDays;
};
