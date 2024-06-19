import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import ELinkIssue from "../types/ELinkIssue.ts";
import IParsedLink from "../types/IParsedLink.ts";
import { getEnv } from "../services/env.service.ts";

function ParseLink(input: string): IParsedLink {
    if (input.includes("?"))
        input = input.split("?")[0];

    if (input.includes("attachments/"))
        input = input.split("attachments/")[1];

    let slashParts = input.split("/");
    if (slashParts.length != 3)
        return { error: ELinkIssue.INVALID_SLASH_AMOUNT };

    const [ channelID, fileID, fileName ] = slashParts;

    if (isNaN(Number(channelID)))
        return { error: ELinkIssue.CHANNEL_ID_NAN};

    if (isNaN(Number(fileID)))
        return { error: ELinkIssue.FILE_ID_NAN};

    if (!fileName.includes("."))
        return { error: ELinkIssue.FILENAME_NO_DOT };

    console.log(channelID);

    return {
        error: ELinkIssue.NONE,
        data: {
            channelID: BigInt(channelID),
            fileID: BigInt(fileID),
            fileName
        }
    }
}

export async function fetchLatestLink(oldLink: string): Promise<string | null> {
    if (!oldLink.includes("https://")) 
        oldLink = `https://cdn.discordapp.com/${oldLink}`;
    const linkData = ParseLink(oldLink);
    if (linkData.error != ELinkIssue.NONE) {
        throw new Error(linkData.error);
    }

    try {
        const { data } = await axiod.post("https://discord.com/api/v9/attachments/refresh-urls", {
            attachment_urls: [oldLink]
        }, {
            headers: {
                "Authorization": getEnv("DISCORD_TOKEN")
            }
        });

        const response = data;
        if (!response || !response.refreshed_urls || response.refreshed_urls.length == 0) {
            console.log("response:", data);
            throw new Error("Unexpected Discord response.");
        }

        const updatedLink = response.refreshed_urls[0].refreshed;
        return updatedLink;

    } catch (ex) {
        console.log(ex)
    }

    return null;
}