import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './definePhraseButton.module.scss';

const DefinePhraseButton = () => {
  const [highlightedWord, setHighlightedWord] = useState<HighlightedWord>(null);
  const [defBoxOpen, setDefBoxOpen] = useState<Boolean>(false);
  const location = useLocation();

  type HighlightedWord = null | string;

  function handleDefineClick(e) {
    e.stopPropagation();
    setDefBoxOpen(true);
    // This block of commented replaces the anchornode text with the same text, but with the highlighted word in mark tags. Until I think of a solution to handle this in the db and clientside, this is not yet a feasible feature

    // const selection = window.getSelection();
    // const { anchorNode, anchorOffset } = selection;
    // const anchorNodeText = anchorNode.textContent;
    // const newTextBefore = anchorNodeText.slice(0, anchorOffset);
    // const newTextAfter = anchorNodeText.slice(
    //   anchorOffset + highlightedWord.length
    // );
    // const newText = `${newTextBefore} <mark>${highlightedWord}</mark> ${newTextAfter}`;
    // console.log(newText);

    console.log(highlightedWord);
  }

  function handleModalClick() {
    setDefBoxOpen(false);
    console.log('this better fucking work');
  }

  // add event listener for when user selects text
  useEffect(() => {
    function handleSelect() {
      let word: string | undefined = window.getSelection()?.toString();

      if (word === null || word === undefined) {
        return;
      } else {
        setHighlightedWord(word);
      }
    }

    document.addEventListener('selectionchange', handleSelect);

    return () => document.removeEventListener('selectionchange', handleSelect);
  }, []);

  // Because this is rendered the Authapp/index, higher up, only render the component if the location state contains an article (in articledetailpage)
  if (location.state === undefined || location.state.article === undefined)
    return <></>;

  return (
    <>
      <div
        className={
          !defBoxOpen ||
          !highlightedWord ||
          highlightedWord === null ||
          highlightedWord === ''
            ? styles.grayOverlay
            : `${styles.grayOverlay} ${styles.grayOverlayOpen}`
        }
        onClick={() => handleModalClick()}
      ></div>
      <div
        className={
          highlightedWord === null || highlightedWord === ''
            ? `${styles.defContainer} ${styles.defContainerHidden}`
            : styles.defContainer
        }
        onClick={() => setDefBoxOpen(false)}
      >
        <button
          onClick={(e) => handleDefineClick(e)}
          className={styles.definePhraseButton}
        >
          Define Phrase
        </button>
        {defBoxOpen && (
          <section className={styles.definitionContainer}>
            <em>{highlightedWord}</em>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui et,
              minima necessitatibus quisquam culpa laborum nihil suscipit,
              beatae explicabo in veniam quod soluta, ratione corrupti iure nisi
              labore debitis adipisci?
            </p>
          </section>
        )}
      </div>
    </>
  );
};

export default DefinePhraseButton;
