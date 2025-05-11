import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { updateZones } from '../utils/updateZones.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current GeoJSON file
const geojsonPath = path.join(__dirname, '../../public/data/zipcodes.geojson');
const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

// Update the zones
const updatedGeojson = updateZones(geojsonData);

// Write the updated GeoJSON back to the file
fs.writeFileSync(geojsonPath, JSON.stringify(updatedGeojson, null, 2)); 