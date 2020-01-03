const path = require('path');
const webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');

const webpackConfig = {
    // mode: 'production',
    mode: 'development',
    entry: './web/app/v2/index2.js',
    output: {
        path: path.resolve(__dirname, './yy'),
        filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
};

const spinner = ora('Building...');
spinner.start();

webpack(webpackConfig, (err, stats) => {
	spinner.stop();
	if (err) throw err;

	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false,
	}) + '\n\n');

	if (stats.hasErrors()) {
		console.log(chalk.red('  Build failed with errors.\n'));
		process.exit(1);
		return;
	}

	console.log(chalk.cyan('  Build complete.\n'));
});
