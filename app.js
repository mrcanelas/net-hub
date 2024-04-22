const express = require("express");
const axios = require("axios")
const puppeteer = process.env.VERCEL ? require('puppeteer-core') : require('puppeteer');
const chromium = require('@sparticuz/chromium');
const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')

const md = markdownIt()
const app = express();

async function getBrowser() {
    if (process.env.VERCEL) {
        return puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath("https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar"),
            headless: "new",
            ignoreHTTPSErrors: true,
        });
    }

	return puppeteer.launch({
		headless: true,
	});
}

const getCacheHeaders = function (opts) {
	opts = opts || {};

	if (!Object.keys(opts).length) return false;

	let cacheHeaders = {
		cacheMaxAge: "max-age",
		staleRevalidate: "stale-while-revalidate",
		staleError: "stale-if-error",
	};

	return Object.keys(cacheHeaders)
		.map((prop) => {
			const value = opts[prop];
			if (!value) return false;
			return cacheHeaders[prop] + "=" + value;
		})
		.filter((val) => !!val)
		.join(", ");
};

const respond = function (res, data, opts) {
	const cacheControl = getCacheHeaders(opts);
	if (cacheControl) res.setHeader("Cache-Control", `${cacheControl}, public`);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader("Content-Type", "application/json");
	res.send(data);
};

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

	const browser = await getBrowser();
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

	const cacheOpts = {
		cacheMaxAge: 7 * 24 * 60 * 60, // 7 days
		staleRevalidate: 14 * 24 * 60 * 60, // 14 days
		staleError: 30 * 24 * 60 * 60, // 30 days
	};

	respond(res, requests, cacheOpts)
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