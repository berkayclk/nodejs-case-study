import Records from '../../../models/record';

/**
 * fetches all records from db
 * @return {Promise<[Records]>}
 */
export const findAll = async () => {
    return Records.aggregate()
        .project({
            _id: 0,
            key: 1,
            createdAt: 1,
            totalCount: {
                $sum: '$counts',
            },
        })
        .sort({
            totalCount: -1,
        });
};

/**
 * fetches records according to range of the date and count.
 * @param startDate {Date}
 * @param endDate {Date}
 * @param minCount {number}
 * @param maxCount {number}
 * @return {Promise<[Records]>}
 */
export const findByDateAndCountRanges = async (
    startDate,
    endDate,
    minCount,
    maxCount
) => {
    return Records.aggregate()
        .match({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        })
        .project({
            _id: 0,
            key: 1,
            createdAt: 1,
            totalCount: {
                $sum: '$counts',
            },
        })
        .match({
            totalCount: {
                $gte: minCount,
                $lte: maxCount,
            },
        })
        .sort({
            totalCount: -1,
        });
};
