import fs from 'fs';

// Read the English messages
const enMessages = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));

// Get all other language files
const languageFiles = fs.readdirSync('./messages/')
  .filter(file => file.endsWith('.json') && file !== 'en.json');

// Function to add missing keys from English while preserving existing translations
function addMissingKeys(existingObj, sourceObj) {
  for (const key in sourceObj) {
    if (sourceObj.hasOwnProperty(key)) {
      if (sourceObj[key] !== null && typeof sourceObj[key] === 'object' && !Array.isArray(sourceObj[key])) {
        if (!existingObj[key]) {
          // If the key doesn't exist in the target, add the entire structure
          existingObj[key] = JSON.parse(JSON.stringify(sourceObj[key]));
        } else {
          // If it exists but is an object, recursively add missing keys
          addMissingKeys(existingObj[key], sourceObj[key]);
        }
      } else if (!existingObj.hasOwnProperty(key)) {
        // Only add the key if it doesn't exist in target (leaf values)
        existingObj[key] = sourceObj[key];
      }
    }
  }
  return existingObj;
}

// Add the new conversion-related messages to other language files
languageFiles.forEach(file => {
  const filePath = `./messages/${file}`;
  const langMessages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Add missing conversion-related keys while preserving existing translations
  addMissingKeys(langMessages, enMessages);

  // Write updated messages back to file
  fs.writeFileSync(filePath, JSON.stringify(langMessages, null, '\t'));
  console.log(`Updated ${file}`);
});

console.log('All language files updated with conversion messages.');