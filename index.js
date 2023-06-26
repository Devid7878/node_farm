const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplates');
// ************* Synchronously working with file also called as blocking nature **********
// This nature is not good sometimes because it runs files in order from top to bottom  and blocks the other files below it un till the current file is processed while Asynchronous nature is also called as non-blocking nature which will not block the other files for processing it allows to process other files which may be processed earlier than this file this is goog behavior for file systems module

//Reading files synchronously from our pc                   // 'utf-8 is a used to specify to english
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // If 'utf-8' is not used it gives a buffer
// console.log(textIn);

//Writing/Creating files synchronously to our pc
// const textOut = `This is all we k/w about avocado: ${textIn}.\n Created on ${Date.UTC}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

// ********************************************************************************************

// Non blocking nature / Async
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
// 	console.log(data);
// });

// console.log('Reading before readFile');

// So Async fxn named readFile will go on reading the start.txt file in the background and the next line
// will run i.e. 'Reading before readFile'

// This is called Callback Hell
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
// 	console.log(data1);
// 	fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);
// 			fs.writeFile('./txt/final.txt', `${data1}\n${data2}`, (err) => {
// 				console.log('File written Successfully!');
// 			});
// 		});
// 	});
// });

//As this is the sync file read do not worry of blocking the code because this will run only once.
// When the req happened it will not read any data in here again because the data is same throughout
// So it is good to use sync file read in here instead of async for more efficient performance

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/overview.html`,
	'utf-8',
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/product.html`,
	'utf-8',
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8',
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//This is called as the request listener sent by the browser/client
const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});

		// tempCard has values that will be replaced by the elements values that comes from json.parse
		const cardsHtml = dataObj
			.map((element) => replaceTemplate(tempCard, element))
			.join('');
		const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
		res.end(output);
	} else if (pathname === '/product') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});
		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);
	} else if (pathname === '/api') {
		res.writeHead(200, {
			'Content-type': 'application/json',
		});
		res.end(data);
	} else {
		res.writeHead(404, {
			'content-type': 'text/html',
			'my-own-header': 'something',
		});
		res.end('<h1>Page Not Found!</h1>');
	}
});

// This will start the server at this port and the host and will listen to the req
server.listen(8000, 'localhost', () => {
	console.log('Listening on PORT 8000...');
});
