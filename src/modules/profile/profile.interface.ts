export interface IProfileUpdatePayload {
    name?: string; // Stored directly within the primary User model table
    photo?: string;
    bio?: string;
    phone?: string;
    address?: string;
    city?: string;
}