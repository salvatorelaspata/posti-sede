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

    if (targetYear < currentYear) {
        return 0
    } else if (targetYear === currentYear) {
        if (targetMonth < currentMonth) return 0
        else if (targetMonth === currentMonth) return 1
        else return 2
    } else {
        return 2
    }
}

// Funzione utilitaria per comparare date senza tempo
export const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

export type DayItem = {
    id: string;
    date: Date;
    dayName: string;
    dayNumber: string;
    month: string;
    isToday: boolean;
};

// Funzione per ricreare la lista dei giorni in base ad una data centrale
export const generateDays = (center: Date) => {
    const daysArray: DayItem[] = [];
    for (let i = -15; i <= 15; i++) {
        const date = new Date(center);
        date.setDate(center.getDate() + i);
        daysArray.push({
            id: i.toString(),
            date,
            dayName: date.toLocaleDateString('it-IT', { weekday: 'short' }),
            dayNumber: date.getDate().toString(),
            month: date.toLocaleDateString('it-IT', { month: 'short' }),
            isToday: isSameDate(date, new Date()),
        });
    }
    return daysArray;
};

// deprecated
export type Day = {
    id: number;
    d: Date;
    day: number;
    dayOfWeekIndex: number;
    dayOfWeek: string;
}

const _factoryDay = (date: Date): Day => {
    const id = parseInt(date.toISOString().split('T')[0].replace(/-/g, ''));
    return {
        id, day: date.getDate(), d: date, dayOfWeekIndex: date.getDay(), dayOfWeek: date.toLocaleDateString('it-IT', { weekday: 'short' })
    }
}

export const daysInCalendar: (date: Date) => Day[] = (date) => {
    const days = [];
    const current = new Date(date.toISOString().split('T')[0]);
    current.setHours(6, 0, 0, 0);
    let _month = current.getMonth();
    for (let i = 15; i > 0; i--) {
        const _d = new Date(current.toISOString().split('T')[0]);
        if (_d.getDate() < 1) { _month--; }
        _d.setMonth(_month);
        _d.setDate(_d.getDate() - i);
        days.push(_factoryDay(_d))
    }
    for (let i = 1; i <= 15; i++) {
        const lastDay = new Date(current.getFullYear(), _month + 1, 0).getDate();
        const _d = new Date(current.toISOString().split('T')[0]);
        if (_d.getDate() > lastDay) { _month++; }
        _d.setMonth(_month);
        _d.setDate(_d.getDate() + i);
        days.push(_factoryDay(_d))
    }
    return days;
}

export const isDayDisabled = (date: Date) => {
    const workDay = date.getDay();
    if (workDay === 0 || workDay === 6) return true;
    const today = new Date();
    today.setHours(6, 0, 0, 0);
    const dateToCompare = new Date(date.toISOString().split('T')[0]);
    dateToCompare.setHours(6, 0, 0, 0);
    return today > dateToCompare;
};
