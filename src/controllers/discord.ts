import { Response } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { fetchLatestLink } from "../functions/utils.ts";

const fetchLatestLinkFromCDN = async ({ response, params }: { response: Response, params: { oldLink: string } }) => {
    const newLink = await fetchLatestLink(params.oldLink)

    if (!newLink) {
        response.status = 204;
        return;
    }

    response.status = 200;
    response.body = newLink;
    return;
}

const redirectToLatestLinkFromCDN = async ({ response, params }: { response: Response, params: { oldLink: string } }) => {
    const newLink = await fetchLatestLink(params.oldLink)

    if (!newLink) {
        response.status = 204;
        return;
    }

    response.redirect(newLink)
    return;
}

export { fetchLatestLinkFromCDN, redirectToLatestLinkFromCDN };