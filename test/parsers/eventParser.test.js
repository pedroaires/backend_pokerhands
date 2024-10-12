"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handExamples_1 = require("../test_data/handExamples");
const eventParser_1 = require("../../src/parser/eventParser");
describe('CreateEventParser', () => {
    it('should return a DefaultEventParser for an unknown action', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[0]; // SupremaPoker Hand #2626887300344:  5 Card Omaha Pot Limit (¥0.30/¥0.60 CNY) - 2024/07/15 20:40:11 UTC
        const parser = (0, eventParser_1.createParser)(action);
    });
    it('should return a PlayerActionParser for a player action', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = (0, eventParser_1.createParser)(action);
        expect(parser.constructor.name).toBe('PlayerActionParser');
    });
    it('should return a BoardChangeParser for a board change', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[21]; // *** FLOP *** [5s Kd 3c] {Rake: ¥0}
        const parser = (0, eventParser_1.createParser)(action);
        expect(parser.constructor.name).toBe('BoardChangeParser');
    });
    it('should return a UncalledBetParser for a uncalled bet', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[25]; // Uncalled bet (¥4.70) returned to 458625
        const parser = (0, eventParser_1.createParser)(action);
        expect(parser.constructor.name).toBe('UncalledBetParser');
    });
    it('should return a DealtCardsParser for a dealt cards', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[13]; // Dealt to 657898 [Qd 7c 4c 8c 6s]
        const parser = (0, eventParser_1.createParser)(action);
        expect(parser.constructor.name).toBe('DealtCardsParser');
    });
    it('should return a ShowCardsParser for a show cards', () => {
        const handText = handExamples_1.handExamples[1].handText;
        const action = handText.split('\n')[45]; // Seat 6: 657898 showed [As 3h 5h 4h Qs] and won (¥48.05) with a full house, Fours full of Threes
        const parser = (0, eventParser_1.createParser)(action);
        expect(parser.constructor.name).toBe('ShowCardsParser');
    });
});
describe('PlayerActionParser', () => {
    it('should extract the player id', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new eventParser_1.PlayerActionParser();
        const event = parser.parse(action);
        expect(event.playerId).toBe(1165261);
    });
    it('should extract the action type', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new eventParser_1.PlayerActionParser();
        const event = parser.parse(action);
        expect(event.actionType).toBe('posts');
    });
    it('should extract the amount', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new eventParser_1.PlayerActionParser();
        const event = parser.parse(action);
        expect(event.amount).toBe(0.3);
    });
    it('should extract the isAllIn', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[9]; // 1165261: posts small blind ¥0.30
        const parser = new eventParser_1.PlayerActionParser();
        const event = parser.parse(action);
        expect(event.isAllIn).toBe(false);
    });
});
describe('BoardChangeParser', () => {
    it('should extract the change type', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[21]; // *** FLOP *** [5s Kd 3c] {Rake: ¥0}
        const parser = new eventParser_1.BoardChangeParser();
        const event = parser.parse(action);
        expect(event.changeType).toBe('FLOP');
    });
    it('should extract the new board', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[21]; // *** FLOP *** [5s Kd 3c] {Rake: ¥0}
        const parser = new eventParser_1.BoardChangeParser();
        const event = parser.parse(action);
        expect(event.newBoard).toStrictEqual(['5s', 'Kd', '3c']);
    });
});
describe('Uncalled Bet Parser', () => {
    it('should extract the Player ID', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[25]; // Uncalled bet (¥4.70) returned to 458625
        const parser = new eventParser_1.UncalledBetParser();
        const event = parser.parse(action);
        expect(event.playerId).toBe(458625);
    });
    it('should extract the amount', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[25]; // Uncalled bet (¥4.70) returned to 458625
        const parser = new eventParser_1.UncalledBetParser();
        const event = parser.parse(action);
        expect(event.amount).toBe(4.7);
    });
});
describe('Uncalled Dealt Cards Parser', () => {
    it('should extract the Player ID', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[13]; // Dealt to 657898 [Qd 7c 4c 8c 6s]
        const parser = new eventParser_1.DealtCardsParser();
        const event = parser.parse(action);
        expect(event.playerId).toBe(657898);
    });
    it('should extract the dealt cards', () => {
        const handText = handExamples_1.handExamples[0].handText;
        const action = handText.split('\n')[13]; // Dealt to 657898 [Qd 7c 4c 8c 6s]
        const parser = new eventParser_1.DealtCardsParser();
        const event = parser.parse(action);
        expect(event.cards).toStrictEqual(['Qd', '7c', '4c', '8c', '6s']);
    });
});
describe('Show Cards Parser', () => {
    it('should extract the Player ID', () => {
        const handText = handExamples_1.handExamples[1].handText;
        const action = handText.split('\n')[45]; // Seat 6: 657898 showed [As 3h 5h 4h Qs] and won (¥48.05) with a full house, Fours full of Threes
        const parser = new eventParser_1.ShowCardsParser();
        const event = parser.parse(action);
        expect(event.playerId).toBe(657898);
    });
    it('should extract the shown cards', () => {
        const handText = handExamples_1.handExamples[1].handText;
        const action = handText.split('\n')[45]; // Seat 6: 657898 showed [As 3h 5h 4h Qs] and won (¥48.05) with a full house, Fours full of Threes
        const parser = new eventParser_1.ShowCardsParser();
        const event = parser.parse(action);
        expect(event.cards).toStrictEqual(['As', '3h', '5h', '4h', 'Qs']);
    });
});
