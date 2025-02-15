import { useEffect, useState } from "react";

export function useCalendar() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDate());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const daysInCalendar = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        dayOfWeekIndex: new Date(currentYear, currentMonth, i + 1).getDay(),
        dayOfWeek: new Date(currentYear, currentMonth, i + 1).toLocaleDateString('it-IT', { weekday: 'short' })
    }));

    useEffect(() => {
        const currentDate = new Date();
        setCurrentDate(currentDate);
        setCurrentMonth(currentDate.getMonth());
        setCurrentYear(currentDate.getFullYear());
        setCurrentDay(currentDate.getDate());
    }, []);

    return {
        currentDate,
        currentMonth,
        currentYear,
        currentDay,
        daysInMonth,
        daysInCalendar,
    }
}

export const isPast = (date: Date): boolean => {
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return today > date
};

