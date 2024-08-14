import { Table } from '../models/table';
import { Club } from '../models/club';
import { Player } from '../models/player';

export class HandParser {
    handText: string;
    lines: string[];

    constructor(handText: string) {
        this.handText = handText;
        this.lines = handText.split('\n').map(line => line.trim());
    }

    private parseTableInfo(): Table {
        const tableInfo = this.lines.find(line => line.startsWith('Table'))
            ?.match(/Table\s+'ClubId:(\d+),Table:([\w_]+)'\s+(\d+)-max/);
        if (!tableInfo) throw new Error('Table information not found');

        const clubId = parseInt(tableInfo[1], 10);
        const tableId = tableInfo[2];
        const maxSeats = parseInt(tableInfo[3], 10);
        const blinds: [number, number] = [0.3, 0.6];  // Assuming fixed blinds as per the example

        return new Table(tableId, maxSeats, blinds, 0, clubId);
    }

    private parseClubInfo(table: Table): Club {
        return new Club(table.club_id, 'SupremaPoker');
    }

    private parsePlayers(table: Table): Player[] {
        const playerLines = this.lines.filter(line => line.startsWith('Seat') && line.includes('in chips'));

        return playerLines.map(line => {
            const playerInfo = line.match(/Seat (\d+): (\d+) \(¥([0-9.]+) in chips\)/);
            if (!playerInfo) throw new Error(`Failed to parse player information from line: ${line}`);

            const playerId = parseInt(playerInfo[2], 10);
            return new Player(playerId, '', table.club_id);
        });
    }

    public parseHand(): { table: Table, club: Club, players: Player[] } {
        const table = this.parseTableInfo();
        const club = this.parseClubInfo(table);
        const players = this.parsePlayers(table);

        return { table, club, players };
    }
}