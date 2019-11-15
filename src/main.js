const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const yargs = require('yargs');
const PackageJson = require('../package.json');
const Server = require('./Server');

let server = null;

async function main() {
    let argv = yargs
        .usage('Usage: $0 [options]')
        .alias('c', 'config')
        .string('c')
        .nargs('c', 1)
        .describe('c', 'Specify config file')
        .demandOption(['c'])
        .help('h')
        .alias('h', 'help')
        .version('v', PackageJson.version)
        .alias('v', 'version')
        .example('$0 -c config.json', '')
        .argv;

    try {
        let stat = await fsPromises.stat(argv.config);
        if (!stat.isFile()) {
            console.log(`${argv.config} is not a file`);
            return;
        }
    } catch (e) {
        console.log(`Config file ${argv.config} not exists`);
        return;
    }

    const config = JSON.parse(await fsPromises.readFile(argv.config, 'utf-8'));

    server = new Server(config);
    await server.start();
}

main().then();
