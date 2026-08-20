interface HeartbeatPayload {
	latestChange: number;
	latestChangeUser: string;
	latestChangeDescription: string;
	latestChangeTime: string;
}

interface StoredStatus extends HeartbeatPayload {
	lastHeartbeat: string;
}

const corsHeaders = {
	'Access-Control-Allow-Origin': 'http://localhost:5173',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders,
			})
		}

		if (request.method === 'POST' && url.pathname === '/heartbeat') {
			const authorization = request.headers.get('Authorization')

			if (authorization !== `Bearer ${env.HEARTBEAT_SECRET}`) {
				return Response.json(
					{
						success: false,
						message: 'Unauthorized',
					},
					{
						status: 401,
						headers: corsHeaders,
					},
				)
			}

			const heartbeat = await request.json<HeartbeatPayload>()

			const status: StoredStatus = {
				...heartbeat,
				lastHeartbeat: new Date().toISOString(),
			}

			await env.P4_STATUS.put(
				'current-status',
				JSON.stringify(status),
			)

			return Response.json(
				{
					success: true,
				},
				{
					headers: corsHeaders,
				},
			)
		}

		if (request.method === 'GET' && url.pathname === '/status') {
			const storedStatus = await env.P4_STATUS.get('current-status')

			if (!storedStatus) {
				return Response.json(
					{
						online: false,
						message: 'No heartbeat received yet',
					},
					{
						headers: corsHeaders,
					},
				)
			}

			const status = JSON.parse(storedStatus) as StoredStatus

			const lastHeartbeat = new Date(status.lastHeartbeat)
			const now = new Date()

			const ageInMinutes =
				(now.getTime() - lastHeartbeat.getTime()) / 1000 / 60

			return Response.json(
				{
					online: ageInMinutes < 25,
					...status,
				},
				{
					headers: corsHeaders,
				},
			)
		}

		return new Response('Not Found', {
			status: 404,
			headers: corsHeaders,
		})
	},
} satisfies ExportedHandler<Env>