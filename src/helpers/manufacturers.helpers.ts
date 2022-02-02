import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

import { BaseProductModel, CategoryInfo } from '../models/manufacturer.model';

/**
 * Reads the file with the given manufacturer name and returns the data as a CategoryInfo array
 * @param {string} manufacturerName - string
 * @returns An array of CategoryInfo objects.
 */
function readFile(manufacturerName: string): CategoryInfo[] {
  const fileData = fs.readFileSync(`./src/mockDB/${manufacturerName}.json`, 'utf8');
  return JSON.parse(fileData);
}


/**
 * Given a list of categories, a manufacturer id, a category id, and a model id, return the model
 * details
 * @param {CategoryInfo[]} data - The data that you want to filter.
 * @param {string} manId - Manufacturer ID
 * @param {string} catId - The category ID of the model you want to get.
 * @param {string} modelId - The id of the model you want to get the details for.
 * @returns BaseProductModel or null
 */
function getModelDetails(data: CategoryInfo[], manId: string, catId: string, modelId: string): BaseProductModel | null {
  const models = data.filter(cat => filterCategories(cat, manId, catId))[0].models;

  return models.find(x => x.id === modelId) || null
}

/**
 * It filters the categories by manufacturer and category.
 * @param {CategoryInfo} category - CategoryInfo
 * @param {string} manId - The manufacturerId of the category you want to filter by.
 * @param {string} catId - string
 * @returns A boolean value.
 */
function filterCategories(category: CategoryInfo, manId: string, catId: string): boolean {
  return category.manufacturerId === manId && category.category === catId;
}

/**
 * It scrapes the model details of a product model
 * @param {string} manId - The manufacturer ID.
 * @param {BaseProductModel | null} model - BaseProductModel | null
 * @returns An array of objects with the key and value of the scraped data.
 */
function scrapModelDetails(manId: string, model: BaseProductModel | null): Promise<{ key: string; value: string; }[]> {
  if (!model) {
    return Promise.resolve([]);
  }

  switch (manId) {
    case 'asus':
      return scrapAsusProductModel(model.link);
    case 'samsung':
      return scrapSamsungProductModel(model.link);
    default:
      return Promise.resolve([]);
  }
}


/**
 * It scrapes the product model specs from the link provided.
 * @param {string} link - The link to the product page.
 * @returns An array of objects with the key and value of each spec.
 */
const scrapAsusProductModel = async (link: string): Promise<{ key: string; value: string; }[]> => {
  return await axios.get(`${link}techspec/`)
    .then(({ data }) => {

      const $ = cheerio.load(data);

      const allSpecs = (x: any) =>
        $('.TechSpec__techSpecContainer__GSlpY > div') // spec rows
          .map((_, spec) => {
            const $spec = $(spec);
            return {
              key: $spec.find('.TechSpec__title__2PR1t').text().replace('\n', '').trim(),
              value: $spec.find('.TechSpec__content__2E2e_').text(),
            };
          })
          .toArray(); // Convert cheerio object to array , 

      const specs: { key: string; value: string; }[] = allSpecs($);
      return specs;
    });
}

/**
 * It scrapes the product specs from the Samsung product page.
 * logic applies on specific views of current Samsung website.
 * @param {string} link - The link to the product page.
 * @returns An array of objects with the key and value of the spec.
 */
const scrapSamsungProductModel = async (link: string): Promise<{ key: string; value: string; }[]> => {
  return await axios.get(`https://www.samsung.com${link}`)
    .then(({ data }) => {
      const $ = cheerio.load(data);

      const allSpecs = (x: any) =>
        $('.spec-highlight__item') // highlighted specs
          .map((_, spec) => {
            const $spec = $(spec);
            return {
              key: $spec.find('.spec-highlight__title').text().replace('\n', '').trim(),
              value: $spec.find('.spec-highlight__value').text(),
            };
          })
          .toArray(); // Convert cheerio object to array , 

      const specs = allSpecs($);

      return specs;
    });
}

export default {
  readFile,
  getModelDetails,
  filterCategories,
  scrapModelDetails
}