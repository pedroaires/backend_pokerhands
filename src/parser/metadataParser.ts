interface HandMetadata {
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
}

export class HandMetadataParser {
    parse(handText: string): HandMetadata {
        const handIdRegex = /SupremaPoker Hand #(\d+):\s+(.+?)\s+-\s+([\d\/: ]+ UTC)/;
        const tableInfoRegex = /Table 'ClubId:(\d+),Table:([^']+)' (\d+)-max Seat #(\d+)/;
        const playerRegex = /Seat (\d+): (\d+) \((¥[\d.]+) in chips\)/g;
        const endTimeRegex = /Hand ended at ([\d\/: ]+)/;
        const anteRegex = /\((?:¥[\d.]+\/¥[\d.]+(?: - Ante (¥[\d.]+))?) CNY\)/;
        const anteMatch = handText.match(anteRegex);

        // Extract hand metadata
        const handIdMatch = handText.match(handIdRegex);
        const tableInfoMatch = handText.match(tableInfoRegex);
        const playersMatches = [...handText.matchAll(playerRegex)];
        const endDateMatch = handText.match(endTimeRegex);

        if (!handIdMatch || !tableInfoMatch || !endDateMatch) {
            throw new Error('Invalid hand format');
        }

        const players = playersMatches.map(match => ({
            seat: parseInt(match[1], 10),
            playerId: parseInt(match[2], 10),
            stack: match[3]
        }));

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
            players
        };
    }
}
