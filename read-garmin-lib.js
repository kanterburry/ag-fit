const fs = require('fs');
const path = require('path');

const filePath = path.join('node_modules', 'garmin-connect', 'dist', 'garmin', 'GarminConnect.js');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find line with "login ="
    const index = lines.findIndex(l => l.includes('login ='));

    if (index !== -1) {
        console.log('--- FOUND login = at line ' + (index + 1) + ' ---');
        // print 20 lines starting from there
        for (let i = index; i < Math.min(index + 20, lines.length); i++) {
            console.log((i + 1) + ': ' + lines[i]);
        }
    } else {
        console.log('Could not find "login =" in file.');
    }

} catch (err) {
    console.error(err);
}
