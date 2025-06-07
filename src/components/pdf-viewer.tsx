// 'use client';
// import { useState } from 'react';
// import { pdfjs } from 'react-pdf';
//
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
//
// export default function PDFViewer() {
//
//   const [file, setFile] = useState('./sample.pdf');
//   const [numPages, setNumPages] = useState(null);
//
//   function onFileChange(event) {
//     setFile(event.target.files[0]);
//   }
//
//   function onDocumentLoadSuccess({ numPages: nextNumPages }) {
//     setNumPages(nextNumPages);
//   }
//
//   return (
//       <div>
//           <object
//               data="/assets/sample.pdf"
//               type="application/pdf"
//               width="100%"
//               height="100%"
//               className="min-h-[800px] rounded"
//           >
//               <p>
//                   Your browser does not support PDFs.
//                   <a href="/assets/sample.pdf" download>Download the PDF</a>
//                   .
//               </p>
//           </object>
//       </div>
//   );
// }
