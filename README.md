# BioGRID ACE
The annotation and curation engine for the BioGRID. This project manages interaction with the various BioGRID related apis and applications.

## Requirements
* GIT 2.23+ (https://git-scm.com/download)
* Node.js 10.16.3+ (https://nodejs.org/en/)

## .env file variables
+ `VUE_APP_AUTH_URL` (url to authentication API)
+ `VUE_APP_ACE_WEBSOCKET` (url to websocket API)
+ `VUE_APP_ACE_URL` (url to curation API)
+ `VUE_APP_ANNOTATION_URL` (url to annotation API)
+ `VUE_APP_SEARCH_URL` (url to search API)

## Project Setup for Development
1. Manually install all of the requirements listed above
2. Create a directory for development
3. Clone this repository `git clone git@github.com:BioGRID/BioGRID-ACE.git`
4. Create a `.env.development.local` and `.env.production.local` file to match your setup using the descriptions above in the .env file variables section
5. Run `npm install` to install all dependencies
6. Run `npm run electron:serve` to launch the application with hotloading
7. Run `npm run electron:build` to compile the application for your platform