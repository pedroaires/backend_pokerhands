import { Request, Response } from "express";
import { InvitationController } from "../../src/controllers/invitationController";
import { InvitationService } from "../../src/services/invitationService";
import { InvitationStatus } from "@prisma/client";

jest.mock("../../src/services/invitationService");  // Mock the InvitationService

describe("InvitationController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let invitationController: InvitationController;
    let invitationServiceMock: jest.Mocked<InvitationService>;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        invitationServiceMock = new InvitationService() as jest.Mocked<InvitationService>;
        invitationController = new InvitationController(invitationServiceMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test sendInvitation
    describe("sendInvitation", () => {
        it("should return 400 if userId is missing", async () => {
            req.body = { inviteeUsername: "testUser" };

            await invitationController.sendInvitation(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });

        it("should return 400 if teamName is missing", async () => {
            req.params = { userId: "1" };
            req.body = { inviteeUsername: "testUser" };

            await invitationController.sendInvitation(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing team ID' });
        });

        it("should return 400 if inviteeUsername is missing", async () => {
            req.params = { userId: "1", teamName: "testTeam" };

            await invitationController.sendInvitation(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing invitee username' });
        });

        it("should send an invitation and return the invitation data", async () => {
            req.params = { userId: "1", teamName: "testTeam" };
            req.body = { inviteeUsername: "testUser" };

            const mockInvitation = {
                id: "invitation123",
                teamId: "team1",
                inviteeId: "2",
                status: InvitationStatus.PENDING,
                createdAt: new Date(),
            };
            

            invitationServiceMock.sendInvitation.mockResolvedValue(mockInvitation);

            await invitationController.sendInvitation(req as Request, res as Response);

            expect(invitationServiceMock.sendInvitation).toHaveBeenCalledWith("1", "testTeam", "testUser");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ message: 'Invitation sent', invitation: mockInvitation });
        });
    });

    // Test getPendingInvitations
    describe("getPendingInvitations", () => {
        it("should return 400 if userId is missing", async () => {
            await invitationController.getPendingInvitations(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });

        it("should return pending invitations for the user", async () => {
            req.params = { userId: "1" };
            const mockInvitations = [
                {
                  id: "invitation1",
                  teamId: "team1",
                  inviteeId: "user1",
                  status: InvitationStatus.PENDING,
                  createdAt: new Date(), 
                },
                {
                  id: "invitation2",
                  teamId: "team2",
                  inviteeId: "user2",
                  status: InvitationStatus.ACCEPTED,
                  createdAt: new Date(),
                }
              ];
              

            invitationServiceMock.getPendingInvitations.mockResolvedValue(mockInvitations);

            await invitationController.getPendingInvitations(req as Request, res as Response);

            expect(invitationServiceMock.getPendingInvitations).toHaveBeenCalledWith("1");
            expect(res.send).toHaveBeenCalledWith({ invitations: mockInvitations });
        });
    });

    // Test respondToInvitation
    describe("respondToInvitation", () => {
        it("should return 400 if invitationId is missing", async () => {
            req.body = { response: "ACCEPTED" };

            await invitationController.respondToInvitation(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing invitation ID' });
        });

        it("should return 400 if response is missing", async () => {
            req.params = { invitationId: "1", userId: "1" };

            await invitationController.respondToInvitation(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing response (ACCEPTED or REJECTED)' });
        });

        it("should respond to an invitation and return the updated invitation", async () => {
            req.params = { invitationId: "1", userId: "1" };
            req.body = { response: "ACCEPTED" };

            const mockUpdatedInvitation = {
                id: "invitation1",
                teamId: "team1",
                inviteeId: "user1",
                status: InvitationStatus.ACCEPTED,
                createdAt: new Date(),
              };

            invitationServiceMock.respondToInvitation.mockResolvedValue(mockUpdatedInvitation);

            await invitationController.respondToInvitation(req as Request, res as Response);

            expect(invitationServiceMock.respondToInvitation).toHaveBeenCalledWith("1", "1", "ACCEPTED");
            expect(res.send).toHaveBeenCalledWith({ message: 'Invitation updated', updatedInvitation: mockUpdatedInvitation });
        });
    });
});
