export const auth = {
    loading: false,
    hasErrors: false,
    user: {
        id: 4,
        username: 'username5',
        email: 'test5@test.com',
    },
}

export const settings =  {
    languagesLearning: ['french', 'spanish'],
}

export const phrases = {
    loading: false,
    hasErrors: false,
    phrases: [
        {
            phrase_id: 1,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 1, 
        },
        {
            phrase_id: 2,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 2, 
        },
        {
            phrase_id: 3,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-3',
            translation: 'example-3',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 3, 
        },
        {
            phrase_id: 4,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-4',
            translation: 'example-4',
            language: 'spanish',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 4, 
        },
        {
            phrase_id: 5,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-5',
            translation: 'example-5',
            language: 'spanish',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 5, 
        },
    ],
};

export const practice = {
    loadingQuestions: false,
    loadingResults: false,
    questionsHasErrors: false,
    resultsHasErrors: false,
    phrases: [
        {
            phrase_id: 1,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 1, 
        },
        {
            phrase_id: 2,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 2, 
        },
        {
            phrase_id: 3,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-3',
            translation: 'example-3',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 3, 
        },
        {
            phrase_id: 4,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-4',
            translation: 'example-4',
            language: 'spanish',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 4, 
        },
        {
            phrase_id: 5,
            created_at: '2016-06-22 19:10:25',
            last_practiced: '2016-06-22 19:10:25',
            phrase: 'example-5',
            translation: 'example-5',
            language: 'spanish',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 5, 
        },
    ],
    results: [
        { 
            phrase: 'example-1', 
            change: 0, 
            result: -1 
        },
        { 
            phrase: 'example-2', 
            change: 1, 
            result: 1 
        },
        { 
            phrase: 'example-3', 
            change: 0, 
            result: 1 
        },
    ],
}