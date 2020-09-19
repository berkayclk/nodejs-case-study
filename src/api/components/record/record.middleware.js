import { recordRangeRequestSchema } from './record.validators';

export const validateDateAndCountRange = async (req, res, next) => {
    try {
        await recordRangeRequestSchema.validateAsync(req.body);
    } catch (err) {
        const error = new ModelValidationError(err.message);
        next(error);
    }
    next();
};
