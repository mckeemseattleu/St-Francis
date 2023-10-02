# ST. FRANCIS HOUSE SEATTLE

St. Francis House charity's web application project will provide an efficient and effective tool for managing client check-ins, improving the charity's operations and service delivery to those in need. The application will be designed to streamline the check-in process, reduce wait times, and provide better tracking and analysis of client data.

## Introduction
The web-based application facilitates efficient client management by enabling staff members to locate existing clients in the database or create new client records for upcoming visits. Upon check-in, the system captures the client's demographic details, including their name, age, gender, dependents, and living conditions. Upon completion of essential services, such as obtaining clothing, household items, bus tickets, or financial assistance, the system records the services and products provided to the client. Additionally, the system stores client visit history, services received, and staff notes to generate a comprehensive report that can help ascertain if a client is arriving early for their next visit.

## Contributing
This project uses [Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)  workflow for branching.
<img src="https://wac-cdn.atlassian.com/dam/jcr:34c86360-8dea-4be4-92f7-6597d4d5bfae" width="500"/>
*(Feature Branches, [atlassian.com](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow))*

**Branching**
- Branch naming convention: `main`, `dev` , `feature/*`, `hotfix/*`
- Feature may branch off from:  `dev`
- Hotfix may branch off from: `main`

**Merging**
- Feature branches must merge back into:  `dev`
- Hotfix branches must merge back into: `dev` and `main`

> **Note:**
> Release is currently done by merging `dev` into `main`. Going forward create a `release/*` from `dev` when new version is ready, then merge into `main` and back into `dev`.  - 05/10/2023

**Pull Request Process**
1. Ensure latest  `dev`  branch are merged in 
2. Ensure all tests are passing `npm run test`.
3. Ensure console logs are removed, and format code styling  `npm run format`
4. Ensure no lint warning `npm run lint` and no build error `npm run build`
5. Create a pull request and request at least one reviewer
7. Pull Request may be merged once approved.

# GETTING STARTED

## Installation
**Requirements:** [Node.js](https://nodejs.org/en/), [Git](https://git-scm.com/), [Yarn](https://yarnpkg.com/) (optional)
*You will need to install these requirements on your local machine*

**Clone St-Francis project**
```bash
	git clone https://github.com/Kevinjchang98/St-Francis.git
	cd St-Francis
```
Install St-Francis using `npm`
```bash
	npm install  [--legacy-peer-deps]
```
Start the development server
```bash
	npm  run  dev
```
*You should then have a link that you can visit in your browser. 
By default it will be* http://localhost:3000

## Environment Variables
To run this project, you will need to add the following environment variables to your `.env.local` file

    NEXT_PUBLIC_FIREBASE_API_KEY = your-key-here
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your-domain-here
    NEXT_PUBLIC_FIREBASE_PROJECT_ID = your-project-id-here
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your-link-here
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your-id-here
    NEXT_PUBLIC_FIREBASE_APP_ID = your-id-here
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = your-id-here
    
*Don't push or expose these keys to GitHub or anywhere public. This file should be ignored by `.gitignore` already*

## Configuration
### Path Mapping

Path mapping is used to provide convenient module import and improve code readability.

	// tsconfig.json
    "baseUrl":  ".",
    "paths":  {    
	    "@/firebase/*":  ["firebase/*"],
	    "@/components/*":  ["components/*"],  
	    "@/app/*":  ["app/*"],
	    "@/hooks/*":  ["hooks/*"],
	    "@/providers/*":  ["providers/*"],
	    "@/styles/*":  ["styles/*"],
	    "@/utils/*":  ["utils/*"],
	    "@/models/*":  ["models/*"]
    },

## Tech stack

<a href="https://github.com/Kevinjchang98/St-Francis">
	<img src="https://skillicons.dev/icons?i=ts,next,jest,firebase,vercel" />
</a>

### Front end

[Next.js 13](https://nextjs.org/) with the `app` directory routing structure, and [TypeScript](https://www.typescriptlang.org/)
[Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [ts-jest](https://kulshekhar.github.io/ts-jest/) is used for unit testing.
[React Query](https://tanstack.com/query/v3/) is used for data fetching and caching

### Backend

[Vercel](https://vercel.com/) is used for hosting of the front-end
[Firestore](https://cloud.google.com/firestore) is used for the database. 
[Firebase Authentication](https://firebase.google.com/products/auth) is used for authentication

## Design Decisions

### Folder Structure

    .
    ├── __tests__
    ├── app					# next pages
    ├── components			# ui components
    ├── firebase			# firebase initialization
    ├── hooks				# react custom hooks
    ├── models				# database models
    ├── providers			# global contexts
    ├── styles				# global css
    └── utils				# utilities such as data fetching, validation, etc.

### Providers & Contexts

There are currently four different providers, including settings, Firebase's authentication (sign-in, sign-out, etc), global alert, and react query client. These are found in the `providers` folder. The exported combined providers wraps the `<Main />` element in root layout `app/layout.tsx`
```jsx
// app/layout.tsx
<Providers>
	<Layout>{children}</Layout>
</Providers>
```
```jsx
// providers/index.ts
 <AuthProvider>
      <QueryClientProvider client={queryClient}>
          <AlertProvider>
              <SettingsProvider>{children}</SettingsProvider>
          </AlertProvider>
      </QueryClientProvider>
  </AuthProvider>
```
### Type Definitions

`Client`, `Visit` and `Setting` type definitions are used throughout the project can be found in `models\index.d.ts`. These types are use for objects fetched from Firebase database and is immutable. Make a copy these objects for various purpose e.g., using forms  

### Queries, Mutations, and Data Fetching

TBA

### Default Settings

TBA

### Client Validation

TBA