import { describe, it, expect } from 'vitest';
import { parseICSFile, extractTeamPatterns, generateScenarioFromICS } from '../icsParser';

describe('icsParser', () => {
    const sampleICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//PT
BEGIN:VEVENT
SUMMARY:Manha A
DTSTART;VALUE=DATE:20250101
DTEND;VALUE=DATE:20250103
RRULE:FREQ=DAILY;INTERVAL=15
END:VEVENT
BEGIN:VEVENT
SUMMARY:Tarde A
DTSTART;VALUE=DATE:20250103
DTEND;VALUE=DATE:20250105
RRULE:FREQ=DAILY;INTERVAL=15
END:VEVENT
BEGIN:VEVENT
SUMMARY:Manha B
DTSTART;VALUE=DATE:20250101
DTEND;VALUE=DATE:20250103
RRULE:FREQ=DAILY;INTERVAL=15
END:VEVENT
END:VCALENDAR`;

    describe('parseICSFile', () => {
        it('should parse ICS content and extract events', () => {
            const events = parseICSFile(sampleICS);

            expect(events.length).toBe(3);
        });

        it('should extract summary from events', () => {
            const events = parseICSFile(sampleICS);

            expect(events[0].summary).toBe('Manha A');
            expect(events[1].summary).toBe('Tarde A');
        });

        it('should parse dates correctly', () => {
            const events = parseICSFile(sampleICS);

            expect(events[0].startDate).toBeInstanceOf(Date);
            expect(events[0].endDate).toBeInstanceOf(Date);
        });

        it('should parse RRULE', () => {
            const events = parseICSFile(sampleICS);

            expect(events[0].rrule).toBeDefined();
            expect(events[0].rrule?.freq).toBe('DAILY');
            expect(events[0].rrule?.interval).toBe(15);
        });

        it('should handle empty content', () => {
            const events = parseICSFile('');

            expect(events.length).toBe(0);
        });

        it('should handle malformed ICS gracefully', () => {
            const events = parseICSFile('This is not valid ICS content');

            expect(events.length).toBe(0);
        });
    });

    describe('extractTeamPatterns', () => {
        it('should extract patterns for multiple teams', () => {
            const events = parseICSFile(sampleICS);
            const patterns = extractTeamPatterns(events);

            expect(patterns.length).toBe(2); // Team A and Team B
        });

        it('should return patterns sorted by team name', () => {
            const events = parseICSFile(sampleICS);
            const patterns = extractTeamPatterns(events);

            expect(patterns[0].teamName).toBe('A');
            expect(patterns[1].teamName).toBe('B');
        });

        it('should generate pattern strings with correct length', () => {
            const events = parseICSFile(sampleICS);
            const patterns = extractTeamPatterns(events);

            // Pattern should be 15 characters (from RRULE INTERVAL)
            expect(patterns[0].pattern.length).toBe(15);
        });

        it('should handle empty events', () => {
            const patterns = extractTeamPatterns([]);

            expect(patterns.length).toBe(0);
        });
    });

    describe('generateScenarioFromICS', () => {
        it('should generate a scenario object', () => {
            const scenario = generateScenarioFromICS(sampleICS, 'Test Scenario');

            expect(scenario).toHaveProperty('name');
            expect(scenario).toHaveProperty('teams');
            expect(scenario).toHaveProperty('pattern');
            expect(scenario).toHaveProperty('teamPatterns');
            expect(scenario).toHaveProperty('startDate');
        });

        it('should use provided scenario name', () => {
            const scenario = generateScenarioFromICS(sampleICS, 'My Schedule');

            expect(scenario.name).toBe('My Schedule');
        });

        it('should detect correct number of teams', () => {
            const scenario = generateScenarioFromICS(sampleICS, 'Test');

            expect(scenario.teams).toBe(2);
        });

        it('should use custom shift duration', () => {
            const scenario = generateScenarioFromICS(sampleICS, 'Test', 9);

            expect(scenario.shiftDuration).toBe(9);
        });

        it('should use custom weekly hours', () => {
            const scenario = generateScenarioFromICS(sampleICS, 'Test', 8, 37.5);

            expect(scenario.weeklyHoursContract).toBe(37.5);
        });

        it('should handle empty ICS content', () => {
            const scenario = generateScenarioFromICS('', 'Empty');

            expect(scenario.name).toBe('Empty');
            expect(scenario.teams).toBe(0);
            expect(scenario.pattern).toBe('');
            expect(scenario.teamPatterns).toEqual([]);
        });
    });
});
