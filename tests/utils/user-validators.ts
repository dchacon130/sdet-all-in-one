import { expect } from "@playwright/test";

export interface User {
    id: number; 
    name: string; 
    email: string;
    address: {
        street: string; 
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string; 
            lng: string;
        }
    };
    phone: string;
    website: string; 
    company: {
        name: string;
        catchPhrase: string;
        bs: string; 
    }
}

export function validateUserContract(user: any){
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");

    expect(typeof user.id).toBe("number");
    expect(typeof user.name).toBe("string");
}