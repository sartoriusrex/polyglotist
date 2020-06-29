import React from 'react';

import styles from './loading.module.scss';

const LoadingIndicator = () => {
  return (
    <section className={styles.loadingSection}>
      <div className={styles.loadingContainer}>
        <svg
          id='svg8'
          version='1.1'
          viewBox='0 0 13.229166 2.6458334'
          height='10'
          width='50'
          class={styles.svg}
        >
          <defs id='defs2' />
          <metadata id='metadata5'></metadata>
          <g id='layer1'>
            <circle r='1.3229166' cy='1.3229166' cx='1.3229166' id='path833' />
            <circle
              id='path833-8'
              cx='6.6145835'
              cy='1.3229166'
              r='1.3229166'
            />
            <circle id='path833-9' cx='11.90625' cy='1.3229166' r='1.3229166' />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default LoadingIndicator;
