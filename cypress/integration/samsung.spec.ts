/// <reference types="cypress" />

import { AVAILABLE_MANUFACTURERS } from '../../src/config/manufacturers.const';
import {
    BaseProductModel, CATEGORY_ID, MANUFACTURER_ID
} from '../../src/models/manufacturer.model';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

context('Scrap Samsung website', () => {
  const { id: manId, siteUrl } = AVAILABLE_MANUFACTURERS.find(x => x.id === MANUFACTURER_ID.SAMSUNG);
  const mockDBFile = `src/mockDB/${manId}.json`;

  // mapping object between categories of API and Samsung website categories.
  const categoriesMap = {
    'smartphones': CATEGORY_ID.PHONES,
    'monitors': CATEGORY_ID.MONITORS,
  }

  beforeEach(() => {
    cy.viewport(1900, 1200);
    cy.visit(`${siteUrl}`);
  });

  it('read data', () => {
    // init-reset file
    cy.writeFile(mockDBFile, '[');
    getModelsOfCategory(1, true); // 'Smartphones'
    cy.writeFile(mockDBFile, ',', { flag: 'a+' });
    getModelsOfCategory(13); // 'Monitors'
    cy.writeFile(mockDBFile, ']', { flag: 'a+' });
  });

  const getModelsOfCategory = (categoryIndex: number, chooseFeatureCategory = false) => {
    const data = {
      manufacturerId: manId,
      category: '',
      models: []
    }

    // get categories from footer (links only)
    // - click and visit category
    cy.get(`.footer-column__item:nth-child(2) ul li:nth-child(${categoryIndex}) a`).invoke('text')
      .then(text => {
        const categoryLabel = text.replace('\n', '').trim().toLowerCase()
        data.category = categoriesMap[categoryLabel];
      })
    cy.get(`.footer-column__item:nth-child(2) ul li:nth-child(${categoryIndex}) a`).click();

    // - select a random feature category (to show more info)
    if (chooseFeatureCategory) {
      cy.get('.nv14-visual-lnb__featured-item:nth-child(2) a', { timeout: 40000 }).click({ force: true });
    }

    // - read basic info for model and keep link to details page. 
    cy.get('.product-card-v2__item', { timeout: 40000 }).then((products: any) => {
      for (let i = 0; i < products.length; i++) {
        const temp: BaseProductModel = { title: '', id: '', link: '', price: '' };
        cy.get(products).eq(i).within(() => {

          cy.get('.product-card-v2__name-text').invoke('text').then(title => {
            temp.title = title.trim();
            temp.id = title.trim().replace(/\W|\s/gi, '').toLowerCase();
          });

          cy.get('.product-card-v2__price').invoke('text').then(price => {
            const sanitized = price.replace(/\n/gi, '').trim();
            temp.price = sanitized;
          });

          cy.get('a.cta.cta--outlined').invoke('attr', 'href').then(attrs => {
            temp.link = attrs;
          });

        })
        data.models.push(temp);
      }

      // append data to file
      cy.writeFile(mockDBFile, data, { flag: 'a+' });
    });
  }

});