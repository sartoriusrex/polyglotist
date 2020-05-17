# Polyglotist

last update: May 15, 2020

This is a full-stack monolithic project using Typescript, React, Redux, Node.js, Express, Webpack, Babel, & PostgresQL. It was built with input from the [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack) repo and inspiration from [Tania Rascia's](https://www.taniarascia.com/) blog and [post on authentication](https://www.taniarascia.com/).

- [Polyglotist](#polyglotist)
  - [Introduction](#introduction)
  - [Development](#development)

## Introduction

The application's purpose is to improve reading comprehension and vocabulary for intermediate foreign language learners by reading current events articles from foreign language magazines and newspapers. The problem this application solves is integrating foreign language dictionaries, flash-card style word review, and text reading.

Users can look up word or phrase definitions by highlighting them using the cursor. Once looked up, users can save the word for review later. Saving a word saves the word or phrase itself, its definition(s), a reference to the article the word was looked up from. Saved words can be reviewed using a spaced-reptition algorithm which tracks definition and use recall of the word.

As of the last update, the application only currently supports French. Spanish and German will follow.

## Development

Implementation of development can be found at the repo [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack).

```bash
#run development servers
npm run dev
```

Contributions with constructive feedback are welcome.
