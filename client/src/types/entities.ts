// types/entities.ts

// 👤 User Interface
export interface User {
    id: string;
    username: string;
    role: RoleName; // 'admin' or 'user'
}

// 🛡️ Role Name Type
export type RoleName = 'admin' | 'user';

// 📢 Ad Interface
export interface Ad {
    id: number;
    user_id: number;
    posted_by: string | null;
    sub_category: string | null;
    category: string | null;
    sub_category_id: number;
    title: string;
    description: string | null;
    location: string | null;
    price: number | null;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
}