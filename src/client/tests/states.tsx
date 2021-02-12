export const exampleDate = '2016-06-22 19:10:25';

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
    loading: false,
    hasErrors: false,
    themePreference: 'light',
    readingSpeed: 'slow',
    practiceMode: 'timed',
    notificationMethod: 'none',
    languagePreference: 'english',
    languagesLearning: ['french', 'spanish'],
    sources: [
        'monde',
        '20minutos',
    ]
}

export const phrases = {
    loading: false,
    hasErrors: false,
    phrases: [
        {
            phrase_id: 1,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 1, 
        },
        {
            phrase_id: 2,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 2, 
        },
        {
            phrase_id: 3,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-3',
            translation: 'example-3',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 3, 
        },
        {
            phrase_id: 4,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-4',
            translation: 'example-4',
            language: 'spanish',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 4, 
        },
        {
            phrase_id: 5,
            created_at: exampleDate,
            last_practiced: exampleDate,
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
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 1, 
        },
        {
            phrase_id: 2,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-1',
            translation: 'example-1',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 2, 
        },
        {
            phrase_id: 3,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-3',
            translation: 'example-3',
            language: 'french',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 3, 
        },
        {
            phrase_id: 4,
            created_at: exampleDate,
            last_practiced: exampleDate,
            phrase: 'example-4',
            translation: 'example-4',
            language: 'spanish',
            article: 'example title',
            context_phrase: 'an example in a phrase',
            strength: 4, 
        },
        {
            phrase_id: 5,
            created_at: exampleDate,
            last_practiced: exampleDate,
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

export const articles = {
    loading: false,
    haserrors: false,
    articles: [
        {
            title: 'Article Title 1',
            date: exampleDate,
            read: exampleDate,
            url: 'https://www.example.com',
            language: 'french',
            body: [
                ['p','example paragraph'],
                ['p','example paragraph'],
                ['p','example paragraph']
            ],
            source: 'monde'
        }, 
        {
            title: 'Article Title 2',
            date: exampleDate,
            read: exampleDate,
            url: 'https://www.example.com',
            language: 'spanish',
            body: [
                ['p','example paragraph'],
                ['p','example paragraph'],
                ['p','example paragraph']
            ],
            source: 'veinte'
        }
    ]
}

export const message = {
    message: "A test message"
}

export const newArticles = {
    loading: false,
    hasErrors: false,
    articles: [
        {
            title: 'Article Title 1',
            date: exampleDate,
            read: exampleDate,
            url: 'https://www.example.com',
            language: 'french',
            body: [
                ['p','example paragraph'],
                ['p','example paragraph'],
                ['p','example paragraph']
            ],
            source: 'monde'
        }, 
        {
            title: 'Article Title 2',
            date: exampleDate,
            read: exampleDate,
            url: 'https://www.example.com',
            language: 'spanish',
            body: [
                ['p','example paragraph'],
                ['p','example paragraph'],
                ['p','example paragraph']
            ],
            source: '20minutos'
        }  
    ]
}