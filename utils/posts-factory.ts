interface PostPayloadOverrides {
    userId?: number; 
    title?: string;
    body?: string;
}

export function createPostPayload(overrides: PostPayloadOverrides = {}) {
    const defaultPayload = {
        title: "Default Title",
        body: "Default body content for the post.",
        userId: 1,
    }; 

    return {
        ...defaultPayload, 
        ...overrides
    }
}