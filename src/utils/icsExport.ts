import { Scenario, DayInfo, ShiftType } from '../types';
import { generateYearCalendar } from './calendar';
import { pt, Translations } from '../i18n/locales/pt';

interface ICSEvent {
    startDate: Date;
    endDate: Date;
    summary: string;
    description?: string;
    uid: string;
}

function shiftName(shift: ShiftType, t: Translations): string {
    switch (shift) {
        case 'M': return t.calendar.morning;
        case 'T': return t.calendar.afternoon;
        case 'N': return t.calendar.night;
        case 'F': return t.calendar.off;
    }
}

function teamName(teamIndex: number, t: Translations): string {
    return `${t.teamRoster.team} ${String.fromCharCode(65 + teamIndex)}`;
}

function formatICSDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function generateEventUID(scenarioId: string, teamIndex: number, dayIndex: number): string {
    return `${scenarioId}-team${teamIndex}-day${dayIndex}@shiftsim-factory`;
}

function generateEventsFromCalendar(
    calendar: DayInfo[],
    shiftDuration: number,
    scenarioId: string,
    scenarioName: string,
    teamIndex: number,
    teamLabel: string,
    t: Translations,
): ICSEvent[] {
    const events: ICSEvent[] = [];
    let blockStart = -1;
    let blockShift: ShiftType = 'F';

    for (let i = 0; i < calendar.length; i++) {
        const day = calendar[i];
        if (day.shift !== 'F') {
            if (blockStart === -1) {
                blockStart = i;
                blockShift = day.shift;
            } else if (day.shift !== blockShift) {
                events.push({
                    startDate: calendar[blockStart].date,
                    endDate: calendar[i - 1].date,
                    summary: `${shiftName(blockShift, t)} — ${teamLabel} (${scenarioName})`,
                    description: `${teamLabel}: ${blockShift} (${shiftName(blockShift, t)}) — ${shiftDuration}h`,
                    uid: generateEventUID(scenarioId, teamIndex, blockStart),
                });
                blockStart = i;
                blockShift = day.shift;
            }
        } else if (blockStart !== -1) {
            events.push({
                startDate: calendar[blockStart].date,
                endDate: calendar[i - 1].date,
                summary: `${shiftName(blockShift, t)} — ${teamLabel} (${scenarioName})`,
                description: `${teamLabel}: ${blockShift} (${shiftName(blockShift, t)}) — ${shiftDuration}h`,
                uid: generateEventUID(scenarioId, teamIndex, blockStart),
            });
            blockStart = -1;
            blockShift = 'F';
        }
    }

    if (blockStart !== -1) {
        events.push({
            startDate: calendar[blockStart].date,
            endDate: calendar[calendar.length - 1].date,
            summary: `${shiftName(blockShift, t)} — ${teamLabel} (${scenarioName})`,
            description: `${teamLabel}: ${blockShift} (${shiftName(blockShift, t)}) — ${shiftDuration}h`,
            uid: generateEventUID(scenarioId, teamIndex, blockStart),
        });
    }

    return events;
}

export function exportScenarioToICS(scenario: Scenario, year?: number, teamIndex?: number, t: Translations = pt): string {
    const y = year ?? new Date().getFullYear();

    const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ShiftSim Factory//PT',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${scenario.name}`,
        `X-WR-CALDESC:${t.calendar.icsDescription.replace('{teams}', String(scenario.teams)).replace('{hours}', String(scenario.shiftDuration))}`,
        'X-PUBLISHED-TTL:PT12H',
        'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    ];

    const startTeam = teamIndex ?? 0;
    const endTeam = teamIndex !== undefined ? startTeam + 1 : scenario.teams;

    for (let team = startTeam; team < endTeam && team < scenario.teams; team++) {
        const calendar = generateYearCalendar(scenario, y, team);
        const teamLabel = teamName(team, t);
        const events = generateEventsFromCalendar(calendar, scenario.shiftDuration, scenario.id, scenario.name, team, teamLabel, t);

        for (const event of events) {
            const startDate = new Date(event.startDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(event.endDate);
            endDate.setHours(23, 59, 59, 0);

            lines.push('BEGIN:VEVENT');
            lines.push(`UID:${event.uid}`);
            lines.push(`DTSTART;VALUE=DATE:${formatICSDate(startDate).substring(0, 8)}`);
            lines.push(`DTEND;VALUE=DATE:${formatICSDate(new Date(endDate.getTime() + 86400000)).substring(0, 8)}`);
            lines.push(`SUMMARY:${event.summary}`);
            if (event.description) {
                lines.push(`DESCRIPTION:${event.description}`);
            }
            lines.push(`CATEGORIES:${event.summary.split(' — ')[0]}`);
            lines.push('BEGIN:VALARM');
            lines.push('TRIGGER:-PT30M');
            lines.push('ACTION:DISPLAY');
            lines.push(`DESCRIPTION:${event.summary}`);
            lines.push('END:VALARM');
            lines.push('END:VEVENT');
        }
    }

    lines.push('END:VCALENDAR');

    return lines.join('\r\n') + '\r\n';
}

export function downloadICS(scenario: Scenario, year?: number, t: Translations = pt): void {
    const icsContent = exportScenarioToICS(scenario, year, undefined, t);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `${scenario.name.replace(/[^a-z0-9]/gi, '_')}_${dateStr}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function getGoogleCalendarLink(scenario: Scenario, year?: number, t: Translations = pt): string {
    const icsContent = exportScenarioToICS(scenario, year, undefined, t);
    const encoded = encodeURIComponent(icsContent.trim());
    const dataUri = `data:text/calendar;charset=utf-8,${encoded}`;
    return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(dataUri)}`;
}

export function getOutlookCalendarLink(scenario: Scenario, year?: number, t: Translations = pt): string {
    const icsContent = exportScenarioToICS(scenario, year, undefined, t);
    const encoded = encodeURIComponent(icsContent.trim());
    const dataUri = `data:text/calendar;charset=utf-8,${encoded}`;
    return `https://outlook.office.com/calendar/addcalendar?url=${encodeURIComponent(dataUri)}`;
}