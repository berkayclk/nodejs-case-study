import moment from 'moment';
import { findAll, findByDateAndCountRanges } from './record.DAL';
import { ApiResponse } from '../../models';

export async function findAllHandler(req, res, next) {
    try {
        const records = await findAll();

        const response = new ApiResponse(records);
        res.json(response);
    } catch (err) {
        next(new UnexpectedError(err));
    }
}

export async function findByDateAndCountRangesHandler(req, res, next) {
    try {
        const { minCount, maxCount, startDate, endDate } = req.body;

        const minDate = moment(startDate).startOf('day').toDate();
        const maxDate = moment(endDate).endOf('day').toDate();

        const records = await findByDateAndCountRanges(
            minDate,
            maxDate,
            minCount,
            maxCount
        );

        const response = new ApiResponse(records);
        res.json(response);
    } catch (err) {
        next(new UnexpectedError(err));
    }
}
