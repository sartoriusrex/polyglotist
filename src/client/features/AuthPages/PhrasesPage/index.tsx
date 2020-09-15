import React from 'react';
import { fetchAllPhrases } from 'client/slices/phrases';

const PhrasesPage = () => {
  async function fetchOnePhrase(phrase: String) {
    try {
      const response = await fetch(
        `/api/words/${phrase}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchPhrases() {
    fetchAllPhrases();
  }

  return (
    <section>
      <h1>Phrases Page</h1>
      <button onClick={() => fetchOnePhrase('test')}>Fetch 1 phrase</button>
      <button onClick={() => fetchPhrases()}>Fetch phrases</button>
      <h2>More Words</h2>
    </section>
  )
}

export default PhrasesPage;