import { TeamController } from "../../src/controllers/teamController";
import { TeamService } from "../../src/services/teamService";

jest.mock("../../src/services/teamService");

describe("TeamController", () => {
    let req: any;
    let res: any;
    let teamController: TeamController;
    let teamServiceMock: jest.Mocked<TeamService>;

    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        teamServiceMock = new TeamService() as jest.Mocked<TeamService>;
        teamController = new TeamController(teamServiceMock); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe("createTeam", () => {
        it("should return 400 if team name is missing", async () => {
            req.body = {};
            req.params = { userId: "1" };

            await teamController.createTeam(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing team name' });
        });

        it("should return 400 if user ID is missing", async () => {
            req.body = { name: "testTeam" };
            req.params = {};

            await teamController.createTeam(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });

        it("should create a team and return team data", async () => {
            req.body = { name: "testTeam" };
            req.params = { userId: "1" };
            const mockTeam = { id: "team123", name: "testTeam", ownerId: "1" };

            teamServiceMock.createTeam.mockResolvedValue(mockTeam);

            await teamController.createTeam(req, res);

            expect(teamServiceMock.createTeam).toHaveBeenCalledWith("1", { name: "testTeam" });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ message: 'Team created', team: mockTeam });
        });
    });

    describe("getTeamsByUser", () => {
        it("should return 400 if user ID is missing", async () => {
            req.params = {};

            await teamController.getTeamsByUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });

        it("should return all teams for a user", async () => {
            req.params = { userId: "1" };
            const mockTeams = [
                { id: "team1", name: "Team1", ownerId: "1" },
                { id: "team2", name: "Team2", ownerId: "1" }
            ];

            teamServiceMock.getTeamsByUser.mockResolvedValue(mockTeams);

            await teamController.getTeamsByUser(req, res);

            expect(teamServiceMock.getTeamsByUser).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ teams: mockTeams });
        });
    });

    describe("getTeamHands", () => {
        it("should return 400 if team name is missing", async () => {
            req.params = { userId: "1" };

            await teamController.getTeamHands(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing team Name' });
        });

        it("should return 400 if user ID is missing", async () => {
            req.params = { teamName: "team1" };

            await teamController.getTeamHands(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });

        it("should return hands from the specified team", async () => {
            req.params = { teamName: "team1", userId: "1" };
            const mockHands = [
                {
                  id: "hand1",
                  ownerId: "1",
                  startDateTime: new Date("2024-01-01T10:00:00Z"),
                  endDateTime: new Date("2024-01-01T10:30:00Z"),
                  gameType: "5 Card Omaha",
                  blinds: { smallBlind: "0.50", bigBlind: "1.00", ante: null },
                  tableId: "table1",
                  clubId: 1,
                  maxSeats: 6,
                  buttonSeat: 1,
                  seatMapper: []
                },
                {
                  id: "hand2",
                  ownerId: "1",
                  startDateTime: new Date("2024-01-02T11:00:00Z"),
                  endDateTime: new Date("2024-01-02T11:40:00Z"),
                  gameType: "Texas Hold'em",
                  blinds: { smallBlind: "1.00", bigBlind: "2.00", ante: "0.25" },
                  tableId: "table2",
                  clubId: 1,
                  maxSeats: 9,
                  buttonSeat: 3,
                  seatMapper: []
                }
              ];
              

            teamServiceMock.getTeamHands.mockResolvedValue(mockHands);

            await teamController.getTeamHands(req, res);

            expect(teamServiceMock.getTeamHands).toHaveBeenCalledWith("1", "team1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ hands: mockHands });
        });
    });

    describe("deleteTeam", () => {
        it("should return 400 if team name is missing", async () => {
            req.params = { userId: "1" };

            await teamController.deleteTeam(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing team Name' });
        });

        it("should return 400 if user ID is missing", async () => {
            req.params = { teamName: "team1" };

            await teamController.deleteTeam(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });

        it("should delete a team and return success message", async () => {
            req.params = { teamName: "team1", userId: "1" };
            const mockDeletedTeam = { id: "team1", name: "team1", ownerId: "1" };

            teamServiceMock.deleteTeam.mockResolvedValue(mockDeletedTeam);

            await teamController.deleteTeam(req, res);

            expect(teamServiceMock.deleteTeam).toHaveBeenCalledWith("team1", "1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Team deleted', deletedTeam: mockDeletedTeam });
        });
    });

    describe("updateTeam", () => {
        it("should return 400 if new team name is missing", async () => {
            req.body = {};
            req.params = { teamName: "team1", userId: "1" };

            await teamController.updateTeam(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing new team Name' });
        });

        it("should update a team and return the updated team", async () => {
            req.body = { newName: "newTeamName" };
            req.params = { teamName: "team1", userId: "1" };
            const mockUpdatedTeam = { id: "team1", name: "newTeamName", ownerId: "1" };

            teamServiceMock.updateTeam.mockResolvedValue(mockUpdatedTeam);

            await teamController.updateTeam(req, res);

            expect(teamServiceMock.updateTeam).toHaveBeenCalledWith("team1", "1", { newName: "newTeamName" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: 'Team updated', updatedTeam: mockUpdatedTeam });
        });
    });

    describe("listTeamUsers", () => {
        it("should return 400 if team name is missing", async () => {
            req.params = { userId: "1" };  // No teamName provided
    
            await teamController.listTeamUsers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing team Name' });
        });
    
        it("should return 400 if user ID is missing", async () => {
            req.params = { teamName: "testTeam" };  // No userId provided
    
            await teamController.listTeamUsers(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing user ID' });
        });
    
        it("should return the list of users for a specific team", async () => {
            req.params = { teamName: "testTeam", userId: "1" };
            const mockUsers = [
                { id: "user1", username: "User One" },
                { id: "user2", username: "User Two" }
            ];
    
            teamServiceMock.listTeamUsers.mockResolvedValue(mockUsers);
    
            await teamController.listTeamUsers(req, res);
    
            expect(teamServiceMock.listTeamUsers).toHaveBeenCalledWith("testTeam", "1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ users: mockUsers });
        });
    });
});
