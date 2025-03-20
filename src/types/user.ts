
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
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: string;
}
