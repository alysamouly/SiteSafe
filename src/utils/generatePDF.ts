import jsPDF from 'jspdf';
import { InspectionRecord } from '../context/AppContext';

export function generateInspectionPDF(inspection: InspectionRecord) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Colors
    const dark = [17, 17, 17] as [number, number, number];
    const accent = [230, 59, 46] as [number, number, number];
    const gray = [100, 100, 100] as [number, number, number];
    const lightGray = [200, 200, 200] as [number, number, number];

    // Header bar
    doc.setFillColor(...dark);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SITESAFE AI INSPECTOR', margin, 18);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('COMPLIANCE REPORT', margin, 26);
    doc.text(inspection.id, pageWidth - margin, 18, { align: 'right' });
    doc.text(inspection.date, pageWidth - margin, 26, { align: 'right' });

    y = 55;

    // Inspection Details Section
    doc.setTextColor(...dark);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INSPECTION DETAILS', margin, y);
    y += 2;
    doc.setDrawColor(...accent);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 40, y);
    y += 10;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);

    const details = [
        ['Inspection ID', inspection.id],
        ['Site', inspection.site],
        ['Inspector', inspection.inspector],
        ['Date', inspection.date],
        ['Hazards Detected', String(inspection.hazards)],
    ];

    details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...dark);
        doc.text(label.toUpperCase(), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        doc.text(value, margin + 55, y);
        y += 7;
    });

    y += 5;

    // AI Reasoning Section
    if (inspection.reasoning) {
        doc.setTextColor(...dark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('AI REASONING', margin, y);
        y += 2;
        doc.setDrawColor(...accent);
        doc.line(margin, y, margin + 30, y);
        y += 10;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...gray);
        const reasoningLines = doc.splitTextToSize(inspection.reasoning, contentWidth);
        doc.text(reasoningLines, margin, y);
        y += reasoningLines.length * 5 + 10;
    }

    // Hazards Section
    if (inspection.hazardDetails.length > 0) {
        // Check if we need a new page
        if (y > 220) {
            doc.addPage();
            y = margin;
        }

        doc.setTextColor(...dark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('IDENTIFIED HAZARDS', margin, y);
        y += 2;
        doc.setDrawColor(...accent);
        doc.line(margin, y, margin + 35, y);
        y += 10;

        inspection.hazardDetails.forEach((hazard, idx) => {
            // Check if we need a new page
            if (y > 250) {
                doc.addPage();
                y = margin;
            }

            // Hazard card background
            doc.setFillColor(248, 248, 248);
            doc.roundedRect(margin, y - 4, contentWidth, 50, 3, 3, 'F');

            // Hazard number
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...accent);
            doc.text(String(idx + 1).padStart(2, '0'), margin + 5, y + 8);

            // Hazard type
            doc.setFontSize(11);
            doc.setTextColor(...dark);
            doc.text(hazard.type.toUpperCase(), margin + 20, y + 8);

            // Severity badge
            const severityColor = hazard.severity === 'High' ? [220, 38, 38] as [number, number, number] :
                hazard.severity === 'Medium' ? [217, 119, 6] as [number, number, number] :
                    [22, 163, 74] as [number, number, number];
            doc.setFillColor(...severityColor);
            doc.roundedRect(pageWidth - margin - 25, y, 25, 8, 2, 2, 'F');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text(hazard.severity.toUpperCase(), pageWidth - margin - 12.5, y + 5.5, { align: 'center' });

            // Description
            doc.setFontSize(8);
            doc.setTextColor(...gray);
            doc.setFont('helvetica', 'normal');
            const descLines = doc.splitTextToSize(hazard.description, contentWidth - 25);
            doc.text(descLines, margin + 20, y + 16);

            // Regulation & Mitigation
            doc.setFontSize(7);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...dark);
            doc.text('REGULATION:', margin + 20, y + 30);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...gray);
            doc.text(hazard.regulation, margin + 48, y + 30);

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...dark);
            doc.text('MITIGATION:', margin + 20, y + 36);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...gray);
            const mitLines = doc.splitTextToSize(hazard.mitigation, contentWidth - 70);
            doc.text(mitLines, margin + 48, y + 36);

            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...dark);
            doc.text('CONFIDENCE:', margin + 20, y + 42);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...gray);
            doc.text(`${Math.round(hazard.confidence * 100)}%`, margin + 48, y + 42);

            y += 56;
        });
    }

    // Disclaimer at bottom
    if (y > 240) {
        doc.addPage();
        y = margin;
    }

    y += 10;
    doc.setFillColor(255, 245, 245);
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'S');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accent);
    doc.text('DISCLAIMER', margin + 5, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    const disclaimerText = 'This report is generated by AI and supplements manual safety checks. It does not guarantee identification of all hazards. Personnel must remain cautious and exercise independent judgment at all times while on site. The user is solely responsible for verifying all safety assessments.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
    doc.text(disclaimerLines, margin + 5, y + 14);

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...lightGray);
        doc.text(`SiteSafe AI Inspector — ${inspection.id}`, margin, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    }

    doc.save(`${inspection.id}_${inspection.site.replace(/\s+/g, '_')}_Report.pdf`);
}
