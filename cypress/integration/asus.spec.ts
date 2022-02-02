/// <reference types="cypress" />

import { AVAILABLE_MANUFACTURERS } from '../../src/config/manufacturers.const';
import { BaseProductModel, MANUFACTURER_ID } from '../../src/models/manufacturer.model';

context('Scrap Asus website', () => {
  const { id: manId, siteUrl } = AVAILABLE_MANUFACTURERS.find(x => x.id === MANUFACTURER_ID.ASUS);
  const mockDBFile = `src/mockDB/${manId}.json`;

  beforeEach(() => {
    cy.viewport(1900, 1200);
    cy.visit(`${siteUrl}`);
  });

  it('read data', () => {

    // Accept cookies // TODO: handle if it's not present
    cy.get('.cookie-btn-box .btn-ok').click();

    // init-reset file
    cy.writeFile(mockDBFile, '[');
    // iterate over categories (pick two random for example)
    getModelsOfCategory(6);
    cy.writeFile(mockDBFile, ',', { flag: 'a+' });
    getModelsOfCategory(7);
    cy.writeFile(mockDBFile, ']', { flag: 'a+' });


  });

  const getModelsOfCategory = (categoryIndex: number) => {
    const data = {
      manufacturerId: manId,
      category: '',
      models: []
    }

    // get categories from footer (links only)
    // - click and visit category
    cy.get('.Footer__productLintContent__3HvTQ .Footer__linkItem__1OACj a').eq(categoryIndex).invoke('text')
      .then(text => {
        data.category = text.replace('\n', '').trim().toLowerCase()
      })
    cy.get('.Footer__productLintContent__3HvTQ .Footer__linkItem__1OACj a').eq(categoryIndex).click();
    // - select first filter in "by category" (to show more info)
    cy.get('.SeriesFilter__listItem__2a7MM').eq(0).click();
    // - read info for model (first 3 elements) and keep link to details page. 
    cy.get('.product_list', { timeout: 40000 }).then((products: any) => {
      for (let i = 0; i < products.length; i++) {
        const temp: BaseProductModel = { title: '', id: '', link: '', price: '' };

        cy.get(products).eq(i).within(() => {
          cy.get('.headingRow h2').invoke('text').then(title => {
            temp.title = title.trim();
            temp.id = title.trim().replace(/ /gi, '_').toLowerCase();
          });

          cy.get('a.headingRow').invoke('attr', 'href').then(attrs => {
            temp.link = attrs;
          });

          cy.get('.ProductCardNormal__price__16J79').invoke('text').then(price => {
            const sanitized = price.replace(/\n/gi, '').trim();
            temp.price = sanitized;
          });
        })
        data.models.push(temp);
      }

      // append data to file
      cy.writeFile(mockDBFile, data, { flag: 'a+' });
    });
  }

});