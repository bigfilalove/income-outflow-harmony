
// User related types

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: Date;
  image?: string;
}

export interface ServerUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'basic';
  createdAt: string;
  image?: string;
}

export type UserCredentials = {
  username: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  username: string;
  password: string;
};
