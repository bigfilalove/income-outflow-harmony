
import jwt from 'jsonwebtoken';
import { LocalUser, ILocalUser } from '../../models/LocalUser';
import { User } from '../../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'finance-tracker-local-secret-key';
const JWT_EXPIRES_IN = '7d';

export class LocalAuthService {
  static async login(username: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      // Find user by username or email
      const localUser = await LocalUser.findOne({
        $or: [{ username }, { email: username }]
      });

      if (!localUser || !(await localUser.comparePassword(password))) {
        return null;
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: localUser._id, 
          username: localUser.username,
          role: localUser.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Convert to app User type
      const user: User = {
        id: localUser._id.toString(),
        name: localUser.name,
        email: localUser.email,
        username: localUser.username,
        password: '', // Never return password
        role: localUser.role,
        createdAt: localUser.createdAt
      };

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async register(userData: {
    name: string;
    email: string;
    username: string;
    password: string;
    role?: 'admin' | 'user' | 'basic';
  }): Promise<{ user: User; token: string } | null> {
    try {
      // Check if user already exists
      const existingUser = await LocalUser.findOne({
        $or: [{ username: userData.username }, { email: userData.email }]
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const localUser = new LocalUser(userData);
      await localUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: localUser._id, 
          username: localUser.username,
          role: localUser.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Convert to app User type
      const user: User = {
        id: localUser._id.toString(),
        name: localUser.name,
        email: localUser.email,
        username: localUser.username,
        password: '', // Never return password
        role: localUser.role,
        createdAt: localUser.createdAt
      };

      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const localUser = await LocalUser.findById(decoded.id);

      if (!localUser) {
        return null;
      }

      const user: User = {
        id: localUser._id.toString(),
        name: localUser.name,
        email: localUser.email,
        username: localUser.username,
        password: '', // Never return password
        role: localUser.role,
        createdAt: localUser.createdAt
      };

      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  static async createAdminUser(): Promise<void> {
    try {
      const adminExists = await LocalUser.findOne({ role: 'admin' });
      
      if (!adminExists) {
        const adminUser = new LocalUser({
          name: 'Администратор',
          email: 'admin@localhost',
          username: 'admin',
          password: 'admin123',
          role: 'admin'
        });
        
        await adminUser.save();
        console.log('Default admin user created: admin/admin123');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }
}
