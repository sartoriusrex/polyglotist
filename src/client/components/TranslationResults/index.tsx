import React from 'react';

import GoogleAttribution from '../../images/GoogleAttr';

const TranslationResults = (
    { 
        lang,
        defState
    } : { 
        lang: string, 
        defState: {
            status: string,
            error: string,
            translation: string,
        }
    }) => {
    const langCodes: { [language: string]: string } = {
      french: 'fr',
      spanish: 'es',
      undefined: 'und',
    };

    let codeResult: string = langCodes[lang]

    switch (defState.status) {
      case 'idle':
        return null;
      case 'fetching':
        return <p>...Translating Text</p>;
      case 'error':
        return <p>{defState.error}</p>;
      case 'success':
        return (
          <>
            <p lang={`en-x-mtfrom-${codeResult}`}>{defState.translation}</p>
            <GoogleAttribution />
          </>
        );
      default:
        return null;
    }
};

export default TranslationResults;