import React, { useState, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import styles from './definePhraseButton.module.scss';
import {
  Article,
  HighlightedPhrase,
  TranslationState,
  TranslationAction,
  SaveState,
} from '../../interfaces';
import { authSelector } from '../../slices/auth';

import GoogleAttribution from '../../images/GoogleAttr';

const DefinePhraseButton = () => {
  const [highlightedPhrase, setHighlightedPhrase] = useState<HighlightedPhrase>(
    ''
  );
  const [defBoxOpen, setDefBoxOpen] = useState<Boolean>(false);
  const location: {
    state: null | undefined | { article: Article };
  } = useLocation();
  const { user } = useSelector(authSelector);
  const lang = location.state?.article?.language;

  const translationInitState: TranslationState = {
    status: 'idle',
    error: '',
    translation: '',
  };

  function transReducer(state: TranslationState, action: TranslationAction) {
    switch (action.type) {
      case 'fetching':
        return {
          ...state,
          status: 'fetching',
        };
        break;
      case 'fetchSuccess':
        return {
          ...state,
          status: 'success',
          translation: action.translation,
        };
        break;
      case 'fetchError':
        return {
          ...state,
          status: 'error',
          error: action.error,
        };
        break;
      default:
        return { ...state };
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

    if (highlightedPhrase === '') return;

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
        translation: serverTranslationResponse.translation,
      });
    } catch (err) {
      console.warn(err);

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
    const langCodes: { [language: string]: string } = {
      french: 'fr',
      spanish: 'es',
      und: 'und',
    };

    const codeResult = langCodes[location.state?.article?.language || 'und'];

    switch (defState.status) {
      case 'idle':
        return null;
        break;
      case 'fetching':
        return <p>...Translating Text</p>;
        break;
      case 'error':
        return <p>{defState.error}</p>;
      case 'success':
        return (
          <>
            <p lang={`en-x-mtfrom-${codeResult}`}>{defState.translation}</p>
            <GoogleAttribution />
          </>
        );
        break;
      default:
        return null;
    }
  };

  const [saveState, setSaveState] = useState<SaveState>('idle');

  async function handlePhraseSave() {
    const url = location.state?.article?.url;

    // Grab the entire phrase.
    const selection = window.getSelection();
    const { anchorNode, anchorOffset } = selection;
    const { textContent } = anchorNode;

    // Start at the beginning and loop through each character until reading the anchorOffset (start of selection text). If a period is found, the starting index is at the first period + 1
    let start = 0;
    for (let i = 0; i < anchorOffset; i++) {
      if (textContent[i] === '.') start = i + 1;
    }

    // Start at the selection and look for a period. If there is no period AFTER the selection, the end is the end of the textContent, otherwise it is the index of that period + 1 (because slice is exclusive)
    const end =
      textContent.indexOf('.', anchorOffset) === -1
        ? textContent.length - 1
        : textContent.indexOf('.', anchorOffset) + 1;

    const context = textContent.slice(start, end);

    console.log(`start: ${start} \n end: ${end} \n context: ${context}`);

    if (!highlightedPhrase || !url || defState.translation === '') return;

    setSaveState('saving');

    const body = {
      username: user.username,
      articleURL: url,
      translation: defState.translation,
      context,
    };

    // console.log(body);

    // try {
    //   const response = await fetch(`/api/words/${lang}/${highlightedPhrase}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(body),
    //   });

    //   const saveSuccess = await response.json();

    //   setSaveState('success');
    // } catch (err) {
    //   setSaveState('error');
    // }
  }

  function handleCancelSave() {
    setDefBoxOpen(false);
    setHighlightedPhrase('');
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
        setHighlightedPhrase(phrase);
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
          highlightedPhrase === '' //no word highlighted, don't show anything
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
          aria-hidden={highlightedPhrase === '' || defBoxOpen ? true : false}
        >
          Translate with Google
        </button>
        <div
          className={
            defBoxOpen ? styles.saveContainerOpen : styles.saveContainerHidden
          }
          aria-hidden={defBoxOpen ? false : true}
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
          defBoxOpen && highlightedPhrase !== ''
            ? styles.definitionContainerOpen
            : styles.definitionContainer
        }
        aria-hidden={defBoxOpen && highlightedPhrase !== '' ? false : true}
      >
        <em>{highlightedPhrase}</em>
        <TranslationResults />
      </section>
    </>
  );
};

export default DefinePhraseButton;
