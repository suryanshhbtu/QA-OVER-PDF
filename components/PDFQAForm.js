import React, { useRef, useState } from 'react';
import styles from '../styles/PDFQAForm.module.css';


const PDFQAForm = (props) => {
    const quesRef = useRef();
    const [pdfFile, setPdfFile] = useState(null);

    const handlePdfUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setPdfFile(uploadedFile);
    };

    const handleProcessPdf = () => {
        if (pdfFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Pdf = btoa(reader.result);
                sessionStorage.removeItem('pdfData');
                sessionStorage.setItem('pdfData', base64Pdf);
                console.log('PDF stored in sessionStorage');
            };
            reader.readAsBinaryString(pdfFile);
        }
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        handleProcessPdf();
        console.log(quesRef.current.value);
        props.questionPageSubmit(quesRef.current.value);
    };

    return (
        <div className={styles.container}>
            <h2>Upload PDF and Ask a Question</h2>
            <div className={styles.pdfUpload}>
                <input type="file" accept=".pdf" onChange={handlePdfUpload} />
            </div>
            <form className={styles.form} onSubmit={onSubmitHandler}>
                <label className={styles.label}>Question:</label>
                <textarea
                    className={styles.input}
                    ref={quesRef}
                />

                <button type="submit" className={styles.button}>
                    Submit
                </button>
            </form>
            <div className={styles.answerArea}>
                <h3>Answer</h3>
                <div className={styles.answerText}>{props.text}</div>
            </div>
        </div>
    );
};

export default PDFQAForm;
