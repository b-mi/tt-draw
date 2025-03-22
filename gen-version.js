const { version } = require('./package.json');
const fs = require('fs');

const content = `// Auto-generated file
export const VERSION = '${version}';
`;

fs.writeFileSync('src/version.ts', content);
