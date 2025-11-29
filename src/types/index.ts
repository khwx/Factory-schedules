export type ShiftType = 'M' | 'T' | 'N' | 'F';

export interface Scenario {
  id: string;
  name: string;
  teams: number;
  shiftDuration: number; // in hours
  weeklyHoursContract?: number; // Contractual weekly hours (e.g. 40)
  pattern: string; // e.g., "MMTTNNFFFF" - default pattern for team 1
  hidden?: boolean; // Whether scenario is hidden from main view
  teamPatterns?: string[]; // Optional: individual patterns for each team (overrides pattern)
}

export interface MonthlyBreakdown {
  month: number; // 1-12
  monthName: string;
  weekendsOff: number;
  saturdaysOff: number;
  sundaysOff: number;
  totalOffDays: number;
}

export interface YearlyAnalysis {
  year: number;
  totalWeekends: number;
  totalSaturdaysOff: number;
  totalSundaysOff: number;
  totalOffDays: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface AdvancedMetrics {
  // Consecutive patterns
  maxConsecutiveOffDays: number;
  maxConsecutiveWorkDays: number;
  maxConsecutiveNightShifts: number;

  // Off-day sequences
  miniVacations: number; // 3+ consecutive off days
  isolatedOffDays: number; // single off days

  // Night shift analysis
  totalNightShifts: number;
  nightShiftsPerMonth: number;

  // Work-life balance
  fridayNightsOff: number; // Friday evening free
  saturdayNightsOff: number; // Saturday evening free
  sundayMorningsOff: number; // Sunday morning free

  // Holidays
  holidaysOff: number;
  holidaysWorked: number;
  holidaysList?: string[]; // Names of holidays off
}

export interface AnalysisResult {
  avgWeeklyHours: number;
  weeklyHoursDifference?: number; // Difference from contract
  totalAnnualHours: number;
  weekendsOffPerYear: number;
  weekendsOffPerMonthAvg: number;
  totalOffDaysPerYear: number;
  qualitative: string[];
  multiYearAnalysis: YearlyAnalysis[]; // 5 years
  advancedMetrics?: AdvancedMetrics; // New advanced metrics
}

export interface DayInfo {
  date: Date;
  shift: ShiftType;
  isWeekend: boolean;
  isWeekendOff: boolean;
}
