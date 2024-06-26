const express = require("express");
const axios = require("axios")
const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')

const md = markdownIt()
const app = express();

async function getBrowser() {
	let browser

	if (process.env.VERCEL) {
		const chromium = require('@sparticuz/chromium')
		// Optional: If you'd like to disable webgl, true is the default.
		chromium.setGraphicsMode = false
		const puppeteer = require('puppeteer-core')
		browser = await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath(),
			headless: chromium.headless,
		})
	} else {
		const puppeteer = require('puppeteer')
		browser = await puppeteer.launch({ headless: "new" })
	}

	return browser
}

app.get("/", async function (_, res) {
	const readmePath = path.join(__dirname, 'README.md');

	fs.readFile(readmePath, 'utf-8', (err, data) => {
		if (err) {
			console.error('Erro ao ler o arquivo README.md:', err);
			return res.status(500).send('Erro interno do servidor');
		}

		const htmlContent = md.render(data);

		res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>NetHub README</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
                <style>
                    body {
                        box-sizing: border-box;
                        min-width: 200px;
                        max-width: 980px;
                        margin: 0 auto;
                        padding: 45px;
                    }
                    .markdown-body {
                        box-sizing: border-box;
                        min-width: 200px;
                        max-width: 980px;
                        margin: 0 auto;
                        padding: 45px;
                    }
                </style>
            </head>
            <body class="markdown-body">
                ${htmlContent}
            </body>
            </html>
        `);
	});
});

app.get("/sniffer", async function (req, res) {
	const url = req.query.url;

	if (!url) {
		return res.status(400).json({ error: 'URL parameter is required' });
	}

	let browser;
	try {
		browser = await getBrowser();
		const page = await browser.newPage();

		await page.setRequestInterception(true);
		await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
		await page.setViewport({ width: 1366, height: 768 });

		const requests = [];
		page.on('request', (request) => {
			requests.push(request.url());
			request.continue();
		});

		await page.goto(url, { waitUntil: 'networkidle2' });

		await page.close();

		res.json(requests);
	} catch (error) {
		if (browser) {
			await browser.close();
		}
		console.error('Error navigating to the URL:', error);
		return res.status(500).json({ error: 'Error navigating to the URL', error, env: process.env.VERCEL });
	}
});

app.get("/proxy", async function (req, res) {
	const url = req.query.url
	const headers = transformHeaders(req.headers);

	axios.get(url, { headers })
		.then(response => {
			res.send(response.data);
		})
		.catch(error => {
			res.status(error.response ? error.response.status : 500).send(error.message);
		});
});

function transformHeaders(headers) {
	const transformedHeaders = {};

	for (const key in headers) {
		if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
			transformedHeaders[key] = headers[key];
		}
	}

	return transformedHeaders;
}

module.exports = app;