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

            // Crear una copia del elemento para manipularlo sin afectar el original
            const clonedElement = element.cloneNode(true);
            document.body.appendChild(clonedElement);
            clonedElement.style.position = 'absolute';
            clonedElement.style.left = '-9999px';
            clonedElement.style.transform = 'none';
            
            // Asegurarse de que todos los elementos sean visibles
            Array.from(clonedElement.getElementsByTagName('*')).forEach(el => {
                const styles = window.getComputedStyle(el);
                if (styles.display === 'none') {
                    el.style.display = 'block';
                }
                if (parseFloat(styles.opacity) < 1) {
                    el.style.opacity = '1';
                }
            });

            // @ts-ignore
            const canvas = await window.html2canvas(clonedElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true,
                foreignObjectRendering: true,
                removeContainer: false,
                backgroundColor: '#ffffff',
                imageTimeout: 0,
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < elements.length; i++) {
                        const el = elements[i];
                        const style = window.getComputedStyle(el);
                        el.style.color = style.color;
                        el.style.backgroundColor = style.backgroundColor;
                        el.style.borderColor = style.borderColor;
                    }
                }
            });

            // Limpiar el elemento clonado
            document.body.removeChild(clonedElement);
            
            const imgData = canvas.toDataURL('image/png', 1.0);

            // @ts-ignore
            const pdf = new window.jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a3',
                compress: true,
                precision: 16
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Ajustar márgenes y tamaño
            const margin = 5;
            pdf.addImage(
                imgData, 
                'PNG', 
                margin,
                margin,
                pdfWidth - (margin * 2),
                pdfHeight - (margin * 2),
                undefined,
                'FAST'
            );

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