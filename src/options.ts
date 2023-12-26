const headers: { [header: string]: string } = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

const Options = (): Response => new Response('', { headers });

export default Options;
