const puppeteer = require('puppeteer');
const fs = require('fs');
const arguments = process.argv.slice(2);

const getListingInfo = async asin => {
	const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: {
			width: 1200,
			height: 750
		}
	});
	const page = await browser.newPage();
	await page.goto(`https://www.amazon.com/dp/${asin}`);
	await page.waitFor(2000);
	// get title and bullets
	const textResult = await page.evaluate(() => {
		const title = document.querySelector('#productTitle').innerText;
		let bullets = [];
		document
			.querySelectorAll('#feature-bullets li:not([class]) .a-list-item')
			.forEach(b => bullets.push(b.innerText.replace(/\s\s+/g, ' ').trim()));
		return { title, bullets };
	});
	//get image links
	const imageLinks = async () => {
		const links = ['bla bla', 'be be', 'hu hu'];
		// let imageLinks = [];
		// const images = await page.$$('.imageThumbnail');
		// for (let element of images) {
		// 	await element.click();
		// 	await page.waitFor(1000);
		// }
		return { links };
	};

	const productDescription = async () => {
		const description = 'hello world';
		return { description };
	};

	await browser.close();
	return {
		...textResult,
		...(await imageLinks()),
		...(await productDescription())
	};
};

arguments.forEach(asin => {
	getListingInfo(asin).then(data => {
		fs.writeFile(`result${asin}.txt`, JSON.stringify(data, null, 2), err => {
			if (err) throw err;
		});
	});
});
