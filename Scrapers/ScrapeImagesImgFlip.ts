import { writeFileSync } from 'fs';
import { load } from 'cheerio';
import Axios from 'axios';

interface Image {
	name: string,
	url: string,
};

const data: Image[] = [];

async function start() {

	let i = 0;

	while(true) {

		let res;

		try {
			res = await Axios.get(`https://imgflip.com/memetemplates?sort=top-all-time&page=${i}`);
		}
		catch(err: any) {
			console.log(`Failed at page ${i} because ${err.message}`);
			return;
		}

		const $ = load(res?.data);
		const images = $('.shadow').toArray();

		if(images.length == 0) {
			console.log('No more images');
			break;
		}

		images.map(imageElem => data.push({ url: imageElem.attribs['src'].slice(2), name: imageElem.attribs['alt'].slice(0, -9) }))

		i++;
	}

}

start()
	.then(() => writeFileSync('ImageList.json', JSON.stringify(data, null, '\t')));