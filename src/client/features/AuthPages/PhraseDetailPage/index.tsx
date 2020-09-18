import React from 'react';
import { useLocation } from 'react-router-dom';

import { IPhraseUnit } from '../../../interfaces';

const PhraseDetailPage = () => {
    const location = useLocation();
    console.log(location);
    // const title = phrase.phrase;

    return (
        <section>
            {/* <h1>{title}</h1> */}
        </section>
    )
}

export default PhraseDetailPage;