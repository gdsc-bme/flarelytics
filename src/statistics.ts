
import Storage, {Event} from './storage'
import Env from './env'

const calculateTimeOnPage = (events: [Event]): number => {
    let time_on_page = 0;
    let visible_timestamp: Date | undefined = undefined;
    for (const event of events) {
        if (event.state == "visible") {
            visible_timestamp = event.timestamp
        }

        if (event.state == "hidden") {
            if (visible_timestamp !== undefined) {
                time_on_page += Math.round(event.timestamp.getTime() - visible_timestamp.getTime())
            }
        }
     }
     return time_on_page
};


const Statistics = async (_: Request, env: Env): Promise<Response> => {
    const headers = {
        "Content-type": "application/json",
    };

    const storage = new Storage();
    await storage.init(env);

    const events_by_tracking_id = await storage.getEventsByTrackingId();

    const page_to_metric: { [page: string]: any } = {};
    for (const item of events_by_tracking_id) {
        const events = item.events;

        if (events.length > 0) {
            const timeOnPage = Math.round(calculateTimeOnPage(events) / 1000);
            const page = events[0].page
            if (page_to_metric[page] === undefined) {
                page_to_metric[page] = {
                    sum: 0,
                    count: 0,
                };
            }
            page_to_metric[page].sum += timeOnPage;
            page_to_metric[page].count += 1;
        }
    }

    const avg: { [page: string]: number } = {}
    for (const page in page_to_metric) {
        avg[page] = Math.round(page_to_metric[page].sum / page_to_metric[page].count);
    }
    return new Response(JSON.stringify(avg, null, 2), { headers });
}

export default Statistics;
