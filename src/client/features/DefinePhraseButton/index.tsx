import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './definePhraseButton.module.scss';
import { Article } from '../../interfaces';

const DefinePhraseButton = () => {
  const [highlightedWord, setHighlightedWord] = useState<HighlightedWord>(null);
  const [defBoxOpen, setDefBoxOpen] = useState<Boolean>(false);
  const location: {
    state: null | undefined | { article: Article };
  } = useLocation();

  type HighlightedWord = null | string;

  function handleDefineClick(e: React.MouseEvent) {
    e.stopPropagation();
    setDefBoxOpen(true);
    console.log(highlightedWord);
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
  }

  function closeDefinitionModal(e: React.MouseEvent) {
    setDefBoxOpen(false);
    e.stopPropagation();
  }

  // add event listener for when user selects text
  useEffect(() => {
    function handleSelect() {
      let word: string | undefined = window.getSelection()?.toString();

      if (word === null || word === undefined) {
        return;
      } else {
        if (word === '') setDefBoxOpen(false);
        setHighlightedWord(word);
      }
    }

    document.addEventListener('selectionchange', handleSelect);

    return () => document.removeEventListener('selectionchange', handleSelect);
  }, []);

  // Because this is rendered the Authapp/index, higher up, only render the component if the location state contains an article (in articledetailpage)
  if (
    location.state === null ||
    location.state === undefined ||
    location.state.article === undefined
  )
    return <></>;

  return (
    <>
      <div
        aria-hidden={defBoxOpen ? false : true}
        className={
          defBoxOpen
            ? `${styles.grayOverlay} ${styles.grayOverlayOpen}`
            : styles.grayOverlay
        }
        onClick={(e) => closeDefinitionModal(e)}
      ></div>

      <div
        className={
          highlightedWord === null || highlightedWord === '' //no word highlighted, don't show anything
            ? styles.defineButtonContainerHidden
            : !defBoxOpen //user highlighted word, but has not clicked define phrase yet, show button only
            ? styles.defineButtonContainerClosed
            : // show the entire box if defBox is open and there is a word highlighted
              styles.defineButtonContainer
        }
      >
        <button
          onClick={(e) => handleDefineClick(e)}
          className={styles.definePhraseButton}
          aria-hidden={
            highlightedWord === null || highlightedWord === '' ? true : false
          }
        >
          Define Phrase
        </button>
      </div>

      <section
        className={
          defBoxOpen && highlightedWord !== null && highlightedWord !== ''
            ? styles.definitionContainerOpen
            : styles.definitionContainer
        }
        onClick={(e) => closeDefinitionModal(e)}
        aria-hidden={
          defBoxOpen && highlightedWord !== null && highlightedWord !== ''
            ? false
            : true
        }
      >
        <em>{highlightedWord}</em>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui et,
          minima necessitatibus quisquam culpa laborum nihil suscipit, beatae
          explicabo in veniam quod soluta, ratione corrupti iure nisi labore
          debitis adipisci?
        </p>
      </section>
    </>
  );
};

export default DefinePhraseButton;
