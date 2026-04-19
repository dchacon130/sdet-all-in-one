import { expect, test } from "@playwright/test";

test.describe("Smoke tests for Users API", () => {
    test("Get - users from the json place holder", async ({ request }) => {
        const response = await request.get("/users"); 
        expect(response.status()).toBe(200);
        const users = await response.json();
        expect(users.length).toBeGreaterThan(0);
    });
});