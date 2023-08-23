import { useState } from "react";
import QuestionForm from "../components/questionForm";

function QuestionPage() {
    const [response, setResponse] = useState({});
    const [isResponseNull, setIsResponseNull] = useState(true);
    async function questionPageSubmitHandler(question) {
        console.log("b4 fetch");
        await fetch('/api/allInOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url:"https://lilianweng.github.io/posts/2023-06-23-agent/"
            , question: question }),
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
        <QuestionForm questionPageSubmitHandler={questionPageSubmitHandler} />
        {!isResponseNull && <p>{response.response.text}</p>}
    </div>
}
export default QuestionPage;