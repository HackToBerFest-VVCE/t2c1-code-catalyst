import fs from 'fs';

const imgBuffer = fs.readFileSync('c:/Users/sures/Downloads/New folder (3)/project-main/web/public/logo.png');
const base64 = imgBuffer.toString('base64');
const svg = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="rounded">
      <rect width="48" height="48" rx="12" fill="#000"/>
    </clipPath>
  </defs>
  <g clip-path="url(#rounded)">
    <image href="data:image/jpeg;base64,${base64}" x="0" y="0" width="48" height="48" preserveAspectRatio="xMidYMid slice"/>
  </g>
  <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#F8D057" stroke-opacity="0.45" stroke-width="1.2" fill="none"/>
</svg>`;

fs.writeFileSync('c:/Users/sures/Downloads/New folder (3)/project-main/web/public/logo.svg', svg);
console.log('Successfully updated web/public/logo.svg');
