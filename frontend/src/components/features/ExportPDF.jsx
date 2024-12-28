import React, { useEffect } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

const ExportPDF = ({ targetRef, fileName = 'control-asistencia' }) => {
    useEffect(() => {
        // Cargar scripts desde CDN
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        ]).catch(console.error);
    }, []);

    const exportToPDF = async () => {
        try {
            const element = targetRef.current;
            // @ts-ignore
            const canvas = await window.html2canvas(element, {
                scale: 2,
                logging: false,
                useCORS: true
            });
            
            const imgData = canvas.toDataURL('image/png');
            // @ts-ignore
            const pdf = new window.jspdf.jsPDF({
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