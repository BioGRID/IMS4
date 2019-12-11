# BioGRID ACE
The annotation and curation engine for the BioGRID.

## Requirements (for windows)
* GIT 2.23+ (https://git-scm.com/download/win)
* Node.js 10.16.3+ (https://nodejs.org/en/)

## Project Setup
1. Create a new file `.env.development.local` and `.env.production.local` and fill in the environment variable `VUE_APP_AUTH_URL=http://example.com:1234` matching your AUTH API location.
2. Run `npm install`
3. Using the `.env.production-example` file as an example, create a new file `.env.production` and fill in the appropriate details as suited to your environment where you intend to run this API.
3. Make sure you have `go-dep` installed for installation of go dependencies.
4. Run `dep ensure` from this repository root to obtain all dependencies. 
4. Run `make` at the command prompt to build the executable for API.
5. Copy the created `app` executable to your chosen environment.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
