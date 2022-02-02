import rTracer from 'cls-rtracer';
import { Request, Response } from 'express';

import { AVAILABLE_MANUFACTURERS } from '../config/manufacturers.const';
import ManufacturersHelpers from '../helpers/manufacturers.helpers';
import { CategoryInfo } from '../models/manufacturer.model';

const getManufacturers = async (req: Request, res: Response): Promise<void> => {
  const requestId = rTracer.id();
  try {
    res.status(200).json({ data: AVAILABLE_MANUFACTURERS, requestId });
  } catch (error) {
    res.status(500).json({ error, requestId });
  }
};

const getCategoryModels = async (req: Request, res: Response): Promise<void> => {
  const { manId, catId } = req.params;
  const requestId = rTracer.id();

  try {
    const data: CategoryInfo[] = ManufacturersHelpers.readFile(manId);
    const models = data.filter(cat => ManufacturersHelpers.filterCategories(cat, manId, catId));

    res.status(200).json({ models, requestId });
  } catch (error) {
    res.status(500).json({ error, requestId });
  }
};

const getCategoryModelDetails = async (req: Request, res: Response): Promise<void> => {
  const data: CategoryInfo[] = ManufacturersHelpers.readFile(req.params.manId);

  const { manId, catId, modelId } = req.params;
  const model = ManufacturersHelpers.getModelDetails(data, manId, catId, modelId);
  const requestId = rTracer.id();

  try {
    const specs = await ManufacturersHelpers.scrapModelDetails(manId, model);

    res.status(200).json({ specs, requestId });
  } catch (error) {
    res.status(500).json({ error, requestId });
  }
};

export { getManufacturers, getCategoryModelDetails, getCategoryModels };