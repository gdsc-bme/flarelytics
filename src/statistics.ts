import Storage from './storage'
import Env from './env'


const Statistics = async (_: Request, env: Env): Promise<Response> => {
    const headers = {
        'Content-type': 'application/json',
    };

    const storage = new Storage();
    await storage.init(env);

    const avgViewTime = await storage.getAvgViewTimePerPage();
    return new Response(JSON.stringify(avgViewTime), { headers });
}

export default Statistics;
