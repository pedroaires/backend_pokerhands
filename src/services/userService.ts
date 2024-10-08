import { PrismaClient  } from "@prisma/client";
export class UserService {
    createUser(userData: {username: string, password: string}): any {
        const prisma = new PrismaClient();
        const user = prisma.user.create({
            data: {
                username: userData.username,
                password: userData.password
            }
        });
        return user;
    }

    getAllUsers(): any {
        return [];
    }

    getUserById(id: string): any {
        return {};
    }

    updateUser(id: string, userData: {username: string, password: string}): any {
        return {};
    }

    deleteUser(id: string): any {
        return {};
    }
}