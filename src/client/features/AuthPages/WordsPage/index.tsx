import React from 'react';

const WordsPage = () => {
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
    try {
      const response = await fetch(
        '/api/words',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section>
      <h1>Words Page</h1>
      <button onClick={() => fetchOnePhrase('test')}>Fetch 1 phrase</button>
      <button onClick={() => fetchPhrases()}>Fetch phrases</button>
    </section>
  )
}

export default WordsPage;