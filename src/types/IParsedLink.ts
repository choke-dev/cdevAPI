import ELinkIssue from "./ELinkIssue.ts";
import ILinkData from "./ILinkData.ts";

interface IParsedLink {
    error: ELinkIssue,
    data?: ILinkData
}

export default IParsedLink;