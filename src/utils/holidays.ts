/**
 * Holidays - Centralized holiday management with custom holiday support
 */

export { 
    getPortugueseHolidays, 
    isHoliday, 
    getHolidayName, 
    countHolidaysOff, 
    getHolidaysOffList, 
    getHolidaysWorked,
    getCustomHolidays,
    addCustomHoliday,
    removeCustomHoliday,
    getAllHolidays
} from './portugueseHolidays';

export type { Holiday, CustomHoliday } from './portugueseHolidays';
