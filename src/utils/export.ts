import * as XLSX from 'xlsx';
import { Scenario, AnalysisResult } from '../types';
import { generateYearCalendar } from './calendar';

/**
 * Export scenario data to Excel
 */
export const exportToExcel = (scenario: Scenario, analysis: AnalysisResult) => {
    const workbook = XLSX.utils.book_new();
    const currentYear = new Date().getFullYear();

    // Sheet 1: Summary
    const summaryData = [
        ['ShiftSim Factory - Scenario Analysis'],
        [''],
        ['Scenario Name', scenario.name],
        ['Number of Teams', scenario.teams],
        ['Shift Duration (hours)', scenario.shiftDuration],
        ['Rotation Pattern', scenario.pattern],
        [''],
        ['METRICS'],
        ['Average Weekly Hours', analysis.avgWeeklyHours.toFixed(2)],
        ['Total Annual Hours', Math.round(analysis.totalAnnualHours)],
        ['Weekends Off (per year)', analysis.weekendsOffPerYear],
        ['Total Off Days (per year)', analysis.totalOffDaysPerYear],
        [''],
        ['QUALITATIVE ANALYSIS'],
        ...analysis.qualitative.map(q => [q]),
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Sheet 2-6: Calendar for each year (5 years)
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;
        const calendar = generateYearCalendar(scenario, year);

        const calendarData = [
            ['Date', 'Day of Week', 'Shift', 'Is Weekend', 'Is Weekend Off'],
            ...calendar.map(day => [
                day.date.toLocaleDateString(),
                day.date.toLocaleDateString('en-US', { weekday: 'long' }),
                day.shift,
                day.isWeekend ? 'Yes' : 'No',
                day.isWeekendOff ? 'Yes' : 'No',
            ]),
        ];

        const calendarSheet = XLSX.utils.aoa_to_sheet(calendarData);
        XLSX.utils.book_append_sheet(workbook, calendarSheet, `Calendar_${year}`);
    }

    // Sheet 7: Multi-Year Weekend Analysis
    const weekendAnalysisData = [
        ['5-Year Weekend Analysis'],
        [''],
        ['Year', 'Total Weekends Off', 'Total Off Days', ...analysis.multiYearAnalysis[0]?.monthlyBreakdown.map(m => m.monthName) || []],
    ];

    analysis.multiYearAnalysis.forEach(yearData => {
        weekendAnalysisData.push([
            yearData.year.toString(),
            yearData.totalWeekends.toString(),
            yearData.totalOffDays.toString(),
            ...yearData.monthlyBreakdown.map(m => `${m.weekendsOff} (${m.totalOffDays})`),
        ]);
    });

    const weekendSheet = XLSX.utils.aoa_to_sheet(weekendAnalysisData);
    XLSX.utils.book_append_sheet(workbook, weekendSheet, 'Weekend_Analysis');

    // Generate and download
    const fileName = `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_Analysis.xlsx`;
    XLSX.writeFile(workbook, fileName);
};

/**
 * Export comparison of multiple scenarios
 */
export const exportComparison = (scenarios: Scenario[], analyses: AnalysisResult[]) => {
    const workbook = XLSX.utils.book_new();

    // Comparison Sheet
    const comparisonData = [
        ['Scenario Comparison'],
        [''],
        ['Metric', ...scenarios.map(s => s.name)],
        ['Teams', ...scenarios.map(s => s.teams)],
        ['Shift Duration (h)', ...scenarios.map(s => s.shiftDuration)],
        ['Pattern', ...scenarios.map(s => s.pattern)],
        [''],
        ['METRICS'],
        ['Avg Weekly Hours', ...analyses.map(a => a.avgWeeklyHours.toFixed(2))],
        ['Total Annual Hours', ...analyses.map(a => Math.round(a.totalAnnualHours))],
        ['Weekends Off/Year', ...analyses.map(a => a.weekendsOffPerYear)],
        ['Total Off Days/Year', ...analyses.map(a => a.totalOffDaysPerYear)],
    ];

    const comparisonSheet = XLSX.utils.aoa_to_sheet(comparisonData);
    XLSX.utils.book_append_sheet(workbook, comparisonSheet, 'Comparison');

    // Multi-year comparison for each scenario
    scenarios.forEach((scenario, idx) => {
        const analysis = analyses[idx];
        const yearData = [
            [`${scenario.name} - 5 Year Analysis`],
            [''],
            ['Year', 'Total Weekends', 'Total Off Days', ...analysis.multiYearAnalysis[0]?.monthlyBreakdown.map(m => m.monthName) || []],
        ];

        analysis.multiYearAnalysis.forEach(year => {
            yearData.push([
                year.year.toString(),
                year.totalWeekends.toString(),
                year.totalOffDays.toString(),
                ...year.monthlyBreakdown.map(m => `${m.weekendsOff} (${m.totalOffDays})`),
            ]);
        });

        const sheet = XLSX.utils.aoa_to_sheet(yearData);
        XLSX.utils.book_append_sheet(workbook, sheet, `${scenario.name.substring(0, 25)}_5Y`);
    });

    // Generate and download
    XLSX.writeFile(workbook, 'Scenario_Comparison.xlsx');
};
