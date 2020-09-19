import Joi from 'joi';

export const recordRangeRequest = Joi.object({
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    minCount: Joi.number().min(0).required(),
    maxCount: Joi.number().min(0).required(),
});
