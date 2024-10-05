import { handExamples } from "../test_data/handExamples";
import { createParser, PlayerActionParser } from "../../src/utils/eventParser"; 
import { Player } from "../../src/models/player";

describe('CreateEventParser', () => {

    it('should return a DefaultEventParser for an unknown action', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[0]; // SupremaPoker Hand #2626887300344:  5 Card Omaha Pot Limit (¥0.30/¥0.60 CNY) - 2024/07/15 20:40:11 UTC
        const parser = createParser(action);
    });

    it('should return a PlayerActionParser for a player action', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = createParser(action);
        expect(parser.constructor.name).toBe('PlayerActionParser');
    });

    it('should return a BoardChangeParser for a board change', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[21]; // *** FLOP *** [5s Kd 3c] {Rake: ¥0}
        const parser = createParser(action);
        expect(parser.constructor.name).toBe('BoardChangeParser');
    });

    it('should return a UncalledBetParser for a uncalled bet', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[25]; // Uncalled bet (¥4.70) returned to 458625
        const parser = createParser(action);
        expect(parser.constructor.name).toBe('UncalledBetParser');
    });

    it('should return a DealtCardsParser for a dealt cards', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[13]; // Dealt to 657898 [Qd 7c 4c 8c 6s]
        const parser = createParser(action);
        expect(parser.constructor.name).toBe('DealtCardsParser');
    });
});

describe('PlayerActionParser', () => {
    it('should extract the player id', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new PlayerActionParser();
        // console.log("Action: ", action);
        var a = action.match(/^\s*(\d+):/);
        // console.log("Match: ", a);
        if (!a) {
            throw new Error('Player ID not found in action string');
        }
        console.log("test:", parseInt(a[1], 10));
        console.log("test2:", parseInt(a[1]) == 1165261);

        const event = parser.parse(action);
        console.log("Event: ", event);
        expect(event.playerId).toBe(1165261);
    });

    it('should extract the action type', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new PlayerActionParser();
        const event = parser.parse(action);
        expect(event.actionType).toBe('posts');
    });

    it('should extract the amount', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new PlayerActionParser();
        const event = parser.parse(action);
        expect(event.amount).toBe(0.3);
    });

    it('should extract the isAllIn', () => {
        const handText = handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new PlayerActionParser();
        const event = parser.parse(action);
        expect(event.isAllIn).toBe(false);
    });
});