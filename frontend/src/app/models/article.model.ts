export interface Article {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: number;
  username?: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt?: Date;
}
