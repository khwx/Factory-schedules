import { Scenario } from '../types';
import { generateYearCalendar } from './calendar';
import { getPortugueseHolidays } from './holidays';

export interface PayConfig {
    hourlyRate: number;
    nightPremium: number;
    holidayPremium: number;
    weekendPremium: number;
}

export const DEFAULT_PAY_CONFIG: PayConfig = {
    hourlyRate: 8.50,
    nightPremium: 0.25,
    holidayPremium: 1.0,
    weekendPremium: 0.0,
};

export interface PayEstimate {
    regularHours: number;
    regularPay: number;
    nightHours: number;
    nightPay: number;
    holidayHours: number;
    holidayPay: number;
    weekendHours: number;
    weekendPay: number;
    totalHours: number;
    totalPay: number;
    monthlyAvg: number;
}

export function calculateEstimatedPay(
    scenario: Scenario,
    teamIndex: number = 0,
    config: PayConfig = DEFAULT_PAY_CONFIG,
): PayEstimate {
    const year = new Date().getFullYear();
    const calendar = generateYearCalendar(scenario, year, teamIndex);
    const holidays = getPortugueseHolidays(year);
    const holidayDateSet = new Set(
        holidays.map(h => {
            const d = new Date(h.date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    const shiftDuration = scenario.shiftDuration;

    let regularHours = 0;
    let nightHours = 0;
    let holidayHours = 0;
    let weekendHours = 0;

    for (const day of calendar) {
        if (day.shift === 'F') continue;

        const dateKey = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
        const isHoliday = holidayDateSet.has(dateKey);
        const isWeekend = day.isWeekend;
        const isNight = day.shift === 'N';
        const isMorning = day.shift === 'M';
        const isAfternoon = day.shift === 'T';

        if (isHoliday) {
            holidayHours += shiftDuration;
        } else if (isWeekend && !isNight) {
            weekendHours += shiftDuration;
        } else if (isNight) {
            nightHours += shiftDuration;
        } else if (isMorning || isAfternoon) {
            regularHours += shiftDuration;
        }
    }

    const regularPay = regularHours * config.hourlyRate;
    const nightPay = nightHours * config.hourlyRate * (1 + config.nightPremium);
    const holidayPay = holidayHours * config.hourlyRate * (1 + config.holidayPremium);
    const weekendPay = weekendHours * config.hourlyRate * (1 + config.weekendPremium);

    const totalHours = regularHours + nightHours + holidayHours + weekendHours;
    const totalPay = regularPay + nightPay + holidayPay + weekendPay;
    const monthlyAvg = totalPay / 12;

    return {
        regularHours,
        regularPay,
        nightHours,
        nightPay,
        holidayHours,
        holidayPay,
        weekendHours,
        weekendPay,
        totalHours,
        totalPay,
        monthlyAvg,
    };
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}