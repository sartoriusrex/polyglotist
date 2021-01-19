import React from 'react';

import styles from './timer.module.scss';

const Timer = ({time} : {time: number}) => {

    return (
        <time className={styles.timer}>Time Remaining: 
            <span className={ time < 10 ? styles.warning : '' }> {time}</span>
        </time>
    )
}

export default Timer;