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
const handController_1 = require("../../src/controllers/handController");
const handService_1 = require("../../src/services/handService");
jest.mock("../../src/services/handService");
describe("HandController", () => {
    let req;
    let res;
    let handController;
    let handServiceMock;
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
        handServiceMock = new handService_1.HandService();
        handController = new handController_1.HandController(handServiceMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Upload Hand File", () => {
        it("should return 400 if no file is uploaded", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { userId: "1" };
            yield handController.uploadHandFile(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
        }));
        it("should upload a file and return success message", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { userId: "1" };
            req.file = {
                originalname: "test.txt",
                path: "/uploads/test.txt",
                filename: "test.txt"
            };
            handServiceMock.processHandFile.mockResolvedValue("File processed successfully");
            yield handController.uploadHandFile(req, res);
            expect(handServiceMock.processHandFile).toHaveBeenCalledWith(req.file, "1");
            expect(res.json).toHaveBeenCalledWith({
                message: 'File uploaded and processed successfully',
                result: "File processed successfully"
            });
        }));
    });
    // Tests for getHands
    describe("getHands", () => {
        it("should return all hands for a specific user", () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { userId: "1" };
            const mockHands = [
                {
                    id: "1",
                    startDateTime: new Date("2024-01-01T10:00:00Z"),
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
                    ownerId: "1"
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
                    ownerId: "1"
                }
            ];
            handServiceMock.getHandsByUser.mockResolvedValue(mockHands);
            yield handController.getHands(req, res);
            expect(handServiceMock.getHandsByUser).toHaveBeenCalledWith("1");
            expect(res.json).toHaveBeenCalledWith({ hands: mockHands });
        }));
    });
});
