export interface IGearItemPayload {
    title: string;
    description: string;
    pricePerDay: number;
    location: string;
    brand: string;
    stock?: number;
    categoryId: string;
}

export interface IGearQueryFilters {
    searchTerm?: string;
    category?: string;
    brand?: string;
    availability?: 'true' | 'false';
    minPrice?: string;
    maxPrice?: string;
    location?: string; // 👈 এই ফিল্ডটি যুক্ত করুন, যাতে ?location=Mirpur কুয়েরিটি টাইপ-সেফ হয়
    page?: string;
    limit?: string;
}