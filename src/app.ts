import rTracer from 'cls-rtracer';
import cors from 'cors';
import express from 'express';

import manufacturersRoutes from './routes/manufacturers.routes';

const app = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(rTracer.expressMiddleware())
app.use(manufacturersRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
