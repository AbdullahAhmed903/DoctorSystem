import CONFIG from "../../config/config.js";

const userName=CONFIG.DB_USERNAME;
const password=CONFIG.DB_PASSWORD;
const cluster=CONFIG.DB_CLUSTER;
const dbName=CONFIG.DB_NAME;

const url=`mongodb+srv://${userName}:${password}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export default {url};