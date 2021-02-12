import { STATUS_CODES } from 'http';
import React from 'react';
import TestRouter from 'test-router';
import { render, screen, fireEvent, cleanup } from 'test-utils';

import ArticleCard from './index';
import { sources } from '../SourceList';

import { articles } from 'states';

afterEach(() => cleanup);



describe('ArticleCard Component', () => {
    test('Renders 2 article cards with their props', () => {
        const { container } = render( 
            <TestRouter>
                {articles.articles.map( article => {
                    return (
                        <ArticleCard
                            key={article.title}
                            article={article}
                            count={2}
                            sourceId={article.source}
                            showNumber={2}
                            username={'example_user'}
                        />
                    )
                })}
            </TestRouter>
        )

        const title1 = screen.getByText('Article Title 1');
        const title2 = screen.getByText('Article Title 2');

        expect(title1).toBeInTheDocument();
        expect(title2).toBeInTheDocument();

        // const date1 = screen.getByText('')

        // expect(date1).toBeInTheDocument();

        const wordCount1 = screen.getByText('9 Words');
        const wordCount2 = screen.getByText('6 Words');

        expect(wordCount1).toBeInTheDocument();
        expect(wordCount2).toBeInTheDocument();

        const sourceName1 = screen.getByText('Le Monde');
        const sourceName2 = screen.getByText('20 Minutos');

        expect(sourceName1).toBeInTheDocument();
        expect(sourceName2).toBeInTheDocument();
    })
})