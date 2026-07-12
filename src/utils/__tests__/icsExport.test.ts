import { describe, it, expect } from 'vitest';
import { exportScenarioToICS, getGoogleCalendarLink, getOutlookCalendarLink } from '../icsExport';
import { Scenario } from '../../types';

const testScenario: Scenario = {
    id: 'ics-test',
    name: 'Teste ICS',
    teams: 1,
    shiftDuration: 8,
    weeklyHoursContract: 40,
    pattern: 'MMTTNNFFFF',
};

describe('icsExport', () => {
    describe('exportScenarioToICS', () => {
        it('should return a valid ICS string', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('BEGIN:VCALENDAR');
            expect(ics).toContain('END:VCALENDAR');
        });

        it('should include VERSION 2.0', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('VERSION:2.0');
        });

        it('should include PRODID', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('PRODID:-//ShiftSim Factory//PT');
        });

        it('should include scenario name in X-WR-CALNAME', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('X-WR-CALNAME:Teste ICS');
        });

        it('should contain VEVENT blocks', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('BEGIN:VEVENT');
            expect(ics).toContain('END:VEVENT');
        });

        it('should include VALARM for reminders', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('BEGIN:VALARM');
            expect(ics).toContain('END:VALARM');
        });

        it('should use CRLF line endings', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            expect(ics).toContain('\r\n');
        });

        it('should generate unique UIDs per event', () => {
            const ics = exportScenarioToICS(testScenario, 2025);
            const uidMatches = ics.match(/UID:(.+)/g);
            if (uidMatches) {
                const uids = uidMatches.map(u => u.replace('UID:', ''));
                const uniqueUids = new Set(uids);
                expect(uniqueUids.size).toBe(uids.length);
            }
        });

        it('should include team name in event summaries', () => {
            const ics = exportScenarioToICS(testScenario, 2025, 0);
            expect(ics).toContain('Equipa A');
        });

        it('should generate for specific team when teamIndex provided', () => {
            const multiTeam: Scenario = { ...testScenario, teams: 3 };
            const ics = exportScenarioToICS(multiTeam, 2025, 1);
            expect(ics).toContain('Equipa B');
        });

        it('should generate for all teams when teamIndex not provided', () => {
            const multiTeam: Scenario = { ...testScenario, teams: 2 };
            const ics = exportScenarioToICS(multiTeam, 2025);
            expect(ics).toContain('Equipa A');
            expect(ics).toContain('Equipa B');
        });

        it('should include shift type in descriptions', () => {
            const ics = exportScenarioToICS(testScenario, 2025, 0);
            expect(ics).toMatch(/DESCRIPTION:.*Turno/);
        });

        it('should include CATEGORIES', () => {
            const ics = exportScenarioToICS(testScenario, 2025, 0);
            expect(ics).toContain('CATEGORIES:');
        });
    });

    describe('getGoogleCalendarLink', () => {
        it('should return a Google Calendar URL', () => {
            const link = getGoogleCalendarLink(testScenario, 2025);
            expect(link).toContain('https://calendar.google.com/calendar/render');
        });

        it('should include cid parameter', () => {
            const link = getGoogleCalendarLink(testScenario, 2025);
            expect(link).toContain('cid=');
        });
    });

    describe('getOutlookCalendarLink', () => {
        it('should return an Outlook Calendar URL', () => {
            const link = getOutlookCalendarLink(testScenario, 2025);
            expect(link).toContain('https://outlook.office.com/calendar/addcalendar');
        });

        it('should include url parameter', () => {
            const link = getOutlookCalendarLink(testScenario, 2025);
            expect(link).toContain('url=');
        });
    });
});
