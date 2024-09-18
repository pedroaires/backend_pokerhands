import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HandParser {
    handText: string;
    lines: string[];

    constructor(handText: string) {
        this.handText = handText;
        this.lines = handText.split('\n').map(line => line.trim());
    }

    private async parseTableInfo(): Promise<any> {
        const tableInfo = this.lines.find(line => line.startsWith('Table'))
            ?.match(/Table\s+'ClubId:(\d+),Table:([\w_]+)'\s+(\d+)-max/);
        if (!tableInfo) throw new Error('Table information not found');

        const clubId = parseInt(tableInfo[1], 10);
        const tableId = tableInfo[2];
        const maxSeats = parseInt(tableInfo[3], 10);
        const blinds: [number, number] = [0.3, 0.6];  // Assuming fixed blinds as per the example

        // Check if the table already exists in the database, otherwise create it
        const table = await prisma.table.upsert({
            where: { id: tableId },
            update: { maxSeats, blinds, club_id: clubId },
            create: {
                id: tableId,
                maxSeats,
                blinds,
                ante: 0,
                club_id: clubId
            }
        });

        return table;
    }

    private async parseClubInfo(table: any): Promise<any> {
        // Assuming Club is just a reference by ID in this case, no Club model in Prisma
        // If Club was a model, you could also upsert it similarly.
        return { clubId: table.club_id, name: 'SupremaPoker' };
    }

    private async parsePlayers(table: any): Promise<any[]> {
        const playerLines = this.lines.filter(line => line.startsWith('Seat') && line.includes('in chips'));

        const players = await Promise.all(playerLines.map(async (line) => {
            const playerInfo = line.match(/Seat (\d+): (\d+) \(¥([0-9.]+) in chips\)/);
            if (!playerInfo) throw new Error(`Failed to parse player information from line: ${line}`);

            const playerId = parseInt(playerInfo[2], 10);

            // Check if player exists, if not, create it
            const player = await prisma.player.upsert({
                where: { id: playerId },
                update: { club_id: table.club_id },
                create: {
                    id: playerId,
                    username: '',  // Username not present in the parsed data, left empty
                    club_id: table.club_id
                }
            });

            return player;
        }));

        return players;
    }

    public async parseHand(): Promise<{ table: any, club: any, players: any[] }> {
        const table = await this.parseTableInfo();
        const club = await this.parseClubInfo(table);
        const players = await this.parsePlayers(table);

        return { table, club, players };
    }
}
