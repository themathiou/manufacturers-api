export enum MANUFACTURER_ID {
  'ASUS' = 'asus',
  'SAMSUNG' = 'samsung',
  'LG' = 'lg'
}

export enum CATEGORY_ID {
  'PHONES' = 'phones',
  'MONITORS' = 'monitors'
}

export interface Manufacturer {
  id: MANUFACTURER_ID;
  siteUrl: string;
}

export interface BaseProductModel {
  title: string;
  id: string;
  link: string;
  price: string;
}

export interface CategoryInfo {
  manufacturerId: MANUFACTURER_ID;
  category: CATEGORY_ID;
  models: BaseProductModel[];
}