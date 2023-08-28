# SmartBrain frontend with hooks
Frontend part of final project for _The Complete Web Developer in 2023: Zero to Mastery_ course. Since the course is a bit dated and was updated through the years, the React frontend remained class-based. That version you can see [here](https://github.com/dominoto/smart-brain). In this version I try to convert it to newer hooks-based approach.

The point of the project is to make a React frontend, node.js backend and PostgreSQL database as a small full-stack app that uses [Clarifai](https://www.clarifai.com/) API for face detection. It has:
+ login and registration pages
+ homescreen with URL input box for fetching the picture in which you want to detect a face
+ entries counter that counts how many times you searched for a face

How to use:
1. Clone this repo
2. Run `npm install`
3. Run `npm start`
4. You must add your own USER_ID, APP_ID and PAT keys in the `src/App.js` file to connect to Clarifai over REST endpoints.

Backend part is [here](https://github.com/dominoto/smart-brain-api).
