import { Webhook } from 'svix';
import { handleClerkWebhook } from '@/lib/webhooks/clerk';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  const headers = req.headers;
  const svix_id = headers.get('svix-id');
  const svix_timestamp = headers.get('svix-timestamp');
  const svix_signature = headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.text();

  let event;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    await handleClerkWebhook(event);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return Response.json({ message: e.message }, { status: 500 });
    } else {
      console.log('Unexpected error parsing webhook', e);

      return Response.json(
        {
          message: 'An unexpected error has occured',
        },
        { status: 500 },
      );
    }
  }

  return new Response('OK', { status: 200 });
}
