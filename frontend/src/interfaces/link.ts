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
    constructor(Link:LinkI) {
        this.linkID = Link.linkID;
        this.linkURL = Link.linkURL;
        this.linkTitle = Link.linkTitle;
        this.linkDescription = Link.linkDescription;
        this.creator = Link.creator;
        this.hidden = Link.hidden;
        this.createdAt = Link.createdAt;
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
