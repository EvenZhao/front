var assign = require('object-assign');
var dest_build = {dest: 'public'};
var src_assets = {src: require('./vars').assets_surfixs};
var fileset = {
    expand: true,
    cwd: 'web/'
};
var fileset_build = assign({}, fileset, src_assets, dest_build);

module.exports = {
    dev: {
        files: [fileset_build],
        compareUsing: "md5",
        verbose: true
    }
};
