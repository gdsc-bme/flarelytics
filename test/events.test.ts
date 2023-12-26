import { handleRequest } from '../src/handler';
import Storage from '../src/storage';
import makeServiceWorkerEnv from 'service-worker-mock';

declare var global: any;

// automatic mock on Storage class
jest.mock('../src/storage');
const mockedStorage = <jest.Mock<Storage>>Storage;

const headers = {
	'Access-Control-Allow-Origin': '*',
	'Content-type': 'application/json',
};

describe('Test events', () => {
	beforeEach(() => {
		Object.assign(global, makeServiceWorkerEnv());
		jest.resetModules();
		mockedStorage.mockClear();
	});

	test('handle new event', async () => {
		const event = {
			tracking_id: '123',
			domain: 'example.com',
			page: '/my-page',
			state: 'visible',
		};

		const request = new Request('/event', {
			body: JSON.stringify(event),
			headers: headers,
			method: 'POST',
		});

		const result = await handleRequest(request);
		expect(result.status).toEqual(200);
	});
});
