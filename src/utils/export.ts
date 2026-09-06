import { Scenario, AnalysisResult, DayInfo } from '../types';
import { generateYearCalendar } from './calendar';
import { calculateQualityOfLifeScore } from './qualityOfLife';

/**
 * Export scenario data to Excel
 */
export const exportToExcel = async (scenario: Scenario, analysis: AnalysisResult) => {
    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();
    const currentYear = new Date().getFullYear();

    // Sheet 1: Summary
    const summaryData = [
        ['ShiftSim Factory - Análise de Cenário'],
        [''],
        ['Nome do Cenário', scenario.name],
        ['Número de Equipas', scenario.teams],
        ['Duração do Turno (horas)', scenario.shiftDuration],
    ];

    if (scenario.teamPatterns) {
        summaryData.push(['Padrões de Equipa:']);
        scenario.teamPatterns.forEach((p, i) => {
            summaryData.push([`Equipa ${String.fromCharCode(65 + i)}`, p]);
        });
    } else {
        summaryData.push(['Padrão de Rotação', scenario.pattern]);
    }

    summaryData.push(['']);
    summaryData.push(['MÉTRICAS']);
    summaryData.push(['Média de Horas Semanais', analysis.avgWeeklyHours.toFixed(2)]);
    summaryData.push(['Horas Anuais Totais', Math.round(analysis.totalAnnualHours)]);
    summaryData.push(['Fins de Semana de Folga (por ano)', analysis.weekendsOffPerYear]);
    summaryData.push(['Total de Dias de Folga (por ano)', analysis.totalOffDaysPerYear]);
    summaryData.push(['']);
    summaryData.push(['ANÁLISE QUALITATIVA']);
    analysis.qualitative.forEach(q => summaryData.push([q]));

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

    // Sheet 2: Quality of Life Analysis
    const qolScore = calculateQualityOfLifeScore(scenario, analysis, currentYear);
    const qolData = [
        ['Análise de Qualidade de Vida (QoL)'],
        [''],
        ['Pontuação Global', `${qolScore.overall}%`],
        ['Classificação', qolScore.grade],
        [''],
        ['Sub-Scores Detalhados', 'Valor'],
        ['Cobertura de Fins de Semana', `${qolScore.breakdown.weekendsCoverage}%`],
        ['Equilíbrio Trabalho-Vida', `${qolScore.breakdown.workLifeBalance}%`],
        ['Qualidade do Descanso', `${qolScore.breakdown.consecutiveRest}%`],
        ['Impacto de Turnos Noturnos', `${qolScore.breakdown.nightShiftImpact}%`],
        ['Cobertura de Feriados', `${qolScore.breakdown.holidaysCoverage}%`],
        ['Recuperação e Regularidade', `${qolScore.breakdown.recoveryRegularity}%`],
        ['Acúmulo de Fadiga', `${qolScore.breakdown.fatigueAccumulation}%`],
        ['Disrupção Social', `${qolScore.breakdown.socialDisruption}%`],
        ['Disrupção Circadiana', `${qolScore.breakdown.circadianDisruption}%`],
        ['Sustentabilidade a Longo Prazo', `${qolScore.breakdown.longTermSustainability}%`],
        [''],
        ['OBSERVAÇÕES'],
    ];
    qolScore.insights.forEach(insight => qolData.push([insight]));

    const qolSheet = XLSX.utils.aoa_to_sheet(qolData);
    XLSX.utils.book_append_sheet(workbook, qolSheet, 'Qualidade de Vida');

    // Sheet 3-7: Calendar for each year (5 years)
    for (let i = 0; i < 5; i++) {
        const year = currentYear + i;

        // Prepare headers
        const headers = ['Data', 'Dia da Semana'];
        for (let t = 0; t < scenario.teams; t++) {
            const teamName = String.fromCharCode(65 + t); // A, B, C...
            headers.push(`Turno ${teamName}`);
            headers.push(`FDS Folga ${teamName}`);
        }

        // Generate calendar for each team
        const teamCalendars: DayInfo[][] = [];
        for (let t = 0; t < scenario.teams; t++) {
            teamCalendars.push(generateYearCalendar(scenario, year, t));
        }

        // Combine data
        // Assuming all calendars have same length and dates (which they should)
        const baseCalendar = teamCalendars[0];
        const calendarData = [headers];

        baseCalendar.forEach((day, dayIdx) => {
            const row = [
                day.date.toLocaleDateString('pt-PT'),
                day.date.toLocaleDateString('pt-PT', { weekday: 'long' }),
            ];

            for (let t = 0; t < scenario.teams; t++) {
                const teamDay = teamCalendars[t][dayIdx];
                row.push(teamDay.shift);
                row.push(teamDay.isWeekendOff ? 'Sim' : '');
            }
            calendarData.push(row);
        });

        const calendarSheet = XLSX.utils.aoa_to_sheet(calendarData);
        XLSX.utils.book_append_sheet(workbook, calendarSheet, `Calendario_${year}`);
    }

    // Sheet 7: Multi-Year Weekend Analysis
    const weekendAnalysisData = [
        ['Análise de Fins de Semana (5 Anos)'],
        [''],
        ['Ano', 'Total de Fins de Semana', 'Total de Dias de Folga', ...analysis.multiYearAnalysis[0]?.monthlyBreakdown.map(m => m.monthName) || []],
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
    XLSX.utils.book_append_sheet(workbook, weekendSheet, 'Analise_Fins_Semana');

    // Generate and download
    const fileName = `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_Analise_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
};

/**
 * Export comparison of multiple scenarios
 */
export const exportComparison = async (scenarios: Scenario[], analyses: AnalysisResult[]) => {
    const XLSX = await import('xlsx');
    const workbook = XLSX.utils.book_new();

    // Comparison Sheet
    const comparisonData = [
        ['Comparação de Cenários'],
        [''],
        ['Métrica', ...scenarios.map(s => s.name)],
        ['Equipas', ...scenarios.map(s => s.teams)],
        ['Duração do Turno (h)', ...scenarios.map(s => s.shiftDuration)],
        ['Padrão', ...scenarios.map(s => s.pattern)],
        [''],
        ['MÉTRICAS'],
        ['Média de Horas Semanais', ...analyses.map(a => a.avgWeeklyHours.toFixed(2))],
        ['Horas Anuais Totais', ...analyses.map(a => Math.round(a.totalAnnualHours))],
        ['Fins de Semana de Folga/Ano', ...analyses.map(a => a.weekendsOffPerYear)],
        ['Total de Dias de Folga/Ano', ...analyses.map(a => a.totalOffDaysPerYear)],
    ];

    const comparisonSheet = XLSX.utils.aoa_to_sheet(comparisonData);
    XLSX.utils.book_append_sheet(workbook, comparisonSheet, 'Comparacao');

    // QoL Comparison Sheet
    const qolComparisonData = [
        ['Comparação de Qualidade de Vida (QoL)'],
        [''],
        ['Métrica', ...scenarios.map(s => s.name)],
    ];

    const qolMetrics = [
        ['Pontuação Global', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.overall}% (${q.grade})`;
        })],
        ['Cobertura FDS', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.weekendsCoverage}%`;
        })],
        ['Equilíbrio Trab-Vida', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.workLifeBalance}%`;
        })],
        ['Qualidade Descanso', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.consecutiveRest}%`;
        })],
        ['Impacto Noturno', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.nightShiftImpact}%`;
        })],
        ['Cobertura Feriados', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.holidaysCoverage}%`;
        })],
        ['Recuperação/Regularidade', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.recoveryRegularity}%`;
        })],
        ['Acúmulo Fatiga', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.fatigueAccumulation}%`;
        })],
        ['Disrupção Social', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.socialDisruption}%`;
        })],
        ['Disrupção Circadiana', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.circadianDisruption}%`;
        })],
        ['Sustentabilidade LT', ...analyses.map(a => {
            const q = calculateQualityOfLifeScore(scenarios[analyses.indexOf(a)], a, new Date().getFullYear());
            return `${q.breakdown.longTermSustainability}%`;
        })],
    ];

    qolMetrics.forEach(row => qolComparisonData.push(row));

    const qolComparisonSheet = XLSX.utils.aoa_to_sheet(qolComparisonData);
    XLSX.utils.book_append_sheet(workbook, qolComparisonSheet, 'QoL_Comparacao');

    // Multi-year comparison for each scenario
    scenarios.forEach((scenario, idx) => {
        const analysis = analyses[idx];
        const yearData = [
            [`${scenario.name} - Análise de 5 Anos`],
            [''],
            ['Ano', 'Total de Fins de Semana', 'Total de Dias de Folga', ...analysis.multiYearAnalysis[0]?.monthlyBreakdown.map(m => m.monthName) || []],
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

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Comparacao_Cenarios_${dateStr}.xlsx`);
};
