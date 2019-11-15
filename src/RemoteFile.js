const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const {spawn} = require('child_process');
const {createHash} = require('crypto');
const {LOCAL_TMP_DIR} = require('./Constrains');
const encrypt = (algorithm, content) => {
    let hash = createHash(algorithm);
    hash.update(content);
    return hash.digest('hex');
};
const sha1 = (content) => encrypt('sha1', content);

module.exports = class RemoteFile {

    constructor(options) {
        this.headers = options.headers;
        this.data = options.data;
        this.editor = options.editor;
        this.changeCallback = options.changeCallback;
        this.closeCallback = options.closeCallback;
        this.doc = null;
        this.listeners = [];
        this.editorProcess = null;
        if (this.realPath() !== null) {
            this.localTmpFile = path.join(LOCAL_TMP_DIR, `${this.hostname()}__${sha1(this.realPath() + Math.random().toString())}`);
        } else {
            this.localTmpFile = path.join(LOCAL_TMP_DIR, `${this.hostname()}__${sha1(this.displayName() + Math.random().toString())}`);
        }
        this.localTmpFileListener = null;
        console.log(`local tmp file: ${this.localTmpFile}`);
    }

    get(key) {
        if (this.headers.hasOwnProperty(key)) {
            return this.headers[key];
        }
        return null;
    }

    hostname() {
        let displayName = this.displayName();
        if (displayName === null) return 'unknown_host';
        return displayName.split(':')[0];
    }

    displayName() {
        return this.get('display-name');
    }

    realPath() {
        return this.get('real-path');
    }

    token() {
        return this.get('token');
    }

    dataOnSave() {
        return this.get('data-on-save') === 'yes';
    }

    reActivate() {
        return this.get('re-activate') === 'yes';
    }

    initSelection() {
        let s = this.get('selection');
        return s === null ? null : parseInt(s);
    }

    putCursorAtInitSelection(editor) {
        // TODO
    }

    async spawnEditorProcess() {
        await fsPromises.writeFile(this.localTmpFile, this.data);

        this.localTmpFileListener = fs.watch(this.localTmpFile, async (event, filename) => {
            let data = await fsPromises.readFile(this.localTmpFile);
            if (data.equals(this.data)) {
                return;
            }

            console.log(`file ${filename} changed, event: ${event}`);
            this.data = data;
            this.changeCallback && this.changeCallback(this.data);
        });

        let command = this.editor.command;
        let args = this.editor.args.map(arg => arg === '{{file}}' ? this.localTmpFile : arg);

        let startTime = (new Date()).valueOf();

        this.editorProcess = spawn(command, args)
            .once('error', err => {
                if (err.code === 'ENOENT') {
                    console.error(new Error(`command '${command}' not found`));
                    process.exit(1);
                } else {
                    console.error(err);
                    process.exit(1);
                }
            })
            .on('exit', async () => {
                let endTime = (new Date()).valueOf();
                if (endTime - startTime < 500) {
                    console.error(new Error('editor process exited so quickly, it must be blocked while editing'));
                    process.exit(1);
                }
                console.log(`file ${this.localTmpFile} closed`);
                this.editorProcess = null;
                this.closeCallback && this.closeCallback();
                this.doc = null;
                this.localTmpFileListener.close();
                try {
                    await fsPromises.unlink(this.localTmpFile);
                } catch (e) {
                    // On windows, cannot remove a opened file, just ignore it, tmp dir will be clear when server down or next up
                }
            });
    }

    async killEditorProcess() {
        this.editorProcess.kill();
    }

};