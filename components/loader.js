
import styles from '../styles/loader.module.css';

function Loader() {
    return (
        <div>
            <div
                aria-label='Orange and tan hamster running in a metal wheel'
                role='img'
                className={`${styles.wheelandhamster}`}
            >
                <div className={`${styles.wheel}`}></div>
                <div className={`${styles.hamster}`}>
                    <div className={`${styles.hamsterbody}`}>
                        <div className={`${styles.hamsterhead}`}>
                            <div className={`${styles.hamsterear}`}></div>
                            <div className={`${styles.hamstereye}`}></div>
                            <div className={`${styles.hamsternose}`}></div>
                        </div>
                        <div
                            className={`${styles.hamsterlimb} ${styles.hamsterlimbfr}`}
                        ></div>
                        <div
                            className={`${styles.hamsterlimb} ${styles.hamsterlimbfl}`}
                        ></div>
                        <div
                            className={`${styles.hamsterlimb} ${styles.hamsterlimbbr}`}
                        ></div>
                        <div
                            className={`${styles.hamsterlimb} ${styles.hamsterlimbbl}`}
                        ></div>
                        <div className={`${styles.hamstertail}`}></div>
                    </div>
                </div>
                <div className={`${styles.spoke}`}></div>
            </div>
        </div>
    );
}
export default Loader;