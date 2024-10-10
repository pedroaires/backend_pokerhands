import { PrismaClient, User  } from "@prisma/client";
import { NotFoundError } from "../errors/customErrors";
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
            throw new Error('User with username: ' + userData.username + ' already exists');
        }

        const user = this.prisma.user.create({
            data: {
                username: userData.username,
                password: userData.password
            }
        });
        return user;
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
        return user;
    }

    async updateUser(id: string, userData: {username: string, password: string}): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if (!existingUser) {
            throw new NotFoundError('User with id: ' + id + ' does not exist');
        }
        const user = this.prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: userData.username,
                password: userData.password
            }
        });
        return user;
    }

    deleteUser(id: string): Promise<User> {
        const existingUser = this.prisma.user.findUnique({
            where: { id: id }
        });
        if (!existingUser) {
            throw new NotFoundError('User with id: ' + id + ' does not exist');
        }
        const user = this.prisma.user.delete({
        where: {
            id: id
        }
        });
        return user;
    }
}