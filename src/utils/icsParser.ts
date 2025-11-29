// ICS Calendar File Parser
// Parses .ics files to extract shift patterns for multiple teams

export interface ICSEvent {
    summary: string; // e.g., "Manhã A", "Noite B"
    startDate: Date;
    endDate: Date;
    rrule?: {
        freq: string; // e.g., "DAILY"
        interval: number; // e.g., 15
    };
}

export interface TeamPattern {
    teamName: string; // e.g., "A", "B", "C"
    pattern: string; // e.g., "NNNFFTTFFMMMFF"
    startOffset: number; // Days offset from cycle start
}

/**
 * Parse ICS file content and extract calendar events
 */
export function parseICSFile(content: string): ICSEvent[] {
    const events: ICSEvent[] = [];
    const lines = content.split(/\r?\n/);

    let currentEvent: Partial<ICSEvent> = {};
    let inEvent = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === 'BEGIN:VEVENT') {
            inEvent = true;
            currentEvent = {};
        } else if (trimmed === 'END:VEVENT' && inEvent) {
            if (currentEvent.summary && currentEvent.startDate && currentEvent.endDate) {
                events.push(currentEvent as ICSEvent);
            }
            inEvent = false;
        } else if (inEvent) {
            // Parse SUMMARY (e.g., "SUMMARY:Manhã A")
            if (trimmed.startsWith('SUMMARY:')) {
                currentEvent.summary = trimmed.substring(8);
            }

            // Parse DTSTART (e.g., "DTSTART;VALUE=DATE:20250105")
            else if (trimmed.startsWith('DTSTART')) {
                const dateMatch = trimmed.match(/:(\d{8})/);
                if (dateMatch) {
                    const dateStr = dateMatch[1];
                    currentEvent.startDate = parseICSDate(dateStr);
                }
            }

            // Parse DTEND (e.g., "DTEND;VALUE=DATE:20250108")
            else if (trimmed.startsWith('DTEND')) {
                const dateMatch = trimmed.match(/:(\d{8})/);
                if (dateMatch) {
                    const dateStr = dateMatch[1];
                    currentEvent.endDate = parseICSDate(dateStr);
                }
            }

            // Parse RRULE (e.g., "RRULE:FREQ=DAILY;INTERVAL=15")
            else if (trimmed.startsWith('RRULE:')) {
                const rruleStr = trimmed.substring(6);
                const rrule: any = {};

                const freqMatch = rruleStr.match(/FREQ=([A-Z]+)/);
                if (freqMatch) rrule.freq = freqMatch[1];

                const intervalMatch = rruleStr.match(/INTERVAL=(\d+)/);
                if (intervalMatch) rrule.interval = parseInt(intervalMatch[1]);

                currentEvent.rrule = rrule;
            }
        }
    }

    return events;
}

/**
 * Parse ICS date format (YYYYMMDD) to Date object
 */
function parseICSDate(dateStr: string): Date {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(dateStr.substring(6, 8));
    return new Date(year, month, day);
}

/**
 * Extract team name and shift type from event summary
 * Examples: "Manhã A" -> {team: "A", shift: "M"}
 *           "Noite B" -> {team: "B", shift: "N"}
 */
function parseEventSummary(summary: string): { team: string; shift: string } | null {
    const normalized = summary.trim();

    // Match patterns like "Manhã A", "Tarde B", "Noite C"
    const match = normalized.match(/(Manhã|Tarde|Noite)\s+([A-E])/i);

    if (!match) return null;

    const shiftType = match[1].toLowerCase();
    const team = match[2].toUpperCase();

    let shift = '';
    if (shiftType === 'manhã') shift = 'M';
    else if (shiftType === 'tarde') shift = 'T';
    else if (shiftType === 'noite') shift = 'N';

    return { team, shift };
}

/**
 * Extract shift patterns for all teams from ICS events
 * Returns array of patterns, one per team
 */
export function extractTeamPatterns(events: ICSEvent[]): TeamPattern[] {
    if (events.length === 0) return [];

    // Determine cycle length from RRULE interval
    const cycleLength = events[0].rrule?.interval || 15;

    // Group events by team
    const teamEvents: { [team: string]: ICSEvent[] } = {};

    for (const event of events) {
        const parsed = parseEventSummary(event.summary);
        if (!parsed) continue;

        if (!teamEvents[parsed.team]) {
            teamEvents[parsed.team] = [];
        }
        teamEvents[parsed.team].push(event);
    }

    // Build pattern for each team
    const patterns: TeamPattern[] = [];

    for (const [teamName, teamEventList] of Object.entries(teamEvents)) {
        const pattern = buildTeamPattern(teamEventList, cycleLength);
        patterns.push({
            teamName,
            pattern,
            startOffset: 0, // Will calculate if needed
        });
    }

    // Sort by team name
    patterns.sort((a, b) => a.teamName.localeCompare(b.teamName));

    return patterns;
}

/**
 * Build pattern string for a single team from their events
 */
function buildTeamPattern(events: ICSEvent[], cycleLength: number): string {
    // Initialize pattern with all F (folga)
    const pattern: string[] = new Array(cycleLength).fill('F');

    // Find earliest date to use as reference
    const dates = events.map(e => e.startDate.getTime());
    const minDate = Math.min(...dates);
    const referenceDate = new Date(minDate);

    // Fill in shifts from events
    for (const event of events) {
        const parsed = parseEventSummary(event.summary);
        if (!parsed) continue;

        const daysDiff = Math.floor((event.startDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.floor((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Fill pattern for this event's duration
        for (let i = 0; i < duration; i++) {
            const patternIndex = (daysDiff + i) % cycleLength;
            pattern[patternIndex] = parsed.shift;
        }
    }

    return pattern.join('');
}

/**
 * Generate Scenario object from ICS file content
 */
export function generateScenarioFromICS(
    icsContent: string,
    scenarioName: string,
    shiftDuration: number = 8,
    weeklyHoursContract: number = 40
): {
    name: string;
    teams: number;
    shiftDuration: number;
    weeklyHoursContract: number;
    pattern: string;
    teamPatterns: string[];
} {
    const events = parseICSFile(icsContent);
    const teamPatterns = extractTeamPatterns(events);

    return {
        name: scenarioName,
        teams: teamPatterns.length,
        shiftDuration,
        weeklyHoursContract,
        pattern: teamPatterns[0]?.pattern || '', // First team pattern as default
        teamPatterns: teamPatterns.map(tp => tp.pattern),
    };
}
