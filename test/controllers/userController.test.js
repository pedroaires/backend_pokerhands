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
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../../src/controllers/userController");
const userService_1 = require("../../src/services/userService");
jest.mock("../../src/services/userService"); // Mock the UserService
describe("UserController", () => {
    let req;
    let res;
    let userController;
    let userServiceMock;
    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        userServiceMock = new userService_1.UserService();
        userController = new userController_1.UserController(userServiceMock); // Inject mock UserService into the controller
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    // Create User Tests
    describe("Create User", () => {
        it("should return 400 if username is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { password: "testPassword" };
            yield userController.registerUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing Username' });
        }));
        it("should return 400 if password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { username: "testUser" };
            yield userController.registerUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing Password' });
        }));
        it("should create a user and return the user data", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { username: "testUser", password: "testPassword" };
            const mockUser = { id: "1", username: "testUser", password: "testPassword" };
            userServiceMock.createUser.mockResolvedValue(mockUser); // Mock the return of createUser
            yield userController.registerUser(req, res);
            expect(userServiceMock.createUser).toHaveBeenCalledWith({ username: "testUser", password: "testPassword" });
            expect(res.send).toHaveBeenCalledWith({ message: 'User registered', user: mockUser });
        }));
    });
    // Get All Users Tests
    describe("Get All Users", () => {
        it("should return all users", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUsers = [
                { id: "1", username: "testUser1", password: "testPassword1" },
                { id: "2", username: "testUser2", password: "testPassword2" }
            ];
            userServiceMock.getAllUsers.mockResolvedValue(mockUsers);
            yield userController.getAllUsers(req, res);
            expect(userServiceMock.getAllUsers).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(mockUsers);
        }));
    });
    // Get User by ID Tests
    describe("Get User by ID", () => {
        it("should return the user if found", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { id: "1", username: "testUser", password: "testPassword" };
            req.params = { id: "1" };
            userServiceMock.getUserById.mockResolvedValue(mockUser);
            yield userController.getUserById(req, res);
            expect(userServiceMock.getUserById).toHaveBeenCalledWith("1");
            expect(res.send).toHaveBeenCalledWith(mockUser);
        }));
    });
    // Update User Tests
    describe("Update User", () => {
        it("should return 400 if username or password is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { username: "testUser" }; // Password missing
            req.params = { id: "1" };
            yield userController.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing password' });
        }));
        it("should update a user and return the updated user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedUser = { id: "1", username: "updatedUser", password: "updatedPassword" };
            req.body = { username: "updatedUser", password: "updatedPassword" };
            req.params = { id: "1" };
            userServiceMock.updateUser.mockResolvedValue(mockUpdatedUser);
            yield userController.updateUser(req, res);
            expect(userServiceMock.updateUser).toHaveBeenCalledWith("1", {
                username: "updatedUser",
                password: "updatedPassword"
            });
            expect(res.send).toHaveBeenCalledWith({ message: 'User updated', user: mockUpdatedUser });
        }));
    });
    // Delete User Tests
    describe("Delete User", () => {
        it("should delete a user and return success message", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: "1" };
            userServiceMock.deleteUser.mockResolvedValue({ id: "1", username: "testUser", password: "testPassword" });
            yield userController.deleteUser(req, res);
            expect(userServiceMock.deleteUser).toHaveBeenCalledWith("1");
            expect(res.send).toHaveBeenCalledWith({ message: 'User deleted' });
        }));
    });
});
