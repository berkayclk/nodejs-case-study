const { PORT, APP_URL, NODE_ENV } = process.env;
export default {
    APP_PORT: PORT || 8080,
    APP_URL,
    ENV: NODE_ENV,
};
