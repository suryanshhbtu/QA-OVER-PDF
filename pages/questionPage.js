import { useState } from "react";
import PDFQAForm from "../components/PDFQAForm";

import styles from '../styles/questionPage.module.css';
import Loader from "../components/loader";

function QuestionPage() {
    const [response, setResponse] = useState({ response: { text: "" } });
    const [isResponseNull, setIsResponseNull] = useState(true);
    async function questionPageSubmitHandler(question) {
        console.log("b4 fetch");
        await fetch('/api/allInOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pdfData: sessionStorage.getItem("pdfData")
                , question: question
            }),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        }).then((data) => {
            setResponse(data);
            console.log(data);
            setIsResponseNull(false);
            console.log(response);

        }).catch((err) => {

            console.log("Error InFetch");
            console.error("Error : ", err);
        })
    }

    return <div>
        <div className={styles.page_container}>
            <div className={styles.title_container}>
                <h1 className={styles.title}>PDFQuest: Your Interactive PDF Question and Answer Hub</h1>
            </div>
        </div>
        <PDFQAForm questionPageSubmit={questionPageSubmitHandler} text={response.response.text} />
        <Loader />
    </div>
}
export default QuestionPage;