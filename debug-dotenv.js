require('dotenv').config({ path: '.env.local' });

console.log('Parsed GARMIN_EMAIL:', process.env.GARMIN_EMAIL);
console.log('Parsed GARMIN_PASS:', process.env.GARMIN_PASS);

if (!process.env.GARMIN_EMAIL || !process.env.GARMIN_PASS) {
    console.error('FAILED TO PARSE CREDENTIALS');
} else {
    console.log('SUCCESSFULLY PARSED CREDENTIALS');
}
