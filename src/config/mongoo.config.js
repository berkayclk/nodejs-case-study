const { MONGO_HOST, MONGO_DB, MONGO_USER, MONGO_PASS } = process.env;
export default {
    host: MONGO_HOST,
    db: MONGO_DB,
    user: MONGO_USER,
    pass: MONGO_PASS,
};
