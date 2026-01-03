const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');

console.log('Checking .env.local at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('File exists.');
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('--- Content Start ---');
    console.log(content);
    console.log('--- Content End ---');

    // Simple manual parse check
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.startsWith('GARMIN_EMAIL=')) console.log('Found GARMIN_EMAIL line');
        if (line.startsWith('GARMIN_PASS=')) console.log('Found GARMIN_PASS line');
    });

} else {
    console.error('File does NOT exist.');
}
