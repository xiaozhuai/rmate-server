const path = require('path');
const os = require('os');

module.exports = {
    LOCAL_TMP_DIR: path.join(os.tmpdir(), 'rmate-server')
};