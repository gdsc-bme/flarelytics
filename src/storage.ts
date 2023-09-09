import * as Realm from 'realm-web';
import Env from './env';

type Document = globalThis.Realm.Services.MongoDB.Document;
type RawEventCollection = globalThis.Realm.Services.MongoDB.MongoDBCollection<Event>;

export interface Event extends Document {
    tracking_id: string
    domain: string
    page: string
    state: string
    timestamp: Date
}

export default class Storage {
    events: RawEventCollection;

    async init(env: Env): Promise<void> {
        const app = new Realm.App(env.REALM_APPID);
        const credentials = Realm.Credentials.apiKey(env.REALM_API_TOKEN);
        const user = await app.logIn(credentials);
        this.events = user.mongoClient('mongodb-atlas').db(env.DB_NAME).collection<Event>('events');
    }

    async saveEvent(event: Event): Promise<void> {
        await this.events.insertOne({
            "tracking_id": event.tracking_id,
            "domain": event.domain,
            "page": event.page,
            "state": event.state,
            "timestamp": new Date(),
        })
    }

    async getEventsByTrackingId(): Promise<any> {
        const query = [
            {
                $sort: {timestamp: 1},
            },
            {
                $group: {
                    _id: { tracking_id: "$tracking_id"},
                    events: { $push: "$$ROOT" },
                }
            },
        ]
        return await this.events.aggregate(query);
    }
}
