import type jsPDF from 'jspdf';
import { Scenario, AnalysisResult } from '../types';
import { validateLegalCompliance } from './legalValidator';
import { generateYearCalendar } from './calendar';

interface AutoTableResult {
    finalY: number;
}

function getTableFinalY(doc: jsPDF): number {
    const docWithTable = doc as jsPDF & { lastAutoTable?: AutoTableResult };
    return docWithTable.lastAutoTable?.finalY ?? 0;
}

const BLUE = [59, 130, 246] as const;
const GRAY = [128, 128, 128] as const;

function drawBrandedHeader(doc: jsPDF, title: string, subtitle?: string) {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(...BLUE);
    doc.rect(0, 0, pageWidth, 42, 'F');

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 8, 26, 26, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setTextColor(...BLUE);
    doc.text('SS', 25, 24, { align: 'center' });

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('ShiftSim Factory', 44, 18);

    doc.setFontSize(9);
    doc.setTextColor(200, 220, 255);
    doc.text('Simulacao Inteligente de Escalas de Turnos', 44, 26);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(title, pageWidth - 14, 18, { align: 'right' });

    if (subtitle) {
        doc.setFontSize(8);
        doc.setTextColor(200, 220, 255);
        doc.text(subtitle, pageWidth - 14, 26, { align: 'right' });
    }

    doc.setFontSize(7);
    doc.setTextColor(180, 200, 240);
    doc.text(`Gerado: ${new Date().toLocaleDateString('pt-PT')} ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - 14, 34, { align: 'right' });

    return 50;
}

function drawBrandedFooter(doc: jsPDF, currentPage: number, totalPages: number) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.4);
    doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text('ShiftSim Factory', 14, pageHeight - 10);
    doc.text('www.shiftsim.com', 14, pageHeight - 5);

    doc.text('Confidencial — Uso Interno', pageWidth / 2, pageHeight - 7, { align: 'center' });

    doc.text(`Pagina ${currentPage} / ${totalPages}`, pageWidth - 14, pageHeight - 10);
    doc.text(new Date().toLocaleDateString('pt-PT'), pageWidth - 14, pageHeight - 5, { align: 'right' });
}

function addPageNumbers(doc: jsPDF) {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawBrandedFooter(doc, i, totalPages);
    }
}

function drawSectionTitle(doc: jsPDF, title: string, y: number) {
    const pageWidth = doc.internal.pageSize.getWidth();
    if (y > 260) {
        doc.addPage();
        y = 20;
    }
    doc.setFillColor(240, 245, 255);
    doc.roundedRect(14, y - 4, pageWidth - 28, 10, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...BLUE);
    doc.text(title, 18, y + 3);
    return y + 12;
}

/**
 * Export single scenario to PDF with professional branding
 */
export const exportScenarioToPDF = async (scenario: Scenario, analysis: AnalysisResult) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF();

    let y = drawBrandedHeader(doc, 'Relatorio de Analise', scenario.name);

    y = drawSectionTitle(doc, 'Configuracao do Cenario', y);

    autoTable(doc, {
        startY: y,
        head: [['Parametro', 'Valor']],
        body: [
            ['Nome do Cenario', scenario.name],
            ['Numero de Equipas', scenario.teams.toString()],
            ['Duracao do Turno', `${scenario.shiftDuration} horas`],
            ['Padrao de Rotacao', scenario.pattern],
            ...(scenario.weeklyHoursContract ? [['Contrato Semanal', `${scenario.weeklyHoursContract} horas`]] : []),
            ...(scenario.startDate ? [['Data de Inicio', scenario.startDate]] : []),
        ],
        theme: 'grid',
        headStyles: { fillColor: [...BLUE], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55 } },
    });

    y = getTableFinalY(doc) + 8;
    y = drawSectionTitle(doc, 'Metricas Principais', y);

    autoTable(doc, {
        startY: y,
        head: [['Metrica', 'Valor']],
        body: [
            ['Media de Horas Semanais', `${analysis.avgWeeklyHours.toFixed(1)} h`],
            ['Horas Anuais Totais', `${Math.round(analysis.totalAnnualHours)} h`],
            ['Fins de Semana de Folga', `${analysis.weekendsOffPerYear} por ano`],
            ['Total de Dias de Folga', `${analysis.totalOffDaysPerYear} por ano`],
            ['Media FDS Folga/Mes', `${analysis.weekendsOffPerMonthAvg.toFixed(1)}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [...BLUE], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55 } },
    });

    if (analysis.advancedMetrics) {
        y = getTableFinalY(doc) + 8;
        y = drawSectionTitle(doc, 'Metricas Avancadas', y);

        autoTable(doc, {
            startY: y,
            head: [['Metrica', 'Valor']],
            body: [
                ['Max. Dias Consecutivos Trabalho', analysis.advancedMetrics.maxConsecutiveWorkDays.toString()],
                ['Max. Dias Consecutivos Folga', analysis.advancedMetrics.maxConsecutiveOffDays.toString()],
                ['Mini-Ferias (3+ dias folga)', analysis.advancedMetrics.miniVacations.toString()],
                ['Dias de Folga Isolados', analysis.advancedMetrics.isolatedOffDays.toString()],
                ['Turnos Noturnos/Ano', analysis.advancedMetrics.totalNightShifts.toString()],
                ['Fins de Sexta a Noite Livres', analysis.advancedMetrics.fridayNightsOff.toString()],
                ['Feriados Trabalhados', analysis.advancedMetrics.holidaysWorked.toString()],
                ['Feriados de Folga', analysis.advancedMetrics.holidaysOff.toString()],
            ],
            theme: 'grid',
            headStyles: { fillColor: [...BLUE], textColor: 255 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
        });
    }

    y = getTableFinalY(doc) + 8;
    y = drawSectionTitle(doc, 'Analise Qualitativa', y);

    autoTable(doc, {
        startY: y,
        head: [['Observacao']],
        body: analysis.qualitative.map(q => [q]),
        theme: 'grid',
        headStyles: { fillColor: [...BLUE], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9, cellPadding: 3 },
    });

    if (scenario.pattern.length <= 14) {
        y = getTableFinalY(doc) + 8;
        if (y > 240) { doc.addPage(); y = 20; }
        y = drawSectionTitle(doc, 'Padrao Visual (30 dias)', y);

        const calendar = generateYearCalendar(scenario, new Date().getFullYear());
        const first30 = calendar.slice(0, 30);

        autoTable(doc, {
            startY: y,
            head: [['Dia', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']],
            body: [
                ['Turno', ...first30.slice(0, 15).map(d => d.shift)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [...BLUE], textColor: 255, fontSize: 7 },
            styles: { fontSize: 7, cellPadding: 1.5, halign: 'center' },
            columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
        });

        y = getTableFinalY(doc) + 2;
        if (y > 260) { doc.addPage(); y = 20; }
        autoTable(doc, {
            startY: y,
            head: [['Dia', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']],
            body: [
                ['Turno', ...first30.slice(15, 30).map(d => d.shift)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [...BLUE], textColor: 255, fontSize: 7 },
            styles: { fontSize: 7, cellPadding: 1.5, halign: 'center' },
            columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
        });
    }

    addPageNumbers(doc);

    const pdfDateStr = new Date().toISOString().split('T')[0];
    const fileName = `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_Analise_${pdfDateStr}.pdf`;
    doc.save(fileName);
};

/**
 * Export comparison of multiple scenarios to PDF with professional branding
 */
export const exportComparisonToPDF = async (scenarios: Scenario[], analyses: AnalysisResult[]) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF({ orientation: 'landscape' });

    let y = drawBrandedHeader(doc, 'Comparacao de Cenarios', `${scenarios.length} cenarios`);

    y = drawSectionTitle(doc, 'Metricas Comparativas', y);

    const headers = ['Metrica', ...scenarios.map(s => s.name)];
    const body = [
        ['Equipas', ...scenarios.map(s => s.teams.toString())],
        ['Turno (h)', ...scenarios.map(s => s.shiftDuration.toString())],
        ['Padrao', ...scenarios.map(s => s.pattern)],
        ['Horas/Semana', ...analyses.map(a => a.avgWeeklyHours.toFixed(1))],
        ['Horas/Ano', ...analyses.map(a => Math.round(a.totalAnnualHours).toString())],
        ['FDS Folga/Ano', ...analyses.map(a => a.weekendsOffPerYear.toString())],
        ['Dias Folga/Ano', ...analyses.map(a => a.totalOffDaysPerYear.toString())],
    ];

    if (analyses.some(a => a.advancedMetrics)) {
        body.push(['Dias Consec. Trabalho', ...analyses.map(a => a.advancedMetrics?.maxConsecutiveWorkDays?.toString() || '-')]);
        body.push(['Mini-Ferias', ...analyses.map(a => a.advancedMetrics?.miniVacations?.toString() || '-')]);
        body.push(['Turnos Noturnos', ...analyses.map(a => a.advancedMetrics?.totalNightShifts?.toString() || '-')]);
    }

    autoTable(doc, {
        startY: y,
        head: [headers],
        body,
        theme: 'grid',
        headStyles: { fillColor: [...BLUE], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
    });

    y = getTableFinalY(doc) + 8;
    y = drawSectionTitle(doc, 'Analise Qualitativa', y);

    const qualHeaders = ['Cenario', 'Observacao'];
    const qualBody: string[][] = [];
    scenarios.forEach((scenario, i) => {
        analyses[i].qualitative.forEach((q, j) => {
            qualBody.push([j === 0 ? scenario.name : '', q]);
        });
    });

    autoTable(doc, {
        startY: y,
        head: [qualHeaders],
        body: qualBody,
        theme: 'grid',
        headStyles: { fillColor: [...BLUE], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { fontSize: 8, cellPadding: 2 },
    });

    addPageNumbers(doc);

    const cmpDateStr = new Date().toISOString().split('T')[0];
    doc.save(`Comparacao_Cenarios_${cmpDateStr}.pdf`);
};

/**
 * Export compliance report for audit purposes
 */
export const exportComplianceReport = async (scenario: Scenario, year?: number): Promise<void> => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const dateStr = new Date().toISOString().split('T')[0];
    const reports = validateLegalCompliance(scenario, year);

    let y = drawBrandedHeader(doc, 'Relatorio de Conformidade Legal', `Codigo do Trabalho — Auditoria ACT`);

    for (const report of reports) {
        doc.setFontSize(11);
        doc.setTextColor(report.allPassed ? 34 : 200, report.allPassed ? 197 : 30, report.allPassed ? 94 : 30);

        if (y > 260) { doc.addPage(); y = 20; }

        doc.setFillColor(report.allPassed ? 240 : 255, report.allPassed ? 248 : 240, report.allPassed ? 240 : 240);
        doc.roundedRect(14, y - 4, pageWidth - 28, 10, 2, 2, 'F');

        const statusIcon = report.allPassed ? 'CONFORME' : `NAO CONFORME (${report.criticalFailures} falhas)`;
        doc.text(`${report.teamName} — ${statusIcon}`, 18, y + 3);
        y += 14;

        for (const result of report.results) {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(8);
            const passed = result.passed;
            const color = result.limit === undefined ? [...BLUE] : passed ? [34, 197, 94] : [239, 68, 68];
            doc.setTextColor(color[0], color[1], color[2]);

            const status = passed ? 'OK' : 'FALHA';
            const limit = result.limit !== undefined ? ` (limite: ${result.limit})` : '';
            const actual = result.actual !== undefined ? ` (atual: ${result.actual})` : '';

            doc.setFillColor(passed ? 245 : 255, passed ? 250 : 245, passed ? 245 : 245);
            doc.roundedRect(16, y - 3, pageWidth - 32, 12, 1, 1, 'F');

            doc.text(`${result.rule.article}: ${result.rule.title}`, 20, y + 4);
            doc.setTextColor(...GRAY);
            doc.text(`  ${status}: ${result.details}${limit}${actual}`, 20, y + 9);
            y += 14;
        }

        y += 6;
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawBrandedFooter(doc, i, totalPages);
    }

    doc.save(`Relatorio_Conformidade_${scenario.name.replace(/[^a-z0-9]/gi, '_')}_${dateStr}.pdf`);
};
