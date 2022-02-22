A small API to generate shortened URLs (and retrieve them).

This code is from a tutorial on TDD with Typescript and Jest

https://levelup.gitconnected.com/tdd-with-typescript-and-jest-starter-project-cca94fd089f5

and

https://levelup.gitconnected.com/tdd-with-typescript-and-jest-url-shortener-6956e2387ce8

***

# Set up project

Ensure you have a suitable connection string for MongoDB.

```
git clone https://github.com/edpackard/url-shortener.git
npm install
touch .env
```

Inside the `.env` file, you will need to set two environment variables:

```
MONGO_URI=<Your connection string here>
PORT=<Any available port number>```
```

# Build project
  
`npm run build`

# Run tests

`npm run test`

# Run server

`node ./dist/server.js` or `nodemon ./dist/server.js`

# Use API

POST `/urls` with a JSON object i.e `{ "url": "https://www.google.co.uk"}` in the request body will generate a shortId, store the url/shortId pair in the database, and return these values.

<img width="658" alt="postrequest" src="https://user-images.githubusercontent.com/82502146/155167600-68ca05a9-972b-4bff-a53d-4aa513a5ed0c.png">

GET `/urls/:shortId` will convert shortId to url and redirect to that page.

<img width="798" alt="getrequest" src="https://user-images.githubusercontent.com/82502146/155167615-77843b92-dab5-43a4-97c9-461fa7842446.png">
