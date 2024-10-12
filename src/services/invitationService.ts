import { PrismaClient, Invitation, InvitationStatus } from "@prisma/client";
import { InvalidStatusError, InvitationAlreadyExistsError, InvitationNotFoundError, UserIsAlreadyTeamMember, UserNotAuthorizedForInvitationError } from "../errors/invitationError";
import { TeamUnauthorizedError, TeamWithNameNotFoundError } from "../errors/teamError";
import { UserNotFoundError, UserWithUsernameNotFoundError } from "../errors/userError";
export class InvitationService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async sendInvitation(userId: string, teamName: string, inviteeUsername: string): Promise<Invitation> {
        const teamExists = await this.prisma.team.findUnique({
            where: { name: teamName },
            include: { owner: true, users: true }
        });

        if (!teamExists) {
            throw new TeamWithNameNotFoundError(teamName);
        }
        if (teamExists.owner.id !== userId) {
            throw new TeamUnauthorizedError(userId, teamName);
        }

        const invitee = await this.prisma.user.findUnique({
            where: { username: inviteeUsername }
        });

        if (!invitee) {
            throw new UserWithUsernameNotFoundError(inviteeUsername);
        }

        if (teamExists.users.some(user => user.id === invitee.id)) {
            throw new UserIsAlreadyTeamMember(inviteeUsername, teamName);
        }

        const existingInvitation = await this.prisma.invitation.findFirst({
            where: {
                teamId: teamExists.id,
                inviteeId: invitee.id,
                status: InvitationStatus.PENDING
            }
        });

        if (existingInvitation) {
            throw new InvitationAlreadyExistsError(teamName, inviteeUsername);
        }

        const invitation = await this.prisma.invitation.create({
            data: {
                teamId: teamExists.id,
                inviteeId: invitee.id,
                status: InvitationStatus.PENDING
            }
        });

        return invitation;
    }

    async getPendingInvitations(userId: string): Promise<Invitation[]> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            throw new UserNotFoundError(userId);
        }

        return this.prisma.invitation.findMany({
            where: {
                inviteeId: userId,
                status: InvitationStatus.PENDING
            }
        });
    }

    async respondToInvitation(userId:string, invitationId: string, response: string): Promise<Invitation> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            throw new UserNotFoundError(userId);
        }

        const invitation = await this.prisma.invitation.findUnique({
            where: { id: invitationId }
        });

        if (!invitation) {
            throw new InvitationNotFoundError(invitationId);
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            throw new Error('Invitation already responded to');
        }

        if (invitation.inviteeId !== userId) {
            throw new UserNotAuthorizedForInvitationError(userId, invitationId);
        }

        // convert response to enum
        let newStatus: InvitationStatus;
        if (response === 'ACCEPTED') {
            newStatus = InvitationStatus.ACCEPTED;
        } else if (response === 'REJECTED') {
            newStatus = InvitationStatus.REJECTED;
        } else {
            throw new InvalidStatusError(response);
        }

        if (newStatus === InvitationStatus.ACCEPTED) {
            await this.prisma.team.update({
                where: { id: invitation.teamId },
                data: {
                    users: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });
        }

        const updatedInvitation = await this.prisma.invitation.update({
            where: { id: invitationId },
            data: { status: newStatus }
        });

        return updatedInvitation;
    }
}
