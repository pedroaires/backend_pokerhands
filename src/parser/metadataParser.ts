export interface HandMetadata {
    handId: string;
    gameType: string;
    blinds: { smallBlind: string, bigBlind: string, ante: string | undefined };
    startDateTime: string;
    endDateTime: string;
    clubId: string;
    tableId: string;
    maxSeats: number;
    buttonSeat: number;
    players: { seat: number, playerId: number, stack: string }[];
    totalPot: string;
    rake: string;
    boards: string[][];
    heroCards: string[] | undefined;
}

export class HandMetadataParser {
    parse(handText: string): HandMetadata {
        const handIdRegex = /SupremaPoker Hand #(\d+):\s+(.+?)\s+-\s+([\d\/: ]+ UTC)/;
        const tableInfoRegex = /Table 'ClubId:(\d+),Table:([^']+)' (\d+)-max Seat #(\d+)/;
        const playerRegex = /Seat (\d+): (\d+) \((¥[\d.]+) in chips\)/g;
        const endTimeRegex = /Hand ended at ([\d\/: ]+)/;
        const anteRegex = /\((?:¥[\d.]+\/¥[\d.]+(?: - Ante (¥[\d.]+))?) CNY\)/;
        const totalPotRegex = /Total pot (¥[\d.]+)/;
        const rakeRegex = /Rake (¥[\d.]+)/;
        const boardsRegex = /(?:FIRST|SECOND|THIRD)?\s?Board \[([^\]]+)\]/g;
        const dealtCardsRegex = /Dealt to \S+ \[([^\]]+)\]/;


        
        // Extract hand metadata
        const anteMatch = handText.match(anteRegex);
        const handIdMatch = handText.match(handIdRegex);
        const tableInfoMatch = handText.match(tableInfoRegex);
        const playersMatches = [...handText.matchAll(playerRegex)];
        const endDateMatch = handText.match(endTimeRegex);
        const totalPotMatch = handText.match(totalPotRegex);
        const rakeMatch = handText.match(rakeRegex);
        const boardMatches = [...handText.matchAll(boardsRegex)];
        const dealtCardsMatch = handText.match(dealtCardsRegex);

        if (!handIdMatch || !tableInfoMatch || !endDateMatch) {
            throw new Error('Invalid hand format');
        }

        const players = playersMatches.map(match => ({
            seat: parseInt(match[1], 10),
            playerId: parseInt(match[2], 10),
            stack: match[3]
        }));
        const boards = boardMatches.map(match => match[1].split(' '));
        const heroCards = dealtCardsMatch ? dealtCardsMatch[1].split(' ') : undefined;  
        return {
            handId: handIdMatch[1],
            gameType: handIdMatch[2].split('(')[0].trim(), // Extracts game type like "5 Card Omaha Pot Limit"
            blinds: {
                smallBlind: handIdMatch[2].match(/¥[\d.]+/g)?.[0] ?? '', // Small Blind
                bigBlind: handIdMatch[2].match(/¥[\d.]+/g)?.[1] ?? '', // Big Blind
                ante: anteMatch?.[1] ?? undefined // Extracts the ante if present
            },
            startDateTime: handIdMatch[3],
            endDateTime: endDateMatch[1],
            clubId: tableInfoMatch[1],
            tableId: tableInfoMatch[2],
            maxSeats: parseInt(tableInfoMatch[3], 10),
            buttonSeat: parseInt(tableInfoMatch[4], 10),
            players,
            totalPot: totalPotMatch ? totalPotMatch[1] : 'Unknown',
            rake: rakeMatch ? rakeMatch[1] : 'Unknown',
            boards,
            heroCards
        };
    }
}
