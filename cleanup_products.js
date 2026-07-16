const fs = require('fs');
const path = './data/products.json';
let products = JSON.parse(fs.readFileSync(path, 'utf8'));

const legacyKeys = [
  'generalSpecs', 'designSpecs', 'networkSpecs', 'dataSpecs',
  'messagingSpecs', 'batterySpecs', 'softwareSpecs', 'hardwareSpecs',
  'displaySpecs', 'mediaSpecs', 'cameraSpecs'
];

products = products.map(product => {
  if (product.specs) {
    legacyKeys.forEach(key => {
      if (product.specs[key]) {
        delete product.specs[key];
      }
    });
  }
  return product;
});

fs.writeFileSync(path, JSON.stringify(products, null, 2));
console.log("Legacy mock specs stripped from products.json");
