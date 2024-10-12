import { HandService } from "../../src/services/handService";
import prismaMock from "../singleton";
import { HandUploadFailed, HandParseError, HandNotFoundError } from "../../src/errors/handError";
import { promises as fs } from "fs";
import { UserNotFoundError } from "../../src/errors/userError";
import { Hand } from "@prisma/client";

jest.mock('fs', () => ({
    promises: {
      readFile: jest.fn(),
    },
    existsSync: jest.fn(),
  }));
  

describe('HandService', () => {
  let handService: HandService;

  beforeEach(() => {
    handService = new HandService();
    (handService as any).prisma = prismaMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processHandFile', () => {
    it('should throw UserNotFoundError if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const mockFile = { path: "mockPath" } as Express.Multer.File;

      await expect(handService.processHandFile(mockFile, "1"))
        .rejects
        .toThrow(UserNotFoundError);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" }
      });
    });

    it('should throw HandParseError on file processing error', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "1" } as any);
      (fs.readFile as jest.Mock).mockResolvedValue("invalid content");

      const mockFile = { path: "mockPath" } as Express.Multer.File;

      jest.spyOn(handService, 'parseHandEvents').mockImplementation(() => { throw new Error(); });

      await expect(handService.processHandFile(mockFile, "1")).rejects.toThrow(HandUploadFailed);
    });

    it('should process the file and return the hand', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "1" } as any);
      (fs.readFile as jest.Mock).mockResolvedValue("valid content");

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
        seatMapper: [],
        ownerId: "1", 
      };

      jest.spyOn(handService, 'parseHandEvents').mockReturnValue([]);
      jest.spyOn(handService, 'parseHandMetadata').mockReturnValue({
        handId: "mockHandId",
        startDateTime: new Date().toDateString(),
        endDateTime: new Date().toDateString(),
        gameType: "5 Card Omaha",
        blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: undefined },
        tableId: "table1",
        clubId: "1",
        maxSeats: 6,
        buttonSeat: 1,
        players: []
      });

      jest.spyOn(handService, 'createHand').mockResolvedValue({
        hand: mockHand,
        handEvents: []
      });

      const mockFile = { path: "mockPath" } as Express.Multer.File;
      const result = await handService.processHandFile(mockFile, "1");

      expect(result).toEqual(mockHand);
    });
  });

  describe('getHandsByUser', () => {
    it('should throw UserNotFoundError if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(handService.getHandsByUser("1"))
        .rejects
        .toThrow(UserNotFoundError);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" }
      });
    });

    it('should return hands for a specific user', async () => {
        const mockHands = [
            {
              id: "hand1",
              gameType: "5 Card Omaha",
              startDateTime: new Date(),
              endDateTime: new Date(),
              blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: null },
              tableId: "table1",
              clubId: 1, 
              maxSeats: 6, 
              buttonSeat: 2, 
              seatMapper: [],
              ownerId: "1", 
            },
            {
              id: "hand2",
              gameType: "5 Card Omaha",
              startDateTime: new Date(),
              endDateTime: new Date(),
              blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: null },
              tableId: "table2", 
              clubId: 1, 
              maxSeats: 6, 
              buttonSeat: 1, 
              seatMapper: [],
              ownerId: "1",
            }
          ];

      prismaMock.user.findUnique.mockResolvedValue({ id: "1" } as any);
      prismaMock.hand.findMany.mockResolvedValue(mockHands);

      const result = await handService.getHandsByUser("1");

      expect(result).toEqual(mockHands);
      expect(prismaMock.hand.findMany).toHaveBeenCalledWith({
        where: { ownerId: "1" }
      });
    });
  });

  describe('deleteUserHand', () => {
    it('should throw UserNotFoundError if the user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(handService.deleteUserHand("1", "hand123"))
        .rejects
        .toThrow(UserNotFoundError);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" }
      });
    });

    it('should throw HandNotFoundError if the hand does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "1" } as any);
      prismaMock.hand.findUnique.mockResolvedValue(null);

      await expect(handService.deleteUserHand("1", "hand123"))
        .rejects
        .toThrow(HandNotFoundError);

      expect(prismaMock.hand.findUnique).toHaveBeenCalledWith({
        where: { id: "hand123", ownerId: "1" }
      });
    });

    it('should delete a hand successfully', async () => {
      const mockHand = { id: "hand123" } as Hand;

      prismaMock.user.findUnique.mockResolvedValue({ id: "1" } as any);
      prismaMock.hand.findUnique.mockResolvedValue(mockHand);
      prismaMock.hand.delete.mockResolvedValue(mockHand);

      const result = await handService.deleteUserHand("1", "hand123");

      expect(result).toEqual(mockHand);
      expect(prismaMock.hand.delete).toHaveBeenCalledWith({
        where: { id: "hand123" }
      });
    });
  });
});
