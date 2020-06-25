import React, { useState, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './definePhraseButton.module.scss';
import {
  Article,
  HighlightedPhrase,
  DefinitionState,
  DefinitionAction,
} from '../../interfaces';

const DefinePhraseButton = () => {
  const [highlightedPhrase, sethighlightedPhrase] = useState<HighlightedPhrase>(
    null
  );
  const [defBoxOpen, setDefBoxOpen] = useState<Boolean>(false);
  const location: {
    state: null | undefined | { article: Article };
  } = useLocation();

  const defInitState: DefinitionState = {
    fetching: false,
    error: '',
    definitionObject: {},
  };

  function defReducer(state: DefinitionState, action: DefinitionAction) {
    switch (action.type) {
      case 'fetching':
        return {
          ...state,
          fetching: true,
        };
      case 'fetchSuccess':
        return {
          fetching: false,
          error: '',
          definitionObject: action.definitionObject,
        };
      default:
        return {
          fetching: false,
          error: action.error,
          definitionObject: {},
        };
    }
  }

  const [defState, defDispatch] = useReducer(defReducer, defInitState);

  async function handleDefineClick(e: React.MouseEvent) {
    e.stopPropagation();
    setDefBoxOpen(true);
    defDispatch({ type: 'fetching' });

    let lang = location.state?.article?.language;

    let definitionObject: any = await fetch(
      `/api/words/${lang}/${highlightedPhrase}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (definitionObject.error)
      return defDispatch({
        type: 'fetchError',
        error: definitionObject.error,
      });

    defDispatch({ type: 'fetchSuccess', definitionObject });

    // This block of commented replaces the anchornode text with the same text, but with the highlighted word in mark tags. Until I think of a solution to handle this in the db and clientside, this is not yet a feasible feature

    // const selection = window.getSelection();
    // const { anchorNode, anchorOffset } = selection;
    // const anchorNodeText = anchorNode.textContent;
    // const newTextBefore = anchorNodeText.slice(0, anchorOffset);
    // const newTextAfter = anchorNodeText.slice(
    //   anchorOffset + highlightedPhrase.length
    // );
    // const newText = `${newTextBefore} <mark>${highlightedPhrase}</mark> ${newTextAfter}`;
    // console.log(newText);
  }

  function handlePhraseSave() {
    console.log(highlightedPhrase);
  }

  function handleCancelSave() {
    console.log('Canceling Save');
    setDefBoxOpen(false);
    sethighlightedPhrase('');
  }

  function closeDefinitionModal(e: React.MouseEvent) {
    setDefBoxOpen(false);
    e.stopPropagation();
  }

  // add event listener for when user selects text
  useEffect(() => {
    function handleSelect() {
      let phrase: string | undefined = window.getSelection()?.toString();

      if (phrase === null || phrase === undefined) {
        return;
      } else {
        if (phrase === '') setDefBoxOpen(false);
        sethighlightedPhrase(phrase);
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
          highlightedPhrase === null || highlightedPhrase === '' //no word highlighted, don't show anything
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
            highlightedPhrase === null || highlightedPhrase === '' || defBoxOpen
              ? true
              : false
          }
        >
          Define Phrase
        </button>
        <div
          className={
            !defBoxOpen ? styles.saveContainerHidden : styles.saveContainerOpen
          }
          aria-hidden={!defBoxOpen ? true : false}
        >
          <button
            className={styles.savePhraseButton}
            onClick={handlePhraseSave}
          >
            Save
          </button>
          <button
            className={styles.cancelSaveButton}
            onClick={handleCancelSave}
          >
            X
          </button>
        </div>
      </div>

      <section
        className={
          defBoxOpen && highlightedPhrase !== null && highlightedPhrase !== ''
            ? styles.definitionContainerOpen
            : styles.definitionContainer
        }
        aria-hidden={
          defBoxOpen && highlightedPhrase !== null && highlightedPhrase !== ''
            ? false
            : true
        }
      >
        <em>{highlightedPhrase}</em>
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
