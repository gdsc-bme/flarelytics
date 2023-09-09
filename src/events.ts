import Storage, { Event } from './storage';
import Env from './env';


const Events = async (request: Request, env: Env): Promise<Response> => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json",
    };

    const event: Event = await request.json();
    console.log("Received event: ", event);

    const storage = new Storage();
    await storage.init(env);

    try {
        await storage.saveEvent(event)
        return new Response("", { headers })
    } catch (error) {
        console.log(`Error. Couldn't store event: ${error}`)
        return new Response("", { status: 500 })
    }
};

export default Events;
