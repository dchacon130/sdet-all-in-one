import {test, expect, request } from "@playwright/test";
import { Post, validatePostContract } from "../../utils/posts-validators";

test.describe("Tests about Posts API", () => {
    test("GET - Obtener todos los resultados de Posts", async ({ request }) => {
        const response = await request.get("/posts"); 
        expect(response.status()).toBe(200);

        const posts: Post[] = await response.json(); 
        expect(posts.length).toBeGreaterThan(0); 

        for (const post of posts){
            validatePostContract(post); 
        }
    });

    test("GET - Obtener un post por ID", async ({ request }) => {
        const response = await request.get("/posts/1"); 
        expect(response.status()).toBe(200); 
        const post: Post = await response.json();         
        validatePostContract(post);  
    }); 
});