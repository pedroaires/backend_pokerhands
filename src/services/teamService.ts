import { PrismaClient } from '@prisma/client';
import { Team, Hand } from '@prisma/client';
import { UserNotFoundError } from '../errors/userError';
import { TeamAlreadyExistsError, TeamUnauthorizedError, TeamWithNameNotFoundError } from '../errors/teamError';
export class TeamService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createTeam(userId: string, data: { name: string }): Promise<Team> {
        const teamExists = await this.prisma.team.findFirst({
            where: { name: data.name },
        });
        if (teamExists) {
            throw new TeamAlreadyExistsError(data.name);
        }
        return this.prisma.team.create({
            data: {
                ownerId: userId,
                name: data.name,
                users: { connect: { id: userId } },
            },
        });
    }

    async getTeamsByUser(userId: string): Promise<Team[]> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new UserNotFoundError(userId);
        }
        return this.prisma.team.findMany({
            where: {
                ownerId: userId,
            },
        });
    }

    async getTeamHands(userId:string, teamName: string): Promise<Hand[]> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            throw new UserNotFoundError(userId);
        }
        const teamExists = await this.prisma.team.findFirst({
            where: { name: teamName },
            include: { users: true },
        });
        if (!teamExists) {
            throw new TeamWithNameNotFoundError(teamName);
        }

        const isAuthorized = teamExists.users.some((user) => user.id === userId);
        if (!isAuthorized) {
            throw new TeamUnauthorizedError(userId, teamName);
        }

        return this.prisma.hand.findMany({
            where: {
                owner: {
                    teams: {
                        some: { id: teamExists.id },
                    },
                },
            },
        });
    }

    async deleteTeam(teamName: string, userId: string): Promise<Team | null> {
        const team = await this.prisma.team.findFirst({
            where: { name: teamName },
        });
        if (!team) {
            throw new TeamWithNameNotFoundError(teamName);
        }
        const isAuthorized = team.ownerId === userId;
        if (!isAuthorized) {
            throw new TeamUnauthorizedError(userId, teamName);
        }

        await this.prisma.team.delete({ where: { name: teamName } });
        return team;
    }

    async updateTeam(teamName: string, userId: string, data: { newName: string }): Promise<Team | null> {
        const team = await this.prisma.team.findFirst({
            where: { name: teamName },
        });

        if (!team) {
            throw new TeamWithNameNotFoundError(teamName);
        }
        const isAuthorized = team.ownerId === userId;
        if (!isAuthorized) {
            throw new TeamUnauthorizedError(userId, teamName);
        }

        const teamExists = await this.prisma.team.findFirst({
            where: { name: data.newName },
        });
        if (teamExists) {
            throw new TeamAlreadyExistsError(data.newName);
        }

        return this.prisma.team.update({
            where: { id: team.id },
            data: { name: data.newName },
        });
    }

    async listTeamUsers(teamName: string, userId: string): Promise<{ id: string; username: string }[]> {
        const team = await this.prisma.team.findFirst({
            where: { name: teamName },
            include: { users: true },
        });
        if (!team) {
            throw new TeamWithNameNotFoundError(teamName);
        }
        const isAuthorized = team.users.some((user) => user.id === userId);
        if (!isAuthorized) {
            throw new TeamUnauthorizedError(userId, teamName);
        }

        return team.users.map((user) => ({ id: user.id, username: user.username }));
    }
}
