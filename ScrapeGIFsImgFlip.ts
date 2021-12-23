import { writeFileSync } from 'fs';
import { load } from 'cheerio';
import Axios from 'axios';

interface GIF {
	name: string,
	url: string,
};

const data: GIF[] = [];

async function start() {

	let i = 0;

	while(true) {

		let res;

		try {
			res = await Axios.get(`https://imgflip.com/gif-templates?page=${i}`);
		}
		catch(err: any) {
			console.log(`Failed at page ${i} because ${err.message}`);
			return;
		}

		let $ = load(res?.data);
		const gifs = $('.mt-img-wrap > a').toArray();

		if(gifs.length == 0) {
			console.log('No more GIFs');
			break;
		}

		gifs.map(async (gifElem) => {
			res = await Axios.get(`https://imgflip.com${gifElem.attribs['href']}`);

			$ = load(res.data);

			const url = $('source')[0].attribs['src'].slice(2);
			const name = $('#mtm-title').text().slice(0, -9);

			data.push({ name, url });
		});

		i++;
	}

}

start()
	.then(() => {
		writeFileSync('GIFList.json', JSON.stringify(data, null, '\t'));
		console.log('Finished');
	});