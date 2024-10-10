"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../../src/services/userService");
const userError_1 = require("../../src/errors/userError");
const singleton_1 = __importDefault(require("../singleton")); // The mocked Prisma client
describe('UserService', () => {
    let userService;
    beforeEach(() => {
        userService = new userService_1.UserService();
        userService.prisma = singleton_1.default; // Replace the actual Prisma client with the mock
    });
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to avoid state leakage
    });
    // Test for createUser
    describe('createUser', () => {
        it('should throw UserAlreadyExistsError if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = { username: 'testUser', password: 'testPassword' };
            singleton_1.default.user.findUnique.mockResolvedValue(Object.assign({ id: '1' }, mockUserData));
            yield expect(userService.createUser(mockUserData)).rejects.toThrow(userError_1.UserAlreadyExistsError);
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { username: mockUserData.username }
            });
        }));
        it('should create a new user if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = { username: 'testUser', password: 'testPassword' };
            const mockCreatedUser = Object.assign({ id: '1' }, mockUserData);
            singleton_1.default.user.findUnique.mockResolvedValue(null);
            singleton_1.default.user.create.mockResolvedValue(mockCreatedUser);
            const createdUser = yield userService.createUser(mockUserData);
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { username: mockUserData.username }
            });
            expect(singleton_1.default.user.create).toHaveBeenCalledWith({
                data: mockUserData
            });
            expect(createdUser).toEqual(mockCreatedUser);
        }));
    });
    // Test for getAllUsers
    describe('getAllUsers', () => {
        it('should return all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUsers = [
                { id: '1', username: 'user1', password: 'password1' },
                { id: '2', username: 'user2', password: 'password2' },
            ];
            singleton_1.default.user.findMany.mockResolvedValue(mockUsers);
            const users = yield userService.getAllUsers();
            expect(singleton_1.default.user.findMany).toHaveBeenCalled();
            expect(users).toEqual(mockUsers);
        }));
    });
    // Test for getUserById
    describe('getUserById', () => {
        it('should return the user if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { id: '1', username: 'testUser', password: 'testPassword' };
            singleton_1.default.user.findUnique.mockResolvedValue(mockUser);
            const user = yield userService.getUserById('1');
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(user).toEqual(mockUser);
        }));
        it('should return null if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            singleton_1.default.user.findUnique.mockResolvedValue(null);
            const user = yield userService.getUserById('1');
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(user).toBeNull();
        }));
    });
    // Test for updateUser
    describe('updateUser', () => {
        it('should throw UserNotFoundError if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = { username: 'updatedUser', password: 'updatedPassword' };
            singleton_1.default.user.findUnique.mockResolvedValue(null);
            yield expect(userService.updateUser('1', mockUserData)).rejects.toThrow(userError_1.UserNotFoundError);
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        }));
        it('should update the user if user exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserData = { username: 'updatedUser', password: 'updatedPassword' };
            const mockUpdatedUser = Object.assign({ id: '1' }, mockUserData);
            singleton_1.default.user.findUnique.mockResolvedValue(mockUpdatedUser);
            singleton_1.default.user.update.mockResolvedValue(mockUpdatedUser);
            const updatedUser = yield userService.updateUser('1', mockUserData);
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(singleton_1.default.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: mockUserData
            });
            expect(updatedUser).toEqual(mockUpdatedUser);
        }));
    });
    // Test for deleteUser
    describe('deleteUser', () => {
        it('should throw UserNotFoundError if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            singleton_1.default.user.findUnique.mockResolvedValue(null);
            yield expect(userService.deleteUser('1')).rejects.toThrow(userError_1.UserNotFoundError);
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        }));
        it('should delete the user if user exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDeletedUser = { id: '1', username: 'testUser', password: 'testPassword' };
            singleton_1.default.user.findUnique.mockResolvedValue(mockDeletedUser);
            singleton_1.default.user.delete.mockResolvedValue(mockDeletedUser);
            const deletedUser = yield userService.deleteUser('1');
            expect(singleton_1.default.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(singleton_1.default.user.delete).toHaveBeenCalledWith({
                where: { id: '1' }
            });
            expect(deletedUser).toEqual(mockDeletedUser);
        }));
    });
});
