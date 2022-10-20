import dotenv from 'dotenv';
dotenv.config({});

const DEBUG: boolean = (process.env.DEV_ENV || 'DEBUG') === 'DEBUG';
const PORT = process.env.PORT || 3000;
const BASEURL = DEBUG ? `http://localhost:${PORT}` : 'https://fritter-demo.vercel.app/';
const {MONGO_SRV} = process.env;

export {
  DEBUG, PORT, BASEURL, MONGO_SRV
};
