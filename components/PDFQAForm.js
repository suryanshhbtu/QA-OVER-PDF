import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from './PDFQAForm.module.css';
import Loader from './loader';
import PDFUpload from './pdfUploadBox';
import AlertBox from './AlertBox';

const PDFQAForm = (props) => {

    const [response, setResponse] = useState({ response: { text: "" } });
    const quesRef = useRef();
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfName, setPdfName] = useState('Select PDF');
    const [base64Pdf, setBase64Pdf] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAlertNoPDF, setShowAlertNoPDF] = useState(false);

    useEffect(() => {
        // Retrieve PDF data from Session Storage
        if (pdfFile) {
            handleProcessPdf();
        }
    }, [pdfFile]);
    const handlePdfUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setPdfName(uploadedFile.name);
            console.log("EVENT " + (uploadedFile.name));
        }
        setPdfFile(uploadedFile);

    };

    function handleProcessPdf() {
        if (pdfFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Pdf = btoa(reader.result);
                setBase64Pdf(base64Pdf);
            };
            reader.readAsBinaryString(pdfFile);
        }
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // handleProcessPdf();
        console.log(quesRef.current.value);
        if (pdfFile) {
            handleProcessPdf();
            questionPageSubmitHandler();
        } else {
            setShowAlertNoPDF(true);
        }
    };

    function hideAlertHandler() {
        setShowAlertNoPDF(false);
    }


    async function fetchHandler() {
        setIsLoading(true);
        await fetch('/api/allInOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pdfData: base64Pdf
                , question: quesRef.current.value
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((data) => {
            setResponse(data);
            // console.log(data);
            setIsLoading(false);
            // console.log(response);
        }).catch((err) => {
            console.log("Error InFetch");
            console.error("Error : ", err);
        })
    }
    async function questionPageSubmitHandler() {

        setResponse({ response: { text: "Generating..." } })
        await fetchHandler();

    }
    return (
        <Fragment >

            {showAlertNoPDF && <AlertBox hideAlertHandler={hideAlertHandler} message="Please upload a PDF before searching for questions." />}

            <div className={styles.container}>
                <h1 className={styles.title}>Welcome to PDFQuest</h1>
                <p className={styles.description}>
                    Your Interactive PDF Question and Answer Hub
                </p>
                <h4>Upload PDF and Ask a Question</h4>
                <div className={styles.pdfUpload}>
                    <PDFUpload handlePdfUpload={handlePdfUpload} pdfName={pdfName} />
                </div>
                <form className={styles.form} onSubmit={onSubmitHandler}>
                    <label className={styles.label}>Question:</label>
                    <textarea
                        className={styles.input}
                        ref={quesRef}
                        defaultValue="write question here"
                        onClick={(e) => { if (e.target.value === 'write question here') e.target.value = '' }}
                    />

                    <button type="submit" className={styles.button}>
                        Submit
                    </button>
                </form>
                <div className={styles.loader}></div>
                {isLoading && <Loader />}
                <div className={styles.answerArea}>
                    <h3>Answer</h3>
                    <div className={styles.answerText}>{response.response.text}</div>
                </div>
            </div>
        </Fragment>
    );
};

export default PDFQAForm;
