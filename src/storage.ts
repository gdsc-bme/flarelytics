import { connect, Connection } from '@planetscale/database';
import Env from './env';

export interface Event {
    tracking_id: string
    domain: string
    page: string
    state: string
}

type AvgViewTimePerPage = Record<string, number>

export default class Storage {
    connection: Connection;

    async init(env: Env): Promise<void> {
			const config = {
				host: env.DATABASE_HOST,
				username: env.DATABASE_USERNAME,
				password: env.DATABASE_PASSWORD,
				fetch: (url: any, init: any) => {
					delete init['cache']
					return fetch(url, init)
				}
			};
			this.connection = await connect(config);
    }

    async saveEvent(event: Event): Promise<void> {
			await this.connection.execute(
				'INSERT INTO events (tracking_id, domain, page, state, timestamp) VALUES (?, ?, ?, ?, ?)',
				[event.tracking_id, event.domain, event.page, event.state, new Date()]);
    }

    async getAvgViewTimePerPage(): Promise<AvgViewTimePerPage> {
			const query = `
			SELECT page, AVG(TIMESTAMPDIFF(SECOND, prev_timestamp, \`timestamp\`)) as avg_time
				FROM (
					SELECT
							tracking_id,
							page,
							\`timestamp\`,
							LAG(\`timestamp\`) OVER (PARTITION BY tracking_id, page ORDER BY \`timestamp\`) AS prev_timestamp,
							state,
							LAG(state) OVER (PARTITION BY tracking_id, page ORDER BY \`timestamp\`) AS prev_state
					FROM events
			) AS LaggedEvents
			WHERE prev_state = 'visible' AND state = 'hidden' GROUP BY page;`;

			const results = await this.connection.execute(query, { as: 'object' });
			const rows = results.rows;

			const avgViewTimePerPage: AvgViewTimePerPage = {};

			let row: any;
			for (row of rows) {
				avgViewTimePerPage[row['page']] = parseFloat(row['avg_time']);
			}
			return avgViewTimePerPage;
    }
}
