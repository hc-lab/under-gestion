import React, { useEffect } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ExportPDF = ({ targetRef, fileName = 'control-asistencia' }) => {
    useEffect(() => {
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
            toast.loading('Generando PDF...');
            const element = targetRef.current;
            
            // Configuración mejorada para html2canvas
            // @ts-ignore
            const canvas = await window.html2canvas(element, {
                scale: 3, // Aumentar la escala para mejor calidad
                useCORS: true,
                logging: false,
                allowTaint: true,
                foreignObjectRendering: true,
                letterRendering: true,
                removeContainer: true,
                backgroundColor: '#ffffff',
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);

            // @ts-ignore
            const pdf = new window.jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a3', // Cambiar a A3 para más espacio
                compress: true
            });

            // Calcular dimensiones manteniendo el aspect ratio
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Agregar márgenes y ajustar el tamaño
            const margin = 10; // 10mm de margen
            pdf.addImage(
                imgData, 
                'JPEG', 
                margin, // X
                margin, // Y
                pdfWidth - (margin * 2), // Ancho con márgenes
                pdfHeight - (margin * 2), // Alto con márgenes
                undefined,
                'FAST' // Mejor rendimiento
            );

            // Agregar metadatos
            pdf.setProperties({
                title: fileName,
                subject: 'Control de Asistencia',
                author: 'Sistema de Control',
                keywords: 'asistencia, control, reporte',
                creator: 'Sistema de Control'
            });

            pdf.save(`${fileName}.pdf`);
            toast.dismiss();
            toast.success('PDF generado exitosamente');
        } catch (error) {
            console.error('Error al exportar PDF:', error);
            toast.dismiss();
            toast.error('Error al generar el PDF');
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