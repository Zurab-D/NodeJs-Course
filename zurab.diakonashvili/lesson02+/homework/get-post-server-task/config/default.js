const path = require('path');

module.exports = {
    publicDir:      path.join(process.cwd(), 'public'),
    filesDir:       path.join(process.cwd(), 'files'),
    limitFileSize:  1e6,
};
