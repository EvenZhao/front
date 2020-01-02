var fileset = {
    'public/js/bundle.index2.js': ['web/app/v2/index2.js'],
    'public/js/bundle.phoneAnswer.js': ['web/app/v2/phoneAnswer.js'],
    'public/js/bundle.activityIndex.js': ['web/app/v2/activityIndex.js'],
}
var envify = require('envify/custom');
var assign = require('object-assign');

function makeConf(env, iswatch){
    var conf = {
        options: {
            transform: [
                ["babelify", { "presets": ["react", "stage-0"] }],
                env
            ]
        },
        files: fileset
    };
    if(iswatch){
        conf.options = assign({}, conf.options, {
            watch: true,
            keepAlive: true,
            watchifyOptions: {
                verbose: true,
                delay: 600
            }
        });
    }
    return conf;

}

module.exports = {
    dist: makeConf(
        envify({
            NODE_ENV: 'production'
        })
    ),
    test: makeConf(
        envify({
            NODE_ENV: 'test'
        })
    ),
    alpha: makeConf(
        envify({
            NODE_ENV: 'alpha'
        })
    ),
    build: makeConf(
        envify({
            NODE_ENV: 'dev'
        })
    ),
    dev: makeConf(
        envify({
            NODE_ENV: 'dev'
        }),
        true
    )

};
