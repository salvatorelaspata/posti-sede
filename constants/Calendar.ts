export function formatDate(date: Date | string, format: 'full' | 'short') {
    if (typeof date === 'string') {
        date = new Date(date);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
    }

    if (format === 'full') {
        return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } else if (format === 'short') {
        return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    }
}

export const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
}

export const getTotalWorkingDaysInMonth = (month: number, year: number) => {
    const totalDays = getDaysInMonth(month, year);
    const workingDays = [];
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            workingDays.push(date);
        }
    }
    return workingDays.length;
}

export const getYearStringFromDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { year: 'numeric' });
}

export const getMonthStringFromDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { month: 'long' });
}

export const getDayStringFromDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { weekday: 'short' });
}

export const getDayNumberFromDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { day: 'numeric' });
}