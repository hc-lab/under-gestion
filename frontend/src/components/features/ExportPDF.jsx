import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DocumentIcon } from '@heroicons/react/24/outline';

const ExportPDF = ({ targetRef, fileName = 'control-asistencia' }) => {
    const exportToPDF = async () => {
        try {
            const element = targetRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${fileName}.pdf`);
        } catch (error) {
            console.error('Error al exportar PDF:', error);
        }
    };

    return (
        <button
            onClick={exportToPDF}
            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <DocumentIcon className="h-4 w-4 mr-1.5" />
            Exportar PDF
        </button>
    );
};

export default ExportPDF; 