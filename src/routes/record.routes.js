import { Router } from 'express';
import { RecordControllers, RecordMiddlewares } from '../api/components/record';

const router = Router();

router.get('/?', RecordControllers.findAllHandler);

router.post(
    '/findByDateAndCount',
    RecordMiddlewares.validateDateAndCountRange,
    RecordControllers.findByDateAndCountRangesHandler
);

export default router;
