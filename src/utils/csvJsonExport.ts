import { Scenario, AnalysisResult } from '../types';
import { generateYearCalendar } from './calendar';

export const exportScenarioToCSV = (scenario: Scenario, analysis: AnalysisResult) => {
    const rows: string[][] = [];

    rows.push(['Metrica', 'Valor']);
    rows.push(['Nome do Cenario', scenario.name]);
    rows.push(['Numero de Equipas', scenario.teams.toString()]);
    rows.push(['Duracao do Turno (h)', scenario.shiftDuration.toString()]);
    rows.push(['Padrao de Rotacao', scenario.pattern]);
    rows.push(['']);

    rows.push(['MEDIA HORAS SEMANAIS', analysis.avgWeeklyHours.toFixed(2)]);
    rows.push(['HORAS ANUAIS TOTAIS', Math.round(analysis.totalAnnualHours).toString()]);
    rows.push(['FDS FOLGA ANO', analysis.weekendsOffPerYear.toString()]);
    rows.push(['DIAS FOLGA ANO', analysis.totalOffDaysPerYear.toString()]);
    rows.push(['MEDIA FDS MES', analysis.weekendsOffPerMonthAvg.toFixed(1)]);
    rows.push(['']);

    if (analysis.advancedMetrics) {
        rows.push(['METRICAS AVANCADAS', '']);
        rows.push(['Max Dias Consecutivos Trabalho', analysis.advancedMetrics.maxConsecutiveWorkDays.toString()]);
        rows.push(['Max Dias Consecutivos Folga', analysis.advancedMetrics.maxConsecutiveOffDays.toString()]);
        rows.push(['Mini-Ferias (3+ dias folga)', analysis.advancedMetrics.miniVacations.toString()]);
        rows.push(['Turnos Nocturnos/Ano', analysis.advancedMetrics.totalNightShifts.toString()]);
        rows.push(['Feriados Trabalhados', analysis.advancedMetrics.holidaysWorked.toString()]);
        rows.push(['Feriados de Folga', analysis.advancedMetrics.holidaysOff.toString()]);
    }

    rows.push(['']);
    rows.push(['ANALISE QUALITATIVA', '']);
    analysis.qualitative.forEach(q => rows.push(['', q]));

    const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_Analise.csv`);
};

export const exportScenarioToJSON = (scenario: Scenario, analysis: AnalysisResult) => {
    const currentYear = new Date().getFullYear();
    const calendar = generateYearCalendar(scenario, currentYear);

    const data = {
        meta: {
            generatedBy: 'ShiftSim Factory',
            generatedAt: new Date().toISOString(),
            version: '1.0',
        },
        scenario: {
            name: scenario.name,
            teams: scenario.teams,
            shiftDuration: scenario.shiftDuration,
            pattern: scenario.pattern,
            weeklyHoursContract: scenario.weeklyHoursContract,
            teamPatterns: scenario.teamPatterns,
        },
        analysis: {
            avgWeeklyHours: analysis.avgWeeklyHours,
            totalAnnualHours: Math.round(analysis.totalAnnualHours),
            weekendsOffPerYear: analysis.weekendsOffPerYear,
            weekendsOffPerMonthAvg: analysis.weekendsOffPerMonthAvg,
            totalOffDaysPerYear: analysis.totalOffDaysPerYear,
        },
        advancedMetrics: analysis.advancedMetrics,
        calendar: calendar.slice(0, 30).map(d => ({
            date: d.date.toISOString().split('T')[0],
            shift: d.shift,
            isWeekend: d.isWeekend,
            isWeekendOff: d.isWeekendOff,
        })),
        qualitative: analysis.qualitative,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_Analise.json`);
};

export const exportComparisonToCSV = (scenarios: Scenario[], analyses: AnalysisResult[]) => {
    const headers = ['Metrica', ...scenarios.map(s => s.name)];
    const rows: string[][] = [headers];

    rows.push(['Equipas', ...scenarios.map(s => s.teams.toString())]);
    rows.push(['Turno (h)', ...scenarios.map(s => s.shiftDuration.toString())]);
    rows.push(['Padrao', ...scenarios.map(s => s.pattern)]);
    rows.push(['']);
    rows.push(['Horas/Semana', ...analyses.map(a => a.avgWeeklyHours.toFixed(1))]);
    rows.push(['Horas/Ano', ...analyses.map(a => Math.round(a.totalAnnualHours).toString())]);
    rows.push(['FDS Folga/Ano', ...analyses.map(a => a.weekendsOffPerYear.toString())]);
    rows.push(['Dias Folga/Ano', ...analyses.map(a => a.totalOffDaysPerYear.toString())]);

    if (analyses.some(a => a.advancedMetrics)) {
        rows.push(['']);
        rows.push(['Dias Consec. Trabalho', ...analyses.map(a => a.advancedMetrics?.maxConsecutiveWorkDays?.toString() || '-')]);
        rows.push(['Mini-Ferias', ...analyses.map(a => a.advancedMetrics?.miniVacations?.toString() || '-')]);
        rows.push(['Turnos Nocturnos', ...analyses.map(a => a.advancedMetrics?.totalNightShifts?.toString() || '-')]);
    }

    const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'Comparacao_Cenarios.csv');
};

export const exportComparisonToJSON = (scenarios: Scenario[], analyses: AnalysisResult[]) => {
    const data = {
        meta: {
            generatedBy: 'ShiftSim Factory',
            generatedAt: new Date().toISOString(),
            version: '1.0',
        },
        scenarios: scenarios.map((scenario, i) => ({
            name: scenario.name,
            teams: scenario.teams,
            shiftDuration: scenario.shiftDuration,
            pattern: scenario.pattern,
            weeklyHoursContract: scenario.weeklyHoursContract,
            analysis: {
                avgWeeklyHours: analyses[i].avgWeeklyHours,
                totalAnnualHours: Math.round(analyses[i].totalAnnualHours),
                weekendsOffPerYear: analyses[i].weekendsOffPerYear,
                totalOffDaysPerYear: analyses[i].totalOffDaysPerYear,
            },
            advancedMetrics: analyses[i].advancedMetrics,
            qualitative: analyses[i].qualitative,
        })),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, 'Comparacao_Cenarios.json');
};

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
