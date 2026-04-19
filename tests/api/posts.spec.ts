import {test, expect } from "@playwright/test";
import { Post, validatePostContract } from "../../utils/posts-validators";
import { request } from "node:http";

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

    test("GET - Solicitar un post con ID que no existe", async ({ request }) => {
        const response = await request.get("/posts/666", {
            failOnStatusCode: false,
        }); 
        expect(response.status()).toBe(404);
    });

    test("GET - Filtrar posts por userID", async ({ request }) => {
        const userIdFilter = 1; 
        const response = await request.get(`/posts?userId=${userIdFilter}`); 
        expect(response.status()).toBe(200); 

        const posts: Post[] = await response.json(); 
        expect(posts.length).toBeGreaterThan(0);

        for (const post of posts){
            expect(post.userId).toBe(userIdFilter); 
            validatePostContract(post); 
        }
    });

    test("GET - Filtrar posts por userID que no existe", async ({ request }) => {
        const userIdWithoutPosts = 999; 
        const response = await request.get(`/posts?userId=${userIdWithoutPosts}`); 
        expect(response.status()).toBe(200); 

        const posts: Post[] = await response.json(); 
        expect(posts.length).toBe(0);
    }); 
});