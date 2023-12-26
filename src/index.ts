import { handleRequest } from './handler';
import Env from './env';

export default {
	async fetch(request: Request, env: Env) {
		return handleRequest(request, env);
	},
};
