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

        it("should upload a file and return success message", async () => {
            req.params = { userId: "1" };
            req.file = {
                originalname: "test.txt",
                path: "/uploads/test.txt",
                filename: "test.txt"
            } as Express.Multer.File;
            const mockHand = {
                id: "hand123",
                startDateTime: new Date(),
                endDateTime: new Date(),
                gameType: "5 Card Omaha",
                blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: null },
                tableId: "table1",
                clubId: 1,
                maxSeats: 6,
                buttonSeat: 1,
                ownerId: "1",
                seatMapper: []
            };
            handServiceMock.processHandFile.mockResolvedValue(mockHand);

            await handController.uploadHandFile(req as Request, res as Response);

            expect(handServiceMock.processHandFile).toHaveBeenCalledWith(req.file, "1");
            expect(res.json).toHaveBeenCalledWith({
                message: 'File uploaded and processed successfully',
                result: mockHand 
            });
        });
    });


    describe("getHands", () => {

        it("should return all hands for a specific user", async () => {
            req.params = { userId: "1" };
            const mockHands = [
                {
                    id: "1",
                    startDateTime: new  Date("2024-01-01T10:00:00Z"),
                    endDateTime: new Date("2024-01-01T10:30:00Z"),
                    gameType: "5 Card Omaha Pot Limit",
                    blinds: { smallBlind: "¥0.50", bigBlind: "¥1.00", ante: "¥0.10" },
                    tableId: "SPMA_14625_26269934",
                    clubId: 14625,
                    maxSeats: 6,
                    buttonSeat: 2,
                    players: [
                        { id: 1, username: "Player1", club_id: 14625 },
                        { id: 2, username: "Player2", club_id: 14625 }
                    ],
                    ownerId: "1",
                    seatMapper: []
                },
                {
                    id: "2",
                    startDateTime: new Date("2024-01-02T11:00:00Z"),
                    endDateTime: new Date("2024-01-02T11:40:00Z"),
                    gameType: "5 Card Omaha Pot Limit",
                    blinds: { smallBlind: "¥0.50", bigBlind: "¥1.00", ante: "¥0.10" },
                    tableId: "SPMA_14625_26269935",
                    clubId: 14625,
                    maxSeats: 6,
                    buttonSeat: 3,
                    players: [
                        { id: 3, username: "Player3", club_id: 14625 },
                        { id: 4, username: "Player4", club_id: 14625 }
                    ],
                    ownerId: "1",
                    seatMapper: []
                }
            ];
            handServiceMock.getHandsByUser.mockResolvedValue(mockHands);

            await handController.getHands(req as Request, res as Response);

            expect(handServiceMock.getHandsByUser).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith({ hands: mockHands });
        });
    });
});
