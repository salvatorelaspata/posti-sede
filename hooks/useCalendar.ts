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

    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth - 1);
        setCurrentYear(currentYear);
    }

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth + 1);
        setCurrentYear(currentYear);
    }

    useEffect(() => {
        const currentDate = new Date();
        currentDate.setHours(6, 0, 0, 0);
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
        goToPreviousMonth,
        goToNextMonth
    }
}

export const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(6, 0, 0, 0);
    const dateToCompare = new Date(date.toISOString().split('T')[0]);
    dateToCompare.setHours(6, 0, 0, 0);
    return today > dateToCompare;
};

export const isPastWithToday = (date: Date): boolean => {
    const today = new Date();
    today.setHours(6, 0, 0, 0);
    const dateToCompare = new Date(date.toISOString().split('T')[0]);
    dateToCompare.setHours(6, 0, 0, 0);
    return today >= dateToCompare;
};

export function getMonthStatus(targetDate: Date) {
    const current = new Date();

    // Calcola l'anno/mese corrente e target (mesi 0-based)
    const currentYear = current.getFullYear();
    const currentMonth = current.getMonth();

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    // Calcola la differenza in mesi considerando gli anni
    if (targetYear < currentYear) {
        return 0
    } else if (targetYear === currentYear) {
        if (targetMonth < currentMonth) {
            return 0
        } else if (targetMonth === currentMonth) {
            return 1
        } else {
            return 2
        }
    } else {
        return 2
    }
}
