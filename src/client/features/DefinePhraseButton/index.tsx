import React, { useState, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './definePhraseButton.module.scss';
import {
  Article,
  HighlightedPhrase,
  TranslationState,
  TranslationAction,
} from '../../interfaces';

import GoogleAttribution from '../../images/GoogleAttr';

const DefinePhraseButton = () => {
  const [highlightedPhrase, sethighlightedPhrase] = useState<HighlightedPhrase>(
    null
  );
  const [defBoxOpen, setDefBoxOpen] = useState<Boolean>(false);
  const location: {
    state: null | undefined | { article: Article };
  } = useLocation();

  const translationInitState: TranslationState = {
    fetching: false,
    error: '',
    translation: '',
  };

  function transReducer(state: TranslationState, action: TranslationAction) {
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
          translation: action.translation,
        };
      default:
        return {
          fetching: false,
          error: action.error,
          translation: '',
        };
    }
  }

  const [defState, defDispatch] = useReducer(
    transReducer,
    translationInitState
  );

  async function handleDefineClick(e: React.MouseEvent) {
    e.stopPropagation();
    setDefBoxOpen(true);
    defDispatch({ type: 'fetching' });

    let lang = location.state?.article?.language;

    try {
      let response = await fetch(`/api/words/${lang}/${highlightedPhrase}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let serverTranslationResponse = await response.json();

      if (serverTranslationResponse.error) {
        return defDispatch({
          type: 'fetchError',
          error: serverTranslationResponse.error,
        });
      }

      return defDispatch({
        type: 'fetchSuccess',
        translation: serverTranslationResponse,
      });
    } catch (err) {
      return defDispatch({
        type: 'fetchError',
        error:
          'There was a problem grabbing the translation. Please try again.',
      });
    }
    // defDispatch({ type: 'fetchSuccess', translation });

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

  const TranslationResults = () => {
    const languageCodes: { [language: string]: string } = {
      french: 'fr',
      spanish: 'es',
      und: 'und',
    };

    const codeResult =
      languageCodes[location.state?.article?.language || 'und'];

    if (defState.fetching) return <p>...Fetching the Data...</p>;
    if (defState.error.length > 0) return <p>{defState.error}</p>;
    if (defState.translation.length > 0)
      return (
        <>
          <p lang={`en-x-mtfrom-${codeResult}`}>{defState.translation}</p>
          <GoogleAttribution />
        </>
      );
    return null;
  };

  function handlePhraseSave() {
    console.log(`saving ${highlightedPhrase}...`);
  }

  function handleCancelSave() {
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
          Translate with Google
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
        <TranslationResults />
      </section>
    </>
  );
};

export default DefinePhraseButton;
