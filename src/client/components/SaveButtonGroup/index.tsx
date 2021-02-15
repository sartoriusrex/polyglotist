import React from 'react';

import styles from './saveButtonGroup.module.scss';

import Check from '../../images/Check';

const SaveButtonGroup = ({
    saveState,
    handlePhraseSave,
    handleCancelSave
} : {
    saveState: string,
    handlePhraseSave: Function,
    handleCancelSave: Function
}) => {
    switch (saveState) {
      case 'saving':
        return <div className={styles.savingState}>Saving</div>;
      case 'success':
        return (
          <div className={styles.savingState}>
            Saved <Check />
          </div>
        );
      case 'error':
        return <div className={styles.savingState}>Oops..</div>;
      default:
        return (
          <>
            <button
              className={styles.savePhraseButton}
              onClick={() => handlePhraseSave()}
            >
              Save
            </button>
            <button
              className={styles.cancelSaveButton}
              onClick={() => handleCancelSave()}
            >
              X
            </button>
          </>
        );
    }
};

export default SaveButtonGroup;