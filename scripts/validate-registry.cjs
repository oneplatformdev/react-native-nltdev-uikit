const { validateRegistry } = require('../bin/cli.cjs');

const count = validateRegistry();
process.stdout.write(`Validated ${count} component registry entries.\n`);
