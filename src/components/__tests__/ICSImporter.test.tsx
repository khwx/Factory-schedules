import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ICSImporter from '../ICSImporter';
import { I18nProvider } from '../../i18n';

const renderWithI18n = (ui: React.ReactElement) =>
    render(<I18nProvider>{ui}</I18nProvider>);

const VALID_ICS = [
    'BEGIN:VCALENDAR',
    'BEGIN:VEVENT',
    'SUMMARY:Manha A',
    'DTSTART;VALUE=DATE:20250101',
    'DTEND;VALUE=DATE:20250102',
    'END:VEVENT',
    'END:VCALENDAR',
].join('\n');

const makeFile = (name: string, content: string, size?: number) => {
    const file = new File([content], name, { type: 'text/calendar' });
    if (size !== undefined) {
        Object.defineProperty(file, 'size', { value: size });
    }
    return file;
};

const getDropZone = () =>
    screen.getByText(/Arraste um ficheiro/i).closest('div') as HTMLElement;

describe('ICSImporter', () => {
    it('renders collapsed by default and expands on click', () => {
        renderWithI18n(<ICSImporter onImport={() => {}} />);
        expect(screen.getByText(/Importar Horario \(.ics\)/)).toBeInTheDocument();
        expect(screen.queryByText('Selecionar Ficheiro')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText(/Importar Horario \(.ics\)/));
        expect(screen.getByText('Selecionar Ficheiro')).toBeInTheDocument();
    });

    it('shows an error for non-ics files', () => {
        renderWithI18n(<ICSImporter onImport={() => {}} />);
        fireEvent.click(screen.getByText(/Importar Horario \(.ics\)/));

        fireEvent.drop(getDropZone(), { dataTransfer: { files: [makeFile('notes.txt', 'hello')] } });
        expect(screen.getByText(/Por favor selecione um ficheiro .ics/i)).toBeInTheDocument();
    });

    it('rejects files larger than 5MB', () => {
        renderWithI18n(<ICSImporter onImport={() => {}} />);
        fireEvent.click(screen.getByText(/Importar Horario \(.ics\)/));

        fireEvent.drop(getDropZone(), { dataTransfer: { files: [makeFile('schedule.ics', VALID_ICS, 6 * 1024 * 1024)] } });
        expect(screen.getByText(/Ficheiro demasiado grande/i)).toBeInTheDocument();
    });

    it('parses a valid ics and shows a preview with import button', async () => {
        const onImport = vi.fn();
        renderWithI18n(<ICSImporter onImport={onImport} />);
        fireEvent.click(screen.getByText(/Importar Horario \(.ics\)/));

        fireEvent.drop(getDropZone(), { dataTransfer: { files: [makeFile('schedule.ics', VALID_ICS)] } });

        await waitFor(() => {
            expect(screen.getByText('Pre-visualizacao')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Importar Horario'));
        expect(onImport).toHaveBeenCalledTimes(1);
    });
});
