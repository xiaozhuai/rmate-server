const net = require('net');
const path = require('path');
const fs = require('fs');
const rimraf = require("rimraf");
const fsPromises = fs.promises;
const Session = require('./Session');
const {LOCAL_TMP_DIR} = require('./Constrains');

module.exports = class Server {

    constructor(options) {
        this.host = options.host;
        this.port = options.port;
        this.editor = options.editor;
        this.server = net.createServer(socket => {
            new Session({
                socket: socket,
                editor: this.editor
            });
        });
    }

    async clearTmpDir() {
        rimraf.sync(LOCAL_TMP_DIR);
    }

    async start() {
        try {
            await fsPromises.stat(LOCAL_TMP_DIR);
            await this.clearTmpDir();
        } catch (e) {
        }

        let stat;
        try {
            await fsPromises.mkdir(LOCAL_TMP_DIR);
            stat = await fsPromises.stat(LOCAL_TMP_DIR);
        } catch (e) {
        }

        if (!stat.isDirectory()) {
            throw new Error(`cannot create local tmp directory ${LOCAL_TMP_DIR}`);
        }

        return new Promise((resolve, reject) => {
            this.server.once('error', err => reject(err));
            this.server.listen(this.port, this.host, () => {
                console.log(`rmate-vscode server listening ${this.host}:${this.port}`);
                resolve();
            });
        });
    }

    async stop() {
        await this.clearTmpDir();
        this.server.close(err => {
            if (err) {
                console.error('rmate-vscode stop error', err);
                return;
            }
            console.log('rmate-vscode server stopped');
        });
    }

};