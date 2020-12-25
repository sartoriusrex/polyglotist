import React from 'react';

import styles from './practicePage.module.scss';

const PracticePage = () => {
  return(
    <section className={styles.practicePage}>
      <h1>Practice Vocabulary</h1>
      <div className="languageSection">
        <h2>Languages</h2>
        {/* List languages, including all */}
      </div>

      <div className="modeSection">
        <h2>Mode</h2>
        <div className="input-group">
            <input type="radio" id="untimed" name="untimed" value="untimed" defaultChecked />
            <label htmlFor="untimed">Untimed</label>
        </div>
        <div className="input-group">
            <input type="radio" id="untimed" name="untimed" value="untimed" />
            <label htmlFor="untimed">Timed</label>
        </div>
      </div>

      <button>Start</button>
    </section>
  )
}

export default PracticePage;