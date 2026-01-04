const fs = require('fs');

const inputFilePath = 'Extension/data/WikiItems.json';
const outputDir = 'Extension/data/split/';
const maxFileSize = 4 * 1024 * 1024; // 4 MB
const itemsPerFile = 4000;

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
const items = Object.entries(data); // Convert to array of [key, value] pairs

let fileIndex = 0;
let currentFileSize = 0;
let currentItems = [];

items.forEach(([key, value]) => {
    const itemSize = Buffer.byteLength(JSON.stringify({ [key]: value }), 'utf8');

    // Check if adding this item exceeds the max file size
    if (currentFileSize + itemSize > maxFileSize || currentItems.length >= itemsPerFile) {
        // Write the current items to a new file
        fs.writeFileSync(`${outputDir}WikiItems_part_${fileIndex}.json`, JSON.stringify(Object.fromEntries(currentItems), null, 2));
        fileIndex++;
        currentItems = [];
        currentFileSize = 0;
    }

    // Add the current item to the list
    currentItems.push([key, value]);
    currentFileSize += itemSize;
});

// Write any remaining items to the last parts file
if (currentItems.length > 0) {
    fs.writeFileSync(`${outputDir}WikiItems_part_${fileIndex}.json`, JSON.stringify(Object.fromEntries(currentItems), null, 2));
}

console.log(`Split WikiItems.json into ${fileIndex + 1} files.`);