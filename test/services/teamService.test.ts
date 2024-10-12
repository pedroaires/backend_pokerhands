import { TeamService } from "../../src/services/teamService";
import { UserNotFoundError } from "../../src/errors/userError";
import { TeamAlreadyExistsError, TeamUnauthorizedError, TeamWithNameNotFoundError } from "../../src/errors/teamError";
import prismaMock from "../singleton";

describe('TeamService', () => {
    let teamService: TeamService;

    beforeEach(() => {
        teamService = new TeamService();
        (teamService as any).prisma = prismaMock;
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('createTeam', () => {
        it('should throw TeamAlreadyExistsError if team already exists', async () => {
            const mockTeamData = { name: 'testTeam', id: '1', ownerId: '1' };
            prismaMock.team.findFirst.mockResolvedValue({ ...mockTeamData });
        
            await expect(teamService.createTeam('1', mockTeamData))
                .rejects
                .toThrow(TeamAlreadyExistsError);
            
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: mockTeamData.name } });
        });

        it('should create a new team if team does not exist', async () => {
            const mockTeamData = { name: 'testTeam' };
            const mockCreatedTeam = { id: '1', ...mockTeamData, ownerId: '1' };

            prismaMock.team.findFirst.mockResolvedValue(null);
            prismaMock.team.create.mockResolvedValue(mockCreatedTeam);

            const createdTeam = await teamService.createTeam('1', mockTeamData);
            
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: mockTeamData.name } });
            expect(prismaMock.team.create).toHaveBeenCalledWith({
                data: { ownerId: '1', name: mockTeamData.name, users: { connect: { id: '1' } } }
            });
            expect(createdTeam).toEqual(mockCreatedTeam);
        });
    });


    describe('getTeamsByUser', () => {
        it('should throw UserNotFoundError if user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(teamService.getTeamsByUser('1'))
                .rejects
                .toThrow(UserNotFoundError);
            
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should return all teams for a user', async () => {
            const mockTeams = [
                { id: '1', name: 'team1', ownerId: '1' },
                { id: '2', name: 'team2', ownerId: '1' }
            ];

            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            prismaMock.team.findMany.mockResolvedValue(mockTeams);

            const teams = await teamService.getTeamsByUser('1');
            
            expect(prismaMock.team.findMany).toHaveBeenCalledWith({ where: { ownerId: '1' } });
            expect(teams).toEqual(mockTeams);
        });
    });

    describe('getTeamHands', () => {
        it('should throw UserNotFoundError if user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(teamService.getTeamHands('1', 'testTeam'))
                .rejects
                .toThrow(UserNotFoundError);
            
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should throw TeamWithNameNotFoundError if team does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            prismaMock.team.findFirst.mockResolvedValue(null);

            await expect(teamService.getTeamHands('1', 'testTeam'))
                .rejects
                .toThrow(TeamWithNameNotFoundError);
            
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'testTeam' }, include: { users: true } });
        });

        it('should throw TeamUnauthorizedError if user is not authorized to view team hands', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            const mockTeam = {
                id: 'team1',
                name: 'testTeam',
                ownerId: '2', 
                users: [{ id: '2', username: 'otherUser' }]
            };
            prismaMock.team.findFirst.mockResolvedValue(mockTeam);

            await expect(teamService.getTeamHands('1', 'testTeam'))
                .rejects
                .toThrow(TeamUnauthorizedError);
            
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'testTeam' }, include: { users: true } });
        });

        it('should return hands for the team', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', username: 'testUser', password: 'testPassword' });
            const mockTeam = {
                id: 'team1',
                name: 'testTeam',
                ownerId: '1',
                users: [{ id: '1', username: 'testUser' }]
            };
            prismaMock.team.findFirst.mockResolvedValue(mockTeam);

            const mockHands = [
                {
                    id: "hand1",
                    ownerId: "user1",
                    startDateTime: new Date(),
                    endDateTime: new Date(),
                    gameType: "5 Card Omaha",
                    blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: null }, 
                    tableId: "table1",
                    clubId: 1,
                    maxSeats: 6,
                    buttonSeat: 1,
                    seatMapper: [], 
                },
                {
                    id: "hand2",
                    ownerId: "user2",
                    startDateTime: new Date(),
                    endDateTime: new Date(),
                    gameType: "5 Card Omaha",
                    blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: null },
                    tableId: "table2",
                    clubId: 2,
                    maxSeats: 6,
                    buttonSeat: 2,
                    seatMapper: [],
                }
            ];
            
            prismaMock.hand.findMany.mockResolvedValue(mockHands);

            const hands = await teamService.getTeamHands('1', 'testTeam');

            expect(prismaMock.hand.findMany).toHaveBeenCalledWith({
                where: {
                    owner: {
                        teams: {
                            some: { id: 'team1' }
                        }
                    }
                }
            });
            expect(hands).toEqual(mockHands);
        });
    });


    describe('deleteTeam', () => {
        it('should throw TeamWithNameNotFoundError if team does not exist', async () => {
            prismaMock.team.findFirst.mockResolvedValue(null);

            await expect(teamService.deleteTeam('testTeam', '1'))
                .rejects
                .toThrow(TeamWithNameNotFoundError);
            
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'testTeam' } });
        });

        it('should throw TeamUnauthorizedError if user is not authorized to delete the team', async () => {
            const mockTeam = { id: 'team1', name: 'testTeam', ownerId: '2' }; 
            prismaMock.team.findFirst.mockResolvedValue(mockTeam);

            await expect(teamService.deleteTeam('testTeam', '1'))
                .rejects
                .toThrow(TeamUnauthorizedError);
        });

        it('should delete the team if user is authorized', async () => {
            const mockTeam = { id: 'team1', name: 'testTeam', ownerId: '1' };
            prismaMock.team.findFirst.mockResolvedValue(mockTeam);
            prismaMock.team.delete.mockResolvedValue(mockTeam);

            const deletedTeam = await teamService.deleteTeam('testTeam', '1');

            expect(prismaMock.team.delete).toHaveBeenCalledWith({ where: { name: 'testTeam' } });
            expect(deletedTeam).toEqual(mockTeam);
        });
    });

    describe('updateTeam', () => {
        it('should throw TeamWithNameNotFoundError if team does not exist', async () => {
            prismaMock.team.findFirst.mockResolvedValue(null);

            await expect(teamService.updateTeam('testTeam', '1', { newName: 'newTeam' }))
                .rejects
                .toThrow(TeamWithNameNotFoundError);
        });

        it('should throw TeamUnauthorizedError if user is not authorized to update the team', async () => {
            const mockTeam = { id: 'team1', name: 'testTeam', ownerId: '2' };
            prismaMock.team.findFirst.mockResolvedValue(mockTeam);

            await expect(teamService.updateTeam('testTeam', '1', { newName: 'newTeam' }))
                .rejects
                .toThrow(TeamUnauthorizedError);
        });

        it('should update the team name if user is authorized and new name is valid', async () => {
            const mockExistingTeam = { id: '1', name: 'oldTeam', ownerId: '1' };
            const mockUpdatedTeam = { id: '1', name: 'newTeam', ownerId: '1' };
        
            prismaMock.team.findFirst.mockResolvedValueOnce(mockExistingTeam);
        
            prismaMock.team.findFirst.mockResolvedValueOnce(null);
        
            prismaMock.team.update.mockResolvedValue(mockUpdatedTeam);
        
            const result = await teamService.updateTeam('oldTeam', '1', { newName: 'newTeam' });
        
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'oldTeam' } });
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'newTeam' } });
            expect(prismaMock.team.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { name: 'newTeam' }
            });
            expect(result).toEqual(mockUpdatedTeam);
        });

        it('should update the team name if user is authorized and new name is valid', async () => {
            const mockTeam = { id: 'team1', name: 'testTeam', ownerId: '1' };
            const updatedTeam = { id: 'team1', name: 'newTeam', ownerId: '1' };
            
            prismaMock.team.findFirst.mockResolvedValueOnce(mockTeam);
            prismaMock.team.findFirst.mockResolvedValueOnce(null);
            prismaMock.team.update.mockResolvedValue(updatedTeam);

            const result = await teamService.updateTeam('testTeam', '1', { newName: 'newTeam' });

            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'testTeam' } });
            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'newTeam' } });
            expect(prismaMock.team.update).toHaveBeenCalledWith({
                where: { id: 'team1' },
                data: { name: 'newTeam' }
            });
            expect(result).toEqual(updatedTeam);
        });

        it('should throw TeamAlreadyExistsError if new team name already exists', async () => {
            const mockTeam = { id: 'team1', name: 'testTeam', ownerId: '1' };
            const existingTeamWithNewName = { id: 'team2', name: 'newTeam', ownerId: '2' };

            prismaMock.team.findFirst.mockResolvedValueOnce(mockTeam);
            prismaMock.team.findFirst.mockResolvedValueOnce(existingTeamWithNewName);

            await expect(teamService.updateTeam('testTeam', '1', { newName: 'newTeam' }))
                .rejects
                .toThrow(TeamAlreadyExistsError);

            expect(prismaMock.team.findFirst).toHaveBeenCalledWith({ where: { name: 'newTeam' } });
        });
    });
});