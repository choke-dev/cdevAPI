import { Context, Router } from "https://deno.land/x/oak@14.2.0/mod.ts"

// services //
import { getEnv } from "./services/env.service.ts";

// middlewares //
import { auth } from './middlewares/auth.middleware.ts';

// controllers //
import { healthCheck } from './controllers/api.ts';
import { fetchLatestLinkFromCDN, redirectToLatestLinkFromCDN } from "./controllers/discord.ts";

// variables //
const router = new Router();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', healthCheck);

router.get('/v1/discord/getLatestCDNLink/:oldLink', fetchLatestLinkFromCDN);
router.get('/v1/discord/redirectToLatestCDNLink/:oldLink', redirectToLatestLinkFromCDN);

router.get("/(.*)", (context: Context) => {
    if (context.request.url.pathname.startsWith("/favicon.ico")) {
        const faviconImg = Deno.readFileSync(`${Deno.cwd()}/src/public/favicon.ico`);
        context.response.body = faviconImg;
        context.response.status = 200;
        context.response.headers.set('Content-Type', 'image/x-icon');
        return;
    }
    
    context.response.status = 404;
    context.response.body = { errors: [{ message: 'Not Found' }] };
});

export default router
