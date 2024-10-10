import { UserService } from '../../src/services/userService';
import { UserAlreadyExistsError, UserNotFoundError } from '../../src/errors/userError';
import prismaMock from '../singleton';  // The mocked Prisma client

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        (userService as any).prisma = prismaMock;  // Replace the actual Prisma client with the mock
    });

    afterEach(() => {
        jest.clearAllMocks();  // Clear mocks after each test to avoid state leakage
    });

    // Test for createUser
    describe('createUser', () => {
        it('should throw UserAlreadyExistsError if user already exists', async () => {
            const mockUserData = { username: 'testUser', password: 'testPassword' };

            prismaMock.user.findUnique.mockResolvedValue({ id: '1', ...mockUserData });

            await expect(userService.createUser(mockUserData)).rejects.toThrow(UserAlreadyExistsError);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { username: mockUserData.username }
            });
        });

        it('should create a new user if user does not exist', async () => {
            const mockUserData = { username: 'testUser', password: 'testPassword' };
            const mockCreatedUser = { id: '1', ...mockUserData };

            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue(mockCreatedUser);

            const createdUser = await userService.createUser(mockUserData);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { username: mockUserData.username }
            });
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: mockUserData
            });
            expect(createdUser).toEqual(mockCreatedUser);
        });
    });

    // Test for getAllUsers
    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: '1', username: 'user1', password: 'password1' },
                { id: '2', username: 'user2', password: 'password2' },
            ];

            prismaMock.user.findMany.mockResolvedValue(mockUsers);

            const users = await userService.getAllUsers();

            expect(prismaMock.user.findMany).toHaveBeenCalled();
            expect(users).toEqual(mockUsers);
        });
    });

    // Test for getUserById
    describe('getUserById', () => {
        it('should return the user if found', async () => {
            const mockUser = { id: '1', username: 'testUser', password: 'testPassword' };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const user = await userService.getUserById('1');

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(user).toEqual(mockUser);
        });

        it('should return null if user is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const user = await userService.getUserById('1');

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(user).toBeNull();
        });
    });

    // Test for updateUser
    describe('updateUser', () => {
        it('should throw UserNotFoundError if user does not exist', async () => {
            const mockUserData = { username: 'updatedUser', password: 'updatedPassword' };

            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.updateUser('1', mockUserData)).rejects.toThrow(UserNotFoundError);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('should update the user if user exists', async () => {
            const mockUserData = { username: 'updatedUser', password: 'updatedPassword' };
            const mockUpdatedUser = { id: '1', ...mockUserData };

            prismaMock.user.findUnique.mockResolvedValue(mockUpdatedUser);
            prismaMock.user.update.mockResolvedValue(mockUpdatedUser);

            const updatedUser = await userService.updateUser('1', mockUserData);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: mockUserData
            });
            expect(updatedUser).toEqual(mockUpdatedUser);
        });
    });

    // Test for deleteUser
    describe('deleteUser', () => {
        it('should throw UserNotFoundError if user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.deleteUser('1')).rejects.toThrow(UserNotFoundError);
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('should delete the user if user exists', async () => {
            const mockDeletedUser = { id: '1', username: 'testUser', password: 'testPassword' };

            prismaMock.user.findUnique.mockResolvedValue(mockDeletedUser);
            prismaMock.user.delete.mockResolvedValue(mockDeletedUser);

            const deletedUser = await userService.deleteUser('1');

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(prismaMock.user.delete).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(deletedUser).toEqual(mockDeletedUser);
        });
    });
});
