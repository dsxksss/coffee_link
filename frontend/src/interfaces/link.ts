interface LinkI {
    linkID: string;
    linkURL: string;
    linkTitle: string;
    linkDescription: string;
    creator: string;
    hidden: boolean;
    createdAt: string;
}

class Link implements LinkI {
    constructor(linkID: string, linkURL: string, linkTitle: string, linkDescription: string, creator: string, hidden: boolean, createdAt: string) {
        this.linkID = linkID;
        this.linkURL = linkURL;
        this.linkTitle = linkTitle;
        this.linkDescription = linkDescription;
        this.creator = creator;
        this.hidden = hidden;
        this.createdAt = createdAt;
    }
    linkID: string;
    linkURL: string;
    linkTitle: string;
    linkDescription: string;
    creator: string;
    hidden: boolean;
    createdAt: string;
}

export { Link };
export type { LinkI };
