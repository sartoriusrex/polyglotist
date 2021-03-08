import { useState, useEffect } from 'react';

const useSelection = () => {
    const [selection, setSelection] = useState<null | string>(null);

    useEffect(() => {
        function handleSelect() {
            // let phrase: string | undefined;
            const phraseSelection = window.getSelection();
            const phrase = phraseSelection?.toString() || '';

            setSelection(phrase)
        
            // if (phraseSelection !== null) {
            //     phrase = phraseSelection.toString();
            // } else {
            //     phrase = undefined;
            // }
        
            // // Phrase can also be an empty string, so we much explicity check that
            // if (phrase === null || phrase === undefined) {
            //     if (saveState !== 'idle') closeDefinitionModal();
            // } else {
            //     if (phrase === '') closeDefinitionModal();
            //     setHighlightedPhrase(phrase);
            // }
        }
    
        document.addEventListener('selectionchange', handleSelect);
    
        return () => document.removeEventListener('selectionchange', handleSelect);
      }, []);

    return {
        selection
    }
}

export default useSelection;