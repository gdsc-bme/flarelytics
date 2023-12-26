// Script requires Node.js v18.0.0 or higher because fetch is used.
const baseUrl = 'http://localhost:8787';

const body = {
	state: 'visible',
	tracking_id: 'abc123',
	domain: 'localhost',
	page: 'page/1',
};

fetch(`${baseUrl}/event`, {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(body),
})
	.then(response => {
		console.log('Response: ', response);
	})
	.catch(err => {
		console.error('Unable to send POST request. Details: ', err);
	});
