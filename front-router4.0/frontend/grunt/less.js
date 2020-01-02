var fileset = {
    // "public/css/style.default.css": "web/less/style.default.less",
    "public/css/style2.default.css": "web/less/v2/style.default.less"
}; 

module.exports = {
    dev: {},
    build: {
        files: [fileset]
    },
    dist: {
        options: {
            compress: true
        },
        files: [fileset]
    }

};
