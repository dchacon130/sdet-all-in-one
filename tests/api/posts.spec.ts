import {test, expect } from "@playwright/test";
import { Post, validatePostContract } from "../../utils/posts-validators";
import { createPostPayload } from "../../utils/posts-factory";
import { APIClient } from "../../helpers/api-client";

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
            //const response = await request.get("/posts/1"); 
            const apiClient = new APIClient(request); 
            const response = await apiClient.posts.getById(1);
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
            const newPostData = createPostPayload({ title: "Mi Post de Prueba" });
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

        test("PUT - Actualizar un post que no existe", async ({ request }) => {
            const nonExistentPostId = 9999;
            const updateData = {
                id: nonExistentPostId, 
                title: 'Updated Title',
                body: 'Updated body content for the post.',
                userId: 1,
            }

            const response = await request.put(`/posts/${nonExistentPostId}`, {
                data: updateData, 
                failOnStatusCode: false, 
            }); 

            expect(response.status()).toBe(500);
        });
    });

    test.describe("DELETE Methods", () => {
        test("DELETE - Eliminar un post existente", async ({ request }) => {
            // Crear un post nuevo
            const newPostData = createPostPayload({ title: "Post to be deleted" });
            const createResponse = await request.post("/posts", {
                data: newPostData,
            });
            expect(createResponse.status()).toBe(201);
            const createPost = await createResponse.json(); 
            const postIdToDelete = createPost.id; 
            //Eliminar el post creado
            const deleteResponse = await request.delete(`/posts/${postIdToDelete}`);
            expect(deleteResponse.status()).toBe(200);
            // Verificar que el post fue eliminado
            const getResponse = await request.get(`/posts/${postIdToDelete}`, {
                failOnStatusCode: false, 
            });
            expect(getResponse.status()).toBe(404);
        }); 

        test("DELETE - Eliminar un post que no existe", async ({ request }) => {
            const nonExistentPostId = 9999;
            const response = await request.delete(`/posts/${nonExistentPostId}`, {
                failOnStatusCode: false, 
            }); 
            expect(response.status()).toBe(200);
        });
    });

    test.describe("PATCH Methods", () => {
        test("PATCH - Modifica parcialmente un post existente", async ({ request }) => {
            const initialPostData = {
                id: 1, 
                title: 'Initial Title',
                body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
                userId: 1,
            }; 

            const partialUpdate = {
                title: 'Partially Updated Title',
            }; 

            const response = await request.patch(`/posts/1`, {
                data: partialUpdate
            }); 
            expect(response.status()).toBe(200);
            const patchedPost = await response.json();

            expect(patchedPost.title).toBe(partialUpdate.title);
            expect(patchedPost.body).toBe(initialPostData.body);
            expect(patchedPost.userId).toBe(initialPostData.userId);
        }); 
    }); 
});