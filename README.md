# Setting up Development Environment

## Dependencies

### Node.js

You will need [Node.js](https://nodejs.org/en/) on your computer

### Project dependencies

Once you have Node, navigate to the project folder and run the following to install dependencies used by the project

```bash
npm install
```

Depending on when you do this, there may be issues with legacy peer dependencies as React went from 17 to 18. You can fix this by running

```bash
npm install --legacy-peer-deps
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

# Opinionated Decisions

I'm (Kevin) not entirely sure about best practices for various decisions made in this project, and if there are known best practices that conflict with these it may be a good idea to refactor and change these in the future

## Context

There are currently two different Context providers, one for settings and one for Firebase's authentication and sign-in. These are found in the `contexts` folder, and wrap the `<main />` element in `app/layout.tsx`

## Type Definitions

There are no files that hold global type definitions for types that are used throughout the project. E.g., `ClientDoc` is defined in `app\profile\[userId]\page.tsx` and used in many other files as this is the Type for what the Firestore database expects. We could consider having a file just for these types for better organization

## Babel vs SWC

Due to Jest and Vercel the project currently uses both Babel and SWC. Ideally we'd only use SWC but I couldn't figure out how to make Jest work nicely without Babel

## Queries with no Filter

Currently if the user searches with no filters (first name, last name, and/or birthday) then the first 50 clients will be returned. We should discuss if this functionality should even be allowed. If it is, ideally we paginate data so the user can eventually click through all users, but a limit should still be in place to prevent having too many document reads as one client returned is one document read

## Default settings behavior

Settings are saved as temporary local state as well as on the database. This allows for behavior where if the site is open on computer A and B, they will both receive the database's values on load. If A modifies their settings without clicking "Save as default", then A and B will have different settings.

Checks and validations for actions are performed against the local set of settings; this is to prevent A from changing settings on the database and B not knowing that validation settings have been changed while in the middle of performing an action
