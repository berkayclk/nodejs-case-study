import { findByDateAndCountRanges } from './record.DAL';
import { recordRangeRequest } from './record.validators';
import { ApiResponse } from '../../models';

export const findByDateAndCountRangesHandler = async (req, res, next) => {
    try {
        await recordRangeRequest.validateAsync(req.body);

        const { minCount, maxCount, startDate, endDate } = req.body;

        const records = await findByDateAndCountRanges(
            startDate,
            endDate,
            minCount,
            maxCount
        );

        const response = new ApiResponse(records);
        res.json(response);
    } catch (err) {
        next(err);
    }
};
