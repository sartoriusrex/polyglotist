import React from 'react';

import styles from './phrases.module.scss';

const PhrasesIcon = ({ active }: { active: boolean }) => {
  const activeColor: string = '#653CAD';
  const inactiveColor: string = '#147D64';

  return (
    <svg
      width="25"
      height="32"
      viewBox="0 0 25 32"
      fill="none"
      version="1.1"
      id="svg3767"
    >
      <defs id="defs3771" />
      <text
        className={styles.aContainer}
        fill={active ? activeColor : inactiveColor}
        x="0.96603739"
        y="15.350943"
        id="text3781"
      >
        <tspan
          id="tspan3779"
          x="0.96603739"
          y="15.350943"
          className={styles.aLetter}
          fill={active ? activeColor : inactiveColor}
        >A
        </tspan>
      </text>
      <text
        className={styles.bContainer}
        fill={active ? activeColor : inactiveColor}
        x="8.7257271"
        y="21.463799"
        id="text3781-3"
      >
        <tspan
          id="tspan3779-6"
          x="8.7257271"
          y="21.463799"
          className={styles.bLetter}
          fill={active ? activeColor : inactiveColor}
        >B
        </tspan>
      </text>
      <text
        className={styles.cContainer}
        fill={active ? activeColor : inactiveColor}
        x="15.289423"
        y="25.882668"
        id="text3781-3-7"
      >
        <tspan
          id="tspan3779-6-5"
          x="15.289423"
          y="25.882668"
          className={styles.cLetter}
          fill={active ? activeColor : inactiveColor}
        >C
        </tspan>
      </text>
    </svg>
  );
};

export default PhrasesIcon;
