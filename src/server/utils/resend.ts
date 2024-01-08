import { Resend } from 'resend';
const path = require('node:path');

require('dotenv').config({path: path.join(__dirname, "../../../.env")})

const resend = new Resend(process.env.RESEND_APY_KEY);

export default resend