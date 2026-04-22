import { APIRequestContext } from '@playwright/test';

/**
 * Clase que encapsula todas las operaciones para el recurso 'posts'.
 * Es el equivalente a una Page Class en el patrón POM.
 */
class PostsAPI {
    constructor(private request: APIRequestContext) {}

    getAll() {
        return this.request.get('/posts');
    }

    getById(id: number) {
        return this.request.get(`/posts/${id}`);
    }

    create(payload: object) {
        return this.request.post('/posts', { data: payload });
    }
}

/**
 * El cliente principal que agrupa todos los recursos de la API.
 * Los tests interactuarán con esta clase, no directamente con `request`.
 */
export class APIClient {
    public readonly posts: PostsAPI;

    constructor(request: APIRequestContext) {
        this.posts = new PostsAPI(request);
        // Si tuvieras más recursos, los inicializarías aquí:
        // this.users = new UsersAPI(request);
    }
}