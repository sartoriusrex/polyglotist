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

        const title = screen.getByText('Article Title 1');

        expect(title).toBeInTheDocument();
    })
})