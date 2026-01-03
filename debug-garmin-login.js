require('dotenv').config({ path: '.env.local' });
const { GarminConnect } = require('garmin-connect');

async function testLogin() {
    console.log('--- DEBUG START ---');

    const email = process.env.GARMIN_EMAIL;
    const password = process.env.GARMIN_PASSWORD || process.env.GARMIN_PASS;

    console.log('--- ENV CHECK ---');
    console.log('Email type:', typeof email);
    console.log('Email val:', email ? `"${email}"` : 'UNDEFINED'); // Show quotes to check for double quoting
    console.log('Pass type:', typeof password);

    if (!email || !password) {
        console.error('CRITICAL: Credentials missing from process.env');
        return;
    }

    console.log('Instantiating GarminConnect...');
    const GC = new GarminConnect();
    console.log('GC Instantiated. Logging in...');

    try {
        await GC.login(email, password);
        console.log('SUCCESS: Login worked!');
    } catch (err) {
        console.error('FAILURE: Login failed.');
        console.error(err);
    }
}

testLogin();
