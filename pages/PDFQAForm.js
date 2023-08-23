import React, { useRef, useState } from 'react';
import styles from '../styles/PDFQAForm.module.css';

const PDFQAForm = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [question, setQuestion] = useState('');
    const quesRef = useRef();

    const handlePdfUpload = (event) => {
        const uploadedFile = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            const pdfData = event.target.result;
            // Store PDF data in sessionStorage
            sessionStorage.setItem('pdfData', pdfData);
        };
        reader.readAsArrayBuffer(uploadedFile);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setQuestion(quesRef.current.value);
        console.log(question);
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
                <h2>Answer</h2>
                <div className={styles.answerText}>{"answer"}</div>
            </div>
        </div>
    );
};

export default PDFQAForm;
