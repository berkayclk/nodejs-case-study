import { findByDateAndCountRanges } from './record.DAL';
import { ApiResponse } from '../../models';

export async function findByDateAndCountRangesHandler(req, res, next) {
    try {
        const { minCount, maxCount, startDate, endDate } = req.body;

        const records = await findByDateAndCountRanges(
            new Date(startDate),
            new Date(endDate),
            minCount,
            maxCount
        );

        const response = new ApiResponse(records);
        res.json(response);
    } catch (err) {
        next(new UnexpectedError(err));
    }
}
