const program = require('commander');
const create = require('./create');

program
    .version('1.0.0')
    .command('server')
    .description('create a new server')
    .action(() => {
        create();
    });

program.parse();