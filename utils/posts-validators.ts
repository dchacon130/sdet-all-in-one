import { expect } from "@playwright/test";

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export function validatePostContract(post: any) {
    expect(post).toHaveProperty("userId");
    expect(post).toHaveProperty("id");
    expect(post).toHaveProperty("title");
    expect(post).toHaveProperty("body");

    expect(typeof post.id).toBe("number");
    expect(typeof post.title).toBe("string");
}