const Parser = require('./Parser');
const RemoteFile = require('./RemoteFile');

module.exports = class Session {

    constructor(options) {
        this.socket = options.socket;
        this.editor = options.editor;
        this.addressInfo = `${this.socket.remoteFamily}://${this.socket.remoteAddress}:${this.socket.remotePort}`;
        console.log(`new session ${this.addressInfo}`);

        this.remoteFile = null;
        this.parser = new Parser(this.onMessage.bind(this));
        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('data', this.onData.bind(this));

        this.handshake();
    }

    handshake() {
        this.socket.write('rmate-server\n');
    }

    async onClose() {
        console.log(`session ${this.addressInfo} closed`);
        this.remoteFile && await this.remoteFile.killEditorProcess();
    }

    async onData(chunk) {
        this.parser.update(chunk);
    }

    async onFileChange(data) {
        this.socket.write(`save\n`);
        this.socket.write(`token: ${this.remoteFile.token()}\n`);
        this.socket.write(`data: ${data.length}\n`);
        this.socket.write(data);
        this.socket.write('\n');
    }

    async onFileClose() {
        console.log(`onFileClose`);
        this.remoteFile = null;
        this.socket.end();
    }

    async onMessage(msg) {
        console.log(`onMessage: ${msg.command}, ${JSON.stringify(msg.headers)}, ${msg.data.length}`);
        switch (msg.command) {
            case 'open':
                this.remoteFile = new RemoteFile({
                    headers: msg.headers,
                    data: msg.data,
                    editor: this.editor,
                    changeCallback: this.onFileChange.bind(this),
                    closeCallback: this.onFileClose.bind(this)
                });
                await this.remoteFile.spawnEditorProcess();
                break;
            default:
                console.log(`unknown command: ${msg.command}`);
                break;
        }
    }

};