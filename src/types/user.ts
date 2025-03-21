
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string; 
  role: 'admin' | 'user' | 'basic';
  createdAt: Date;
}

export interface ServerUser {
  _id?: string; // MongoDB id
  id?: string; // For backwards compatibility
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: string;
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}
