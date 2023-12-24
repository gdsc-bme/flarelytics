import Storage from './storage'
import Env from './env'


function convertDurationToMinutes(duration: string | null): number {
	const day = 24 * 60;
	const month = 30 * day;

  switch (duration) {
		case '7d':
			return 7 * day;
		case '30d':
			return 30 * day;
		case '3m':
			return 3 * month;
		case '6m':
			return 6 * month;
		case '1y':
			return 12 * month;
		default:
			return 7 * day;
  }
}


const Statistics = async (req: Request, env: Env): Promise<Response> => {
    const headers = {
        'Content-type': 'application/json',
    };

    const storage = new Storage();
    await storage.init(env);

		const url = new URL(req.url);
		const last = url.searchParams.get('last');
		const minutes = convertDurationToMinutes(last);

    const avgViewTime = await storage.getAvgViewTimePerPage(minutes);
    return new Response(JSON.stringify(avgViewTime), { headers });
}

export default Statistics;
