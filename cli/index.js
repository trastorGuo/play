const program = require('commander');

program
    .version('1.0.0')
    .command('server <name>')
    .description('create a new server')
    .action(name => {
        console.log(name);
    });

program.parse();