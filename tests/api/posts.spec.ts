import {test, expect } from "@playwright/test";
import { Post, validatePostContract } from "../../utils/posts-validators";
import { createPostPayload } from "../../utils/posts-factory";

test.describe("Tests about Posts API", () => {
    test.describe("GET Methods", () => {
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

    test.describe("POST Methods", () => {
        test("POST - Crear un nuevo post", async ({ request}) => {
            /*const newPostData = {
                "userId": 10,
                "title": "optio molestias id quia eum",
                "body": "quo et expedita modi cum officia vel magni"
            }*/
            const newPostData = createPostPayload();
            const response = await request.post("/posts", {
                data: newPostData,
            });
            expect(response.status()).toBe(201);

            const createdPost = await response.json(); 
            expect(createdPost).toMatchObject(newPostData);
            expect(createdPost).toHaveProperty("id"); 
            expect(typeof createdPost.id).toBe("number");
        });

        test("POST - Crear un nuevo registro sin el campo titulo", async ({ request }) => {
            const dataIncompleta = {
                "userId": 10,
                "body": "quo et expedita modi cum officia vel magni"
            }; 

            const response = await request.post("/posts", {
                data: dataIncompleta, 
            }); 
            expect(response.status()).toBe(201);

            const createdPost = await response.json();
            expect(createdPost).not.toHaveProperty("title"); 
            expect(createdPost.body).toBe(dataIncompleta.body); 
            expect(createdPost).toHaveProperty("id"); 
        });  
    }); 

    test.describe("PUT Methods", () => {
        test("PUT - Actualizar un post existente", async ({ request }) => {

            const updatePostData = {
                id: 1, 
                title: 'Updated Title',
                body: 'Updated body content for the post.',
                userId: 1,
            }

            const response = await request.put(`/posts/1`, {
                data: updatePostData, 
            });

            expect(response.status()).toBe(200);

            const responseBody = await response.json(); 
            expect(responseBody).toMatchObject(updatePostData);
        }); 
    });

});