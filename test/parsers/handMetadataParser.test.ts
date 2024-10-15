import { HandMetadataParser } from "../../src/parser/metadataParser";
import { handExamples } from "../test_data/handExamples";

describe('HandMetadataParser', () => {

    it('should extract the hand metadata', () => {
        const handText = handExamples[0].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2626887300344');

        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.30', bigBlind: '¥0.60', ante: undefined });

        
        expect(metadata.startDateTime).toBe('2024/07/15 20:40:11 UTC');
        expect(metadata.endDateTime).toBe('2024/07/15 20:40:45');

        
        expect(metadata.clubId).toBe('14625');
        expect(metadata.tableId).toBe('SPMA_14625_26268873');
        expect(metadata.maxSeats).toBe(6);
        expect(metadata.buttonSeat).toBe(2);

        
        expect(metadata.players).toStrictEqual([
            { seat: 1, playerId: 1172370, stack: '¥53.40' },
            { seat: 2, playerId: 458625, stack: '¥184.10' },
            { seat: 3, playerId: 1165261, stack: '¥65.50' },
            { seat: 4, playerId: 657898, stack: '¥60' },
            { seat: 5, playerId: 636899, stack: '¥73.50' },
            { seat: 6, playerId: 1176294, stack: '¥44.50' }
        ]);

        expect(metadata.totalPot).toBe('¥6.30');
        expect(metadata.rake).toBe('¥0.35');
        expect(metadata.boards).toStrictEqual([
            ['5s', 'Kd', '3c']  // First board (only one in this hand)
        ]);
        expect(metadata.heroCards).toStrictEqual(['Qd', '7c', '4c', '8c', '6s']);
    });

    it('should extract the hand metadata for handExamples[1]', () => {
        const handText = handExamples[1].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2626993400324');
        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.50', bigBlind: '¥1', ante: undefined });
        expect(metadata.startDateTime).toBe('2024/07/15 21:21:15 UTC');
        expect(metadata.endDateTime).toBe('2024/07/15 21:22:35');
        expect(metadata.clubId).toBe('14625');
        expect(metadata.tableId).toBe('SPMA_14625_26269934');
        expect(metadata.maxSeats).toBe(6);
        expect(metadata.buttonSeat).toBe(2);

        expect(metadata.players).toStrictEqual([
            { seat: 1, playerId: 1120661, stack: '¥100' },
            { seat: 2, playerId: 802228, stack: '¥146.05' },
            { seat: 3, playerId: 1172867, stack: '¥100' },
            { seat: 4, playerId: 1186292, stack: '¥45.50' },
            { seat: 5, playerId: 798076, stack: '¥120.50' },
            { seat: 6, playerId: 657898, stack: '¥89' }
        ]);

        expect(metadata.totalPot).toBe('¥51.15');
        expect(metadata.rake).toBe('¥3.10');
        expect(metadata.boards).toStrictEqual([['4d', 'Jd', '4c', 'Jc', '3d']]);
        expect(metadata.heroCards).toStrictEqual(['As', '3h', '5h', '4h', 'Qs']);

    });

    it('should extract the hand metadata for handExamples[2]', () => {
        const handText = handExamples[2].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2627490400059');
        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.50', bigBlind: '¥1', ante: '¥0.50' });
        expect(metadata.startDateTime).toBe('2024/07/15 20:39:55 UTC');
        expect(metadata.endDateTime).toBe('2024/07/15 20:40:26');
        expect(metadata.clubId).toBe('14625');
        expect(metadata.tableId).toBe('SPMA_14625_26274904');
        expect(metadata.maxSeats).toBe(6);
        expect(metadata.buttonSeat).toBe(1);

        expect(metadata.players).toStrictEqual([
            { seat: 1, playerId: 353625, stack: '¥54.55' },
            { seat: 3, playerId: 1144890, stack: '¥100' },
            { seat: 4, playerId: 1168207, stack: '¥123' },
            { seat: 5, playerId: 299983, stack: '¥188.30' },
            { seat: 6, playerId: 624545, stack: '¥55.35' }
        ]);

        expect(metadata.totalPot).toBe('¥16');
        expect(metadata.rake).toBe('¥0.80');
        expect(metadata.boards).toStrictEqual([['Kh', '6h', 'Js', 'Jh']]);
        expect(metadata.heroCards).toStrictEqual(undefined);

    });

    it('should extract the hand metadata for handExamples[3]', () => {
        const handText = handExamples[3].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2627490400072');
        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.50', bigBlind: '¥1', ante: '¥0.50' });
        expect(metadata.startDateTime).toBe('2024/07/15 20:51:43 UTC');
        expect(metadata.endDateTime).toBe('2024/07/15 20:52:26');
        expect(metadata.clubId).toBe('14625');
        expect(metadata.tableId).toBe('SPMA_14625_26274904');
        expect(metadata.maxSeats).toBe(6);
        expect(metadata.buttonSeat).toBe(3);

        expect(metadata.players).toStrictEqual([
            { seat: 1, playerId: 353625, stack: '¥50.25' },
            { seat: 2, playerId: 657898, stack: '¥185' },
            { seat: 3, playerId: 1123550, stack: '¥47' },
            { seat: 4, playerId: 1168207, stack: '¥103' },
            { seat: 5, playerId: 299983, stack: '¥238.35' },
            { seat: 6, playerId: 885662, stack: '¥123.15' }
        ]);
        expect(metadata.totalPot).toBe('¥104');
        expect(metadata.rake).toBe('¥5.50');
        expect(metadata.boards).toStrictEqual([['7s', '5s', 'Ah', '2h', '5d']]);
        expect(metadata.heroCards).toStrictEqual(['6d', '8h', '9s', 'Ks', 'As']);

    });

    it('should extract the hand metadata for handExamples[4]', () => {
        const handText = handExamples[4].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2627490400064');
        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.50', bigBlind: '¥1', ante: '¥0.50' });
        expect(metadata.startDateTime).toBe('2024/07/15 20:44:17 UTC');
        expect(metadata.endDateTime).toBe('2024/07/15 20:44:58');
        expect(metadata.clubId).toBe('14625');
        expect(metadata.tableId).toBe('SPMA_14625_26274904');
        expect(metadata.maxSeats).toBe(6);
        expect(metadata.buttonSeat).toBe(1);

        expect(metadata.players).toStrictEqual([
            { seat: 1, playerId: 353625, stack: '¥59.75' },
            { seat: 2, playerId: 657898, stack: '¥90' },
            { seat: 3, playerId: 1123550, stack: '¥22' },
            { seat: 4, playerId: 1168207, stack: '¥119' },
            { seat: 5, playerId: 299983, stack: '¥243.85' }
        ]);

        expect(metadata.totalPot).toBe('¥53.50');
        expect(metadata.rake).toBe('¥3.20');
        expect(metadata.boards).toStrictEqual([
            ['4c', '9h', 'Js', 'Ks', 'Ad'],
            ['7c', 'As', '2d', '6h', '2h']
        ]);
        expect(metadata.heroCards).toStrictEqual(['9s', 'Th', 'Tc', 'Kd', '8s']);

    });

    it('should extract the hand metadata for handExamples[5]', () => {
        const handText = handExamples[5].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2626993400331');
        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.50', bigBlind: '¥1', ante: undefined });
        expect(metadata.startDateTime).toBe('2024/07/15 21:31:17 UTC');
        expect(metadata.endDateTime).toBe('2024/07/15 21:32:32');
        expect(metadata.clubId).toBe('14625');
        expect(metadata.tableId).toBe('SPMA_14625_26269934');
        expect(metadata.maxSeats).toBe(6);
        expect(metadata.buttonSeat).toBe(3);

        expect(metadata.players).toStrictEqual([
            { seat: 1, playerId: 1120661, stack: '¥100' },
            { seat: 2, playerId: 802228, stack: '¥156.55' },
            { seat: 3, playerId: 1172867, stack: '¥110.80' },
            { seat: 4, playerId: 1186292, stack: '¥114.90' },
            { seat: 5, playerId: 798076, stack: '¥77.65' },
            { seat: 6, playerId: 657898, stack: '¥106.30' }
        ]);
        expect(metadata.totalPot).toBe('¥22.50');
        expect(metadata.rake).toBe('¥1.65');
        expect(metadata.boards).toStrictEqual([['8s', 'Qs', '2d', '2c']]);
        expect(metadata.heroCards).toStrictEqual(['5s', '2h', 'Jd', 'Qh', '4s']);

    });
    
});
