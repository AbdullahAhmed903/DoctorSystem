import dotenv from 'dotenv';
dotenv.config();

// let CONFIG={}

// CONFIG.PORT=process.env.PORT || 3000;
// CONFIG.NODE_ENV=process.env.NODE_ENV || 'development';


// CONFIG.BASEURL=process.env.BASEURL || '/api/v1';

// CONFIG.LOG_FILE_LOCATION=process.env.LOG_FILE_LOCATION || './logs/doctor-system.log';


// CONFIG.DB_USERNAME = process.env.DB_NAME || "..";
// CONFIG.DB_NAME = process.env.DB_USER;
// CONFIG.DB_PASSWORD = process.env.DB_PASSWORD;
// CONFIG.DB_CLUSTER = process.env.DB_CLUSTER;



// CONFIG.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;
// CONFIG.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "abdullah15466";
// CONFIG.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";


// CONFIG.NODEMAILER_EMAIL_FROM = process.env.NODE_MAILER_EMAIL;
// CONFIG.NODEMAILER_API_KEY = process.env.NODE_MAILER_PASSWORD;

// CONFIG.IMAGE_KIT_PUBLIC_KEY = process.env.IMAGE_KIT_PUBLIC_KEY;
// CONFIG.IMAGE_KIT_PRIVATE_KEY = process.env.IMAGE_KIT_PRIVATE_KEY;
// CONFIG.IMAGE_KIT_URL_ENDPOINT = process.env.IMAGE_KIT_URL_ENDPOINT;


// export default Object.freeze(CONFIG);


// Using a class to manage configuration
// Singleton pattern to ensure single configuration instance
class CONFIG {
  constructor() {
    if (CONFIG.instance) return CONFIG.instance;

    this.PORT = process.env.PORT || 3000;
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.BASEURL = process.env.BASEURL || '/api/v1';
    this.LOG_FILE_LOCATION = process.env.LOG_FILE_LOCATION || './logs/doctor-system.log';

    this.VERCEL=process.env.VERCEL

    this.DB_USERNAME = process.env.DB_NAME || "..";
    this.DB_NAME = process.env.DB_USER;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_CLUSTER = process.env.DB_CLUSTER;

    this.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || 10;

    //Main Token
    this.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "abdullah15466";
    this.JWT_EXPIRES_TIME=process.env.JWT_EXPIRES_TIME
    this.JWT_EXPIRES_TIME_TYPE=process.env.JWT_EXPIRES_TIME_TYPE

    //Refresh Token
    this.JWT_REFRESH_SECRET_KEY = process.env.JWT_SECRET_KEY || "abdullah123498778";
    this.JWT_REFRESH_TIME=process.env.JWT_REFRESH_TIME
    this.JWT_REFRESH_TIME_TYPE=process.env.JWT_REFRESH_TIME_TYPE ||"m"

    this.VERIFICATION_CODE_SECRET=process.env.VERIFICATION_CODE_SECRET

    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

    this.NODEMAILER_EMAIL_FROM = process.env.NODE_MAILER_EMAIL;
    this.NODEMAILER_API_KEY = process.env.NODE_MAILER_PASSWORD;

    this.IMAGE_KIT_PUBLIC_KEY = process.env.IMAGE_KIT_PUBLIC_KEY;
    this.IMAGE_KIT_PRIVATE_KEY = process.env.IMAGE_KIT_PRIVATE_KEY;
    this.IMAGE_KIT_URL_ENDPOINT = process.env.IMAGE_KIT_URL_ENDPOINT;
    

    this.TWILIO_ACCOUNT_SID=process.env.TWILIO_ACCOUNT_SID
    this.TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
    this.TWILIO_PHONE_NUMBER=process.env.TWILIO_PHONE_NUMBER

    this.STRIP_KEY=process.env.STRIP_KEY
    this.ENDPOINT_SECRET=process.env.ENDPOINT_SECRET

    this.UPSTASH_REDIS_REST_URL=process.env.UPSTASH_REDIS_REST_URL
    this.UPSTASH_REDIS_REST_TOKEN=process.env.UPSTASH_REDIS_REST_TOKEN

    this.REDIS_URL=process.env.REDIS_URL


    CONFIG.instance = this;
  }
}

export default Object.freeze(new CONFIG());
