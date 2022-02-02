import { Router } from 'express';

import {
    getCategoryModelDetails, getCategoryModels, getManufacturers
} from '../controllers/manufacturers.controller';

const manufacturersRoutes: Router = Router();

manufacturersRoutes.get("/manufacturers", getManufacturers);
manufacturersRoutes.get("/manufacturers/:manId/category/:catId", getCategoryModels);
manufacturersRoutes.get("/manufacturers/:manId/category/:catId/model/:modelId", getCategoryModelDetails);

export default manufacturersRoutes;