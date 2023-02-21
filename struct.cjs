const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const program = new Command();
program.version('1.0.0');

program
	.option('-p, --path <path>', 'Path to the folder', '.')
	.parse(process.argv);

const options = program.opts();

const folderPath = path.join(__dirname, 'src/' + options.path);
console.log(folderPath);

fs.readdir(folderPath, (err, files) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	const fileNames = files.filter((file) => {
		const filePath = path.join(folderPath, file);
		return fs.statSync(filePath).isFile();
	});

	let writeStr = '';

	fileNames.forEach((fileName) => {
		writeStr += `export {default as ${fileName.substring(
			0,
			fileName.length - 4
		)}} from './${fileName.substring(0, fileName.length - 4)}';`;
	});

	fs.writeFileSync(path.join(folderPath, 'index.js'), writeStr);

	console.log(writeStr);
});
