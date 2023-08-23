import React, { useRef, useState } from 'react';
import styles from '../styles/questionForm.module.css';

const QuestionForm = (props) => {
  const quesRef = useRef();
  const [question, setQuestion] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log(quesRef.current.value);
    setQuestion(quesRef.current.value);
    props.questionPageSubmitHandler(quesRef.current.value);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Enter your question:</label>
        <input
          type="text"
          className={styles.input}
          ref={quesRef}
        />
        <button type="submit" className={styles.button} onSubmit={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
