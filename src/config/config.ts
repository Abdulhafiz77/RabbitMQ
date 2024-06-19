import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    msgBrokerURL: process.env.MSG_BROKER_URL,
    db: {
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT  
    }
};

export default config;