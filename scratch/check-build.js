import fs from 'fs';
const file = 'dist/assets/index-DN_fQRSP.js';
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, 'utf8');
  console.log('File size:', content.length, 'bytes');
  console.log('Contains zIndex: 1000 style:', content.includes('zIndex:1000') || content.includes('zIndex: 1000'));
  console.log('Contains zIndex: 1010 style:', content.includes('zIndex:1010') || content.includes('zIndex: 1010'));
} else {
  console.log('Build file does not exist');
}
