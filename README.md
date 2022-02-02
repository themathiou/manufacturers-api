# Inventory Service API

This project is consisted of two different parts.

1. Cypress.js project which scraps data from different manufacturers
2. A Node.js served API which provide info for the manufactures, categories and specific models.

The mock-data have been created using Cypress.js from manufacturers websites in order to emulate the human behaviour.

Spec details for each model, are fetched and generated ad-hoc, by scrapping server side the proper web-page for each model. The requested url has been fetched from the previous step and is stored in our mock-database. The data we have already fetch are from Samsung and Asus in Categories ‘Phones’ and ‘Monitors’.

---

## Crawling mechanism emulate human behaviour (w/ cypress.js)

To run the automation flow, run:

`yarn run cypress open`

and choose one of the two existing scenarios to execute.

---

## Inventory Service API (w/ node.js)

The app exposes 3 main routes and returns proper results based on the existing mock data.

1. `/manufacturers` - GET - serves mock data

2. `/manufacturers/:manId/category/:catId` - GET - serves mock data

3. `/manufacturers/:manId/category/:catId/model/:modelId` - GET - serves data that are created after scrapping the proper webpage

- manId: 'asus' | 'samsung'
- catId: 'phones' | 'monitors'
- modelId: string value, which can be found in the response of #2 endpoint as 'id'

#### examples

- /manufacturers
- /manufacturers/asus/category/phones
- /manufacturers/asus/category/phones/model/zenfone_8_flip

---

## What’s required to add a new manufacturer and it’s models

- Fetch data from website and feed our mock-database (proper files). In order to do it we have to add one more <manufacturerId>.spec.ts inside our cypress folder.

- Add proper helpers and mappers so the fetched data to comply with our models

- Add helper functions and use them in respective controllers

---

## Run the app locally

In the project directory, you should run:

`npm install`

`npm start`

Open [http://localhost:4000](http://localhost:4000) to view it in the browser

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
