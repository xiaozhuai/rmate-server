const WaitingForHeaderFinished = 0;
const WaitingForBodyFinished = 1;

module.exports = class Parser {

    constructor(msgCallback) {
        this.msgCallback = msgCallback;

        this.reset();
    }

    reset() {
        this.state = WaitingForHeaderFinished;
        this.cachedBuffer = null;
        this.command = null;
        this.headers = {};
        this.dataSize = -1;
    }

    findBodyOffset(buf) {
        let pos = buf.indexOf('data: ');
        if (pos === -1) return -1;

        pos = buf.indexOf('\n', pos);
        if (pos === -1) return -1;

        return pos + 1;
    }

    update(chunk) {

        let buf;
        if (this.cachedBuffer !== null) {
            buf = Buffer.concat([this.cachedBuffer, chunk]);
            this.cachedBuffer = null;
        } else {
            buf = chunk;
        }

        switch (this.state) {
            case WaitingForHeaderFinished: {
                let pos = this.findBodyOffset(buf);
                if (pos === -1) {
                    this.cachedBuffer = buf;
                    break;
                }

                let lines = buf.toString('utf-8', 0, pos - 1).split('\n');
                this.command = lines.shift();
                for (let line of lines) {
                    let [key, value] = line.split(': ');
                    this.headers[key] = value;
                }
                this.dataSize = parseInt(this.headers.data);
                this.state = WaitingForBodyFinished;
                if (buf.length > pos) {
                    this.update(buf.slice(pos));
                }
                break;
            }
            case WaitingForBodyFinished: {
                if (buf.length < this.dataSize + 3) { // "\n.\n" at the end
                    this.cachedBuffer = buf;
                } else {
                    let data = buf.slice(0, this.dataSize);
                    let remain = buf.length > this.dataSize + 3 ? buf.slice(this.dataSize + 3) : null;

                    if (this.msgCallback) {
                        this.msgCallback({
                            command: this.command,
                            headers: this.headers,
                            data: data
                        });
                    }

                    this.reset();

                    if (remain != null) {
                        this.update(remain);
                    }
                }
                break;
            }
        }

    }

};