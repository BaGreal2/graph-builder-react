const fs = require('fs').promises;
const path = require('path');
const { Command } = require('commander');

const program = new Command();

program.option('-p, --pathTo <type>', 'Components path', 'assets/icons');

program.parse(process.argv);

const options = program.opts();

const componentsPath = (pathTo) => path.join(__dirname, `src/${pathTo}`);

async function createComponent({ pathTo }) {
	const folderPath = componentsPath(pathTo);
	fs.readdir(folderPath, (err, files) => {
		files.forEach(async (file) => {
			console.log(file);
			await fs.writeFile(
				path.join(folderPath, `index.js`),
				`export { default as ${file} } from './${file}';\n`
			);
		});
	});
	// .forEach((file) => {
	// 	console.log(file);
	// 	// await fs.writeFile(
	// 	// 	path.join(folderPath, `index.js`),
	// 	// 	`export { default } from './${name}';\n`
	// 	// );
	// });
}

createComponent(options)
	.then(() => {
		process.exit(0);
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
