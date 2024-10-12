import { InvitationService } from '../../src/services/invitationService';
import { InvitationStatus } from '@prisma/client';
import { InvalidStatusError, InvitationAlreadyExistsError, InvitationNotFoundError, UserIsAlreadyTeamMember, UserNotAuthorizedForInvitationError } from '../../src/errors/invitationError';
import { TeamUnauthorizedError, TeamWithNameNotFoundError } from '../../src/errors/teamError';
import { UserNotFoundError, UserWithUsernameNotFoundError } from '../../src/errors/userError';
import prismaMock from '../singleton';

describe('InvitationService', () => {
    let invitationService: InvitationService;

    beforeEach(() => {
        invitationService = new InvitationService();
        (invitationService as any).prisma = prismaMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('sendInvitation', () => {
        it('should throw TeamWithNameNotFoundError if team does not exist', async () => {
            prismaMock.team.findUnique.mockResolvedValue(null);

            await expect(invitationService.sendInvitation('1', 'nonExistingTeam', 'inviteeUsername'))
                .rejects
                .toThrow(TeamWithNameNotFoundError);

            expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
                where: { name: 'nonExistingTeam' },
                include: { owner: true, users: true }
            });
        });

        it('should throw TeamUnauthorizedError if the user is not the team owner', async () => {
            const mockTeam = {
                id: '1',
                name: 'testTeam',
                ownerId: '2',
                users: []
            };
        
            prismaMock.team.findUnique.mockResolvedValue(mockTeam);
        
            await expect(invitationService.sendInvitation('1', 'testTeam', 'inviteeUsername'))
                .rejects
                .toThrow(TeamUnauthorizedError);
        
            expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
                where: { name: 'testTeam' },
                include: { owner: true, users: true } 
            });
        });

        it('should throw UserWithUsernameNotFoundError if invitee does not exist', async () => {
            const mockTeam = { id: '1', name: 'testTeam', ownerId: '1', users: [] };

            prismaMock.team.findUnique.mockResolvedValue(mockTeam);
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(invitationService.sendInvitation('1', 'testTeam', 'nonExistingUser'))
                .rejects
                .toThrow(UserWithUsernameNotFoundError);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { username: 'nonExistingUser' } });
        });

        it('should throw UserIsAlreadyTeamMember if invitee is already in the team', async () => {
            const mockTeam = {
                id: '1',
                name: 'testTeam',
                ownerId: '1',
                users: [{ id: '2', username: 'inviteeUsername' }]
            };

            prismaMock.team.findUnique.mockResolvedValue(mockTeam);
            prismaMock.user.findUnique.mockResolvedValue({ id: '2', username: 'inviteeUsername', password: 'inviteePassword' });

            await expect(invitationService.sendInvitation('1', 'testTeam', 'inviteeUsername'))
                .rejects
                .toThrow(UserIsAlreadyTeamMember);

            expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
                where: { name: 'testTeam' },
                include: { owner: true, users: true }
            });
        });

        it('should send an invitation successfully', async () => {
            const mockTeam = { id: '1', name: 'testTeam', ownerId: '1' , users: [] };
            const mockInvitee = { id: '2', username: 'inviteeUsername', password: 'inviteePassword' };
            const mockInvitation = {
                id: 'invitation1',
                teamId: '1',
                inviteeId: '2',
                status: InvitationStatus.PENDING,
                createdAt: new Date()
            };

            prismaMock.team.findUnique.mockResolvedValue(mockTeam);
            prismaMock.user.findUnique.mockResolvedValue(mockInvitee);
            prismaMock.invitation.findFirst.mockResolvedValue(null);
            prismaMock.invitation.create.mockResolvedValue(mockInvitation);

            const invitation = await invitationService.sendInvitation('1', 'testTeam', 'inviteeUsername');

            expect(prismaMock.invitation.create).toHaveBeenCalledWith({
                data: {
                    teamId: '1',
                    inviteeId: '2',
                    status: InvitationStatus.PENDING
                }
            });

            expect(invitation).toEqual(mockInvitation);
        });
    });

    describe('getPendingInvitations', () => {
        it('should throw UserNotFoundError if the user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(invitationService.getPendingInvitations('1'))
                .rejects
                .toThrow(UserNotFoundError);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('should return pending invitations for the user', async () => {
            const mockInvitations = [
                {
                    id: 'invitation1',
                    teamId: 'team1',
                    inviteeId: '1',
                    status: InvitationStatus.PENDING,
                    createdAt: new Date()
                }
            ];

            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            prismaMock.invitation.findMany.mockResolvedValue(mockInvitations);

            const invitations = await invitationService.getPendingInvitations('1');

            expect(prismaMock.invitation.findMany).toHaveBeenCalledWith({
                where: {
                    inviteeId: '1',
                    status: InvitationStatus.PENDING
                }
            });

            expect(invitations).toEqual(mockInvitations);
        });
    });

    describe('respondToInvitation', () => {
        it('should throw UserNotFoundError if user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(invitationService.respondToInvitation('1', 'invitation1', 'ACCEPTED'))
                .rejects
                .toThrow(UserNotFoundError);

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('should throw InvitationNotFoundError if invitation does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            prismaMock.invitation.findUnique.mockResolvedValue(null);

            await expect(invitationService.respondToInvitation('1', 'invitation1', 'ACCEPTED'))
                .rejects
                .toThrow(InvitationNotFoundError);

            expect(prismaMock.invitation.findUnique).toHaveBeenCalledWith({
                where: { id: 'invitation1' }
            });
        });

        it('should update invitation status to ACCEPTED', async () => {
            const mockInvitation = {
                id: 'invitation1',
                teamId: 'team1',
                inviteeId: '1',
                status: InvitationStatus.PENDING,
                createdAt: new Date()
            };

            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            prismaMock.invitation.findUnique.mockResolvedValue(mockInvitation);
            prismaMock.invitation.update.mockResolvedValue({
                ...mockInvitation,
                status: InvitationStatus.ACCEPTED
            });

            await invitationService.respondToInvitation('1', 'invitation1', 'ACCEPTED');

            expect(prismaMock.invitation.update).toHaveBeenCalledWith({
                where: { id: 'invitation1' },
                data: { status: InvitationStatus.ACCEPTED }
            });
        });
    });
});
