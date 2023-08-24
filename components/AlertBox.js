
import styles from './AlertBox.module.css'; // Import CSS module for styling

function AlertBox(props) {


    return (
        <div className={styles.alertContainer}>
            <div className={styles.overlay}>
                <div className={styles.alertBox}>
                    <p>{props.message}</p>
                    <button className={styles.closeButton} onClick={props.hideAlertHandler}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}


export default AlertBox;
