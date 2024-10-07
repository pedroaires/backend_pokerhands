import { HandMetadataParser } from "../../src/utils/metadataParser";
import { handExamples } from "../test_data/handExamples";

describe('HandMetadataParser', () => {

    it('should extract the hand metadata', () => {
        const handText = handExamples[0].handText;

        const parser = new HandMetadataParser();
        const metadata = parser.parse(handText);

        expect(metadata.handId).toBe('2626887300344');

        expect(metadata.gameType).toBe('5 Card Omaha Pot Limit');
        expect(metadata.blinds).toStrictEqual({ smallBlind: '¥0.30', bigBlind: '¥0.60' });

        
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
    });
});
