# Setting up Development Environment

## Dependencies

### Node.js

You will need [Node.js](https://nodejs.org/en/) on your computer

### Project dependencies

Once you have Node, navigate to the project folder and run the following to install dependencies used by the project

```bash
npm install
```

### Environment variables

Secret tokens for accessing and modifying the database from the frontend need to be in a `.env.local` file in the project root folder. It has the following format.

```
NEXT_PUBLIC_FIREBASE_API_KEY = your-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-domain-here
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-link-here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your-id-here
NEXT_PUBLIC_FIREBASE_APP_ID = your-id-here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = your-id-here
```

Don't push or expose these keys to GitHub or anywhere public. This file should be ignored by `.gitignore` already

## Starting development server

After installing all dependencies, you can start the development server:

```bash
npm run dev
```

You should then have a link that you can visit in your browser. By default it will be

```
http://localhost:3000
```

# Tech stack

## Front end

This currently uses [Next.js 13](https://nextjs.org/) with the experimental `app` directory routing structure

The project uses [TypeScript](https://www.typescriptlang.org/)

Unit testing is done with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). [Babel](https://babeljs.io/) is used for compiling the TypeScript for the unit tests, but Next's Rust-based SWC is used for building the site

## Database

Google's [Firestore](https://cloud.google.com/firestore) is used for the database. It's a NoSQL document database in structure

## Authentication

Google's [Firebase Authentication](https://firebase.google.com/products/auth) is used for authentication

## Hosting

[Vercel](https://vercel.com/) is used for hosting of the front-end
