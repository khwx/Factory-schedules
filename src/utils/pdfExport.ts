import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Scenario, AnalysisResult } from '../types';

interface AutoTableResult {
    finalY: number;
}

function getTableFinalY(doc: jsPDF): number {
    const docWithTable = doc as jsPDF & { lastAutoTable?: AutoTableResult };
    return docWithTable.lastAutoTable?.finalY ?? 0;
}

/**
 * Export single scenario to PDF
 */
export const exportScenarioToPDF = (scenario: Scenario, analysis: AnalysisResult) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Blue
    doc.text('ShiftSim Factory', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Análise: ${scenario.name}`, pageWidth / 2, 30, { align: 'center' });

    // Configuration section
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('Configuração', 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [['Parâmetro', 'Valor']],
        body: [
            ['Número de Equipas', scenario.teams.toString()],
            ['Duração do Turno', `${scenario.shiftDuration} horas`],
            ['Padrão de Rotação', scenario.pattern],
            ...(scenario.weeklyHoursContract ? [['Contrato Semanal', `${scenario.weeklyHoursContract} horas`]] : []),
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
    });

    // Metrics section
    const metricsY = getTableFinalY(doc) + 15;
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text('Métricas', 14, metricsY);

    autoTable(doc, {
        startY: metricsY + 5,
        head: [['Métrica', 'Valor']],
        body: [
            ['Média de Horas Semanais', `${analysis.avgWeeklyHours.toFixed(1)} h`],
            ['Horas Anuais Totais', `${Math.round(analysis.totalAnnualHours)} h`],
            ['Fins de Semana de Folga', `${analysis.weekendsOffPerYear} por ano`],
            ['Total de Dias de Folga', `${analysis.totalOffDaysPerYear} por ano`],
            ['Média FDS Folga/Mês', `${analysis.weekendsOffPerMonthAvg.toFixed(1)}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
    });

    // Advanced metrics
    if (analysis.advancedMetrics) {
        const advY = getTableFinalY(doc) + 15;
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text('Métricas Avançadas', 14, advY);

        autoTable(doc, {
            startY: advY + 5,
            head: [['Métrica', 'Valor']],
            body: [
                ['Máx. Dias Consecutivos Trabalho', analysis.advancedMetrics.maxConsecutiveWorkDays.toString()],
                ['Máx. Dias Consecutivos Folga', analysis.advancedMetrics.maxConsecutiveOffDays.toString()],
                ['Mini-Férias (3+ dias folga)', analysis.advancedMetrics.miniVacations.toString()],
                ['Dias de Folga Isolados', analysis.advancedMetrics.isolatedOffDays.toString()],
                ['Turnos Nocturnos/Ano', analysis.advancedMetrics.totalNightShifts.toString()],
                ['Fins de Sexta à Noite Livres', analysis.advancedMetrics.fridayNightsOff.toString()],
                ['Feriados Trabalhados', analysis.advancedMetrics.holidaysWorked.toString()],
                ['Feriados de Folga', analysis.advancedMetrics.holidaysOff.toString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
        });
    }

    // Qualitative analysis
    const qualY = getTableFinalY(doc) + 15;
    if (qualY < 250) {
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text('Análise Qualitativa', 14, qualY);

        autoTable(doc, {
            startY: qualY + 5,
            head: [['Observação']],
            body: analysis.qualitative.map(q => [q]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `ShiftSim Factory - Gerado em ${new Date().toLocaleDateString('pt-PT')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    const fileName = `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_Analise.pdf`;
    doc.save(fileName);
};

/**
 * Export comparison of multiple scenarios to PDF
 */
export const exportComparisonToPDF = (scenarios: Scenario[], analyses: AnalysisResult[]) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('ShiftSim Factory - Comparação', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`${scenarios.length} cenários comparados`, pageWidth / 2, 22, { align: 'center' });

    // Comparison table
    const headers = ['Métrica', ...scenarios.map(s => s.name)];
    const body = [
        ['Equipas', ...scenarios.map(s => s.teams.toString())],
        ['Turno (h)', ...scenarios.map(s => s.shiftDuration.toString())],
        ['Padrão', ...scenarios.map(s => s.pattern)],
        ['Horas/Semana', ...analyses.map(a => a.avgWeeklyHours.toFixed(1))],
        ['Horas/Ano', ...analyses.map(a => Math.round(a.totalAnnualHours).toString())],
        ['FDS Folga/Ano', ...analyses.map(a => a.weekendsOffPerYear.toString())],
        ['Dias Folga/Ano', ...analyses.map(a => a.totalOffDaysPerYear.toString())],
    ];

    if (analyses.some(a => a.advancedMetrics)) {
        body.push(['Dias Consec. Trabalho', ...analyses.map(a => a.advancedMetrics?.maxConsecutiveWorkDays?.toString() || '-')]);
        body.push(['Mini-Férias', ...analyses.map(a => a.advancedMetrics?.miniVacations?.toString() || '-')]);
        body.push(['Turnos Nocturnos', ...analyses.map(a => a.advancedMetrics?.totalNightShifts?.toString() || '-')]);
    }

    autoTable(doc, {
        startY: 28,
        head: [headers],
        body,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 9 },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
        },
    });

    // Qualitative analysis for each scenario
    const currentY = getTableFinalY(doc) + 15;
    if (currentY < 150) {
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text('Análise Qualitativa', 14, currentY);

        const qualHeaders = ['Cenário', 'Observação'];
        const qualBody: string[][] = [];
        scenarios.forEach((scenario, i) => {
            analyses[i].qualitative.forEach((q, j) => {
                qualBody.push([j === 0 ? scenario.name : '', q]);
            });
        });

        autoTable(doc, {
            startY: currentY + 5,
            head: [qualHeaders],
            body: qualBody,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 8 },
        });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `ShiftSim Factory - Comparação gerada em ${new Date().toLocaleDateString('pt-PT')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save('Comparacao_Cenarios.pdf');
};
