import { Request, Response } from "express";
import { HandController } from "../../src/controllers/handController";
import { HandService } from "../../src/services/handService";

jest.mock("../../src/services/handService");

describe("HandController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let handController: HandController;
    let handServiceMock: jest.Mocked<HandService>;

    beforeEach(() => {
        req = {
            file: undefined,
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };

        handServiceMock = new HandService() as jest.Mocked<HandService>;
        handController = new HandController(handServiceMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Upload Hand File", () => {
        it("should return 400 if no file is uploaded", async () => {
            req.params = { userId: "1" };

            await handController.uploadHandFile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
        });

        it("should return 500 if there is an error during file processing", async () => {
            req.params = { userId: "1" };
            req.file = {
                originalname: "test.txt",
                path: "/uploads/test.txt",
                filename: "test.txt"
            } as Express.Multer.File;

            handServiceMock.processHandFile.mockRejectedValue(new Error("File processing error"));

            await handController.uploadHandFile(req as Request, res as Response);

            expect(handServiceMock.processHandFile).toHaveBeenCalledWith(req.file, "1");
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to upload file' });
        });

        it("should upload a file and return success message", async () => {
            req.params = { userId: "1" };
            req.file = {
                originalname: "test.txt",
                path: "/uploads/test.txt",
                filename: "test.txt"
            } as Express.Multer.File;

            handServiceMock.processHandFile.mockResolvedValue("File processed successfully");

            await handController.uploadHandFile(req as Request, res as Response);

            expect(handServiceMock.processHandFile).toHaveBeenCalledWith(req.file, "1");
            expect(res.json).toHaveBeenCalledWith({
                message: 'File uploaded and processed successfully',
                result: "File processed successfully"
            });
        });
    });
});
