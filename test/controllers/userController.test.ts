import { Request, Response } from "express";
import { UserController } from "../../src/controllers/userController";
import { UserService } from "../../src/services/userService";

jest.mock("../../src/services/userService");  // Mock the UserService

describe("UserController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let userController: UserController;
    let userServiceMock: jest.Mocked<UserService>;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        userServiceMock = new UserService() as jest.Mocked<UserService>;
        userController = new UserController(userServiceMock);  // Inject mock UserService into the controller
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Create User Tests
    describe("Create User", () => {
        it("should return 400 if username is missing", async () => {
            req.body = { password: "testPassword" };

            await userController.registerUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing Username' });
        });

        it("should return 400 if password is missing", async () => {
            req.body = { username: "testUser" };

            await userController.registerUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing Password' });
        });

        it("should create a user and return the user data", async () => {
            req.body = { username: "testUser", password: "testPassword" };
            const mockUser = { id: "1", username: "testUser" };

            userServiceMock.createUser.mockResolvedValue(mockUser);  // Mock the return of createUser

            await userController.registerUser(req as Request, res as Response);

            expect(userServiceMock.createUser).toHaveBeenCalledWith({ username: "testUser", password: "testPassword" });
            expect(res.send).toHaveBeenCalledWith({ message: 'User registered', user: mockUser });
        });
    });

    // Get All Users Tests
    describe("Get All Users", () => {
        it("should return all users", async () => {
            const mockUsers = [
                { id: "1", username: "testUser1" },
                { id: "2", username: "testUser2" }
            ];

            userServiceMock.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getAllUsers(req as Request, res as Response);

            expect(userServiceMock.getAllUsers).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(mockUsers);
        });
    });

    // Get User by ID Tests
    describe("Get User by ID", () => {
        it("should return 404 if user is not found", async () => {
            req.params = { id: "1" };
            userServiceMock.getUserById.mockResolvedValue(null);

            await userController.getUserById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it("should return the user if found", async () => {
            const mockUser = { id: "1", username: "testUser" };
            req.params = { id: "1" };

            userServiceMock.getUserById.mockResolvedValue(mockUser);

            await userController.getUserById(req as Request, res as Response);

            expect(userServiceMock.getUserById).toHaveBeenCalledWith("1");
            expect(res.send).toHaveBeenCalledWith(mockUser);
        });
    });

    // Update User Tests
    describe("Update User", () => {
        it("should return 400 if username or password is missing", async () => {
            req.body = { username: "testUser" }; // Password missing
            req.params = { id: "1" };

            await userController.updateUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing username or password' });
        });

        it("should return 404 if user is not found", async () => {
            req.body = { username: "testUser", password: "testPassword" };
            req.params = { id: "1" };

            userServiceMock.updateUser.mockResolvedValue(null);

            await userController.updateUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it("should update a user and return the updated user", async () => {
            const mockUpdatedUser = { id: "1", username: "updatedUser" };
            req.body = { username: "updatedUser", password: "updatedPassword" };
            req.params = { id: "1" };

            userServiceMock.updateUser.mockResolvedValue(mockUpdatedUser);

            await userController.updateUser(req as Request, res as Response);

            expect(userServiceMock.updateUser).toHaveBeenCalledWith("1", {
                username: "updatedUser",
                password: "updatedPassword"
            });
            expect(res.send).toHaveBeenCalledWith({ message: 'User updated', user: mockUpdatedUser });
        });
    });

    // Delete User Tests
    describe("Delete User", () => {
        it("should return 404 if user is not found", async () => {
            req.params = { id: "1" };
            userServiceMock.deleteUser.mockResolvedValue(null);

            await userController.deleteUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it("should delete a user and return success message", async () => {
            req.params = { id: "1" };
            userServiceMock.deleteUser.mockResolvedValue(true);

            await userController.deleteUser(req as Request, res as Response);

            expect(userServiceMock.deleteUser).toHaveBeenCalledWith("1");
            expect(res.send).toHaveBeenCalledWith({ message: 'User deleted' });
        });
    });
});
