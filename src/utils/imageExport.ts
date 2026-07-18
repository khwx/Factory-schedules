import html2canvas from 'html2canvas';

/**
 * Export an HTML element as a PNG image
 */
export async function exportElementAsImage(
    element: HTMLElement,
    filename: string = 'shiftsim_export.png',
    options?: {
        backgroundColor?: string;
        scale?: number;
        padding?: number;
    }
): Promise<void> {
    const canvas = await html2canvas(element, {
        backgroundColor: options?.backgroundColor || '#ffffff',
        scale: options?.scale || 2,
        logging: false,
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

/**
 * Export a DOM ref as image with branded header
 */
export async function exportWithBranding(
    element: HTMLElement,
    title: string,
    filename?: string
): Promise<void> {
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.background = '#ffffff';
    wrapper.style.fontFamily = 'Inter, system-ui, sans-serif';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #3B82F6';
    header.innerHTML = `
        <div style="width:36px;height:36px;background:#3B82F6;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px">SS</div>
        <div>
            <div style="font-size:16px;font-weight:bold;color:#1F2937">ShiftSim Factory</div>
            <div style="font-size:11px;color:#6B7280">${title} — ${new Date().toLocaleDateString('pt-PT')}</div>
        </div>
    `;
    wrapper.appendChild(header);
    wrapper.appendChild(element.cloneNode(true));

    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top:16px;padding-top:8px;border-top:1px solid #E5E7EB;font-size:10px;color:#9CA3AF;text-align:center';
    footer.textContent = 'Gerado por ShiftSim Factory — www.shiftsim.com';
    wrapper.appendChild(footer);

    document.body.appendChild(wrapper);

    try {
        const canvas = await html2canvas(wrapper, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true,
        });

        const link = document.createElement('a');
        link.download = filename || `${title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } finally {
        document.body.removeChild(wrapper);
    }
}
