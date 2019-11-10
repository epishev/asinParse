const puppeteer = require('puppeteer');
const fs = require('fs');
const arguments = process.argv.slice(2);

const getListingInfo = async asin => {
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: {
			width: 1200,
			height: 750
		}
	});
	const page = await browser.newPage();
	await page.goto(`https://www.amazon.com/dp/${asin}`);
	await page.waitFor(2000);
	await page.reload();
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

	const productDescription = await page.evaluate(() => {
		const description = document.querySelector(
			'div#productDescription.a-section p'
		);
		if (description) {
			return {
				ProductDescription: description.innerText.replace(/\s\s+/g, ' ').trim()
			};
		}
		return {
			ProductDescription: 'There is product description section with images!'
		};
	});

	await browser.close();
	return {
		...{ asin },
		...textResult,
		...(await imageLinks()),
		...productDescription
	};
};

let writeableStream = fs.createWriteStream('result.txt');
arguments.forEach(asin => {
	getListingInfo(asin).then(data => {
		writeableStream.write(JSON.stringify(data, null, 2));
	});
});
