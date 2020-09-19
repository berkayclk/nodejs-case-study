import { Router } from 'express';
import { findByDateAndCountRangesHandler } from '../api/components/record';

const router = Router();

router.post('/findByDateAndCount', findByDateAndCountRangesHandler);

export default router;
