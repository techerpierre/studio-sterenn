import { HttpClientBuilder } from '@/lib/http';
import env from './env';
import { getSession } from '@/lib/session-persistence';

const httpClient = new HttpClientBuilder(env.API_BASE_URL)
  .setAuthGetter(async () => {
    const session = await getSession();
    return session ? `Bearer ${session.token}` : null;
  })
  .build();

export default httpClient;
