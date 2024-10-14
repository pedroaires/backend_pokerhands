import bcrypt from 'bcryptjs';
import { signAccessToken } from '../utils/jwt';
import { PrismaClient, User  } from "@prisma/client";
import { InvalidCredentialsError, UserAlreadyExistsError, UserNotFoundError, UserWithUsernameNotFoundError } from "../errors/userError";

export class UserService {
    private prisma: PrismaClient;
    
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUser(userData: {username: string, password: string}): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: userData.username }
        });
        if (existingUser) {
            throw new UserAlreadyExistsError(userData.username);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 8);
        const user = this.prisma.user.create({
            data: {
                username: userData.username,
                password: hashedPassword
            }
        });
        return user;
    }

    async loginUser(username: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (!user) throw new UserWithUsernameNotFoundError(username);
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new InvalidCredentialsError();

        const token = signAccessToken(user);
        return { user, token };
    }

    //Only usefull for tests
    getAllUsers(): Promise<User[]> {
        const users = this.prisma.user.findMany();
        return users;
    }

    getUserById(id: string): Promise<User | null> {
        const user = this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new UserNotFoundError(id);
        }
        return user;
    }

    async updateUser(id: string, userData: {username: string, password: string}): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if (!existingUser) {
            throw new UserNotFoundError(id);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 8);
        const user = this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: userData.username,
                password: hashedPassword
            }
        });
        return user;
    }

    async deleteUser(id: string): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: id }
        });
        if (!existingUser) {
            throw new UserNotFoundError(id);
        }
        const user = await this.prisma.user.delete({
        where: {
            id: id
        }
        });
        return user;
    }
}