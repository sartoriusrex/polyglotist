import React from 'react';

import styles from './timer.module.scss';

const Timer = ({time} : {time: number}) => {
    const warn = time < 10;
    const seconds = time === 1 ? 'seconds' : 'second';

    return (
        <time className={styles.timer}>
            Time Remaining: 
            <span className={ warn ? styles.warning : '' }> {time} {seconds}</span>
        </time>
    )
}

export default Timer;