# Polyglotist

A Language Learning App for intermediate learners, where users can read foreign language newspapers without fluff, look up word and phrase definitions without leaving the articles, and save words for review or reference.

last update: Sep 07, 2020

This is a full-stack monolithic project using Typescript, React, Redux, Node.js, Express, Webpack, Babel, & PostgresQL and running on Docker. It was built with input from the [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack) repo and inspiration from [Tania Rascia's](https://www.taniarascia.com/) blog and her [post on authentication](https://www.taniarascia.com/).

- [Polyglotist](#polyglotist)
  - [Introduction](#introduction)
  - [Development](#development)

## Introduction

The application's purpose is to improve reading comprehension and vocabulary for intermediate foreign language learners by reading current event articles from foreign language magazines and newspapers. The problem this application solves is allowing users to continue their flow of reading while learning new words. The application integrates foreign language newspapers with dictionaries and flash-card style reviews.

Users can look up word or phrase definitions by highlighting them using the cursor. Once looked up, users can save the word for review later. Saving a word inserts the word or phrase itself, its definition(s), the sentence from which it came from, and a reference to the article the word was looked up from into the database. Saved words can be reviewed using a spaced-reptition algorithm which tracks the word and the stregth of the users recall of the word.

As of the last update, the application only supports French and Spanish, with plans to adopt German and other languages after initial release.

## Development

The application makes user of environment variables, which will need to be created and linked on the developer's machine. Additionally, one will need one's own GOOGLE_CLOUD_API authentication key. See the [docs](https://cloud.google.com/translate/docs/) for more information. Once this is set up, one can develop locally.

Originally, the development implementation could be found at the repo [simple-react-full-stack](https://github.com/crsandeep/simple-react-full-stack). Currently users need to have Docker installed. To start, clone the repo and run the following commands:

```bash
# if you already have postgresql installed, the service must be stopped.
# On linux, one can achieve this by running the following command
sudo service postgresql stop

# confirm that postgresql has stopped
service postgresql status

#run development servers
sudo docker-compose -f docker-compose.dev.yml up --build

# if already built, you can just the above command without the --build flag

#run typechecking before compiling
npm run typecheck
```

docker-compose will start a postgresql service and link it with the application service, which has hot-reloading enabled with an aggregate timeout and polling each of 1000 ms to improve the container's performance.

Running the following code below will build a production-ready image, which is still currently being tweaked in webpack.

```bash
# builds production application with postgres service
sudo docker-compose up --build
```

Currently, Figma is used to prototype and mockup the frontend. One can view mockups from [here:](https://www.figma.com/file/E1SqSr0kkhiWNjqTokBLUw/Polyglotist-v1?node-id=0%3A1)

## Any Contributions With Constructive Feedback Are Welcome.
