import { HandParser } from '../../src/utils/handParser';
import { Table } from '../../src/models/table';
import { Club } from '../../src/models/club';
import { Player } from '../../src/models/player';

describe('HandParser Tests', () => {
    const handText = `
        SupremaPoker Hand #2626887300344:  5 Card Omaha Pot Limit (¥0.30/¥0.60 CNY) - 2024/07/15 20:40:11 UTC
        Table 'ClubId:14625,Table:SPMA_14625_26268873' 6-max Seat #2 is the button
        Seat 1: 1172370 (¥53.40 in chips)
        Seat 2: 458625 (¥184.10 in chips)
        Seat 3: 1165261 (¥65.50 in chips)
        Seat 4: 657898 (¥60 in chips)
        Seat 5: 636899 (¥73.50 in chips)
        Seat 6: 1176294 (¥44.50 in chips)
        1165261: posts small blind ¥0.30
        657898: posts big blind ¥0.60
        1176294: posts big blind ¥0.60
        *** HOLE CARDS ***
        Dealt to 657898 [Qd 7c 4c 8c 6s]
        636899: folds
        1176294: checks
        1172370: folds
        458625: raises ¥2.10 to ¥2.70
        1165261: folds
        657898: folds
        1176294: calls ¥2.10
        *** FLOP *** [5s Kd 3c] {Rake: ¥0}
        1176294: checks
        458625: bets ¥4.70
        1176294: folds
        Uncalled bet (¥4.70) returned to 458625
        458625 collected ¥5.95 from pot
        *** SUMMARY ***
        Total pot ¥6.30 | Rake ¥0.35
        Board [5s Kd 3c]
        Seat 1: 1172370 folded before Flop (didn't bet)
        Seat 2: 458625 (button) collected (¥5.95)
        Seat 3: 1165261 (small blind) folded before Flop
        Seat 4: 657898 (big blind) folded before Flop
        Seat 5: 636899 folded before Flop (didn't bet)
        Seat 6: 1176294 folded on the Flop
        Hand ended at 2024/07/15 20:40:45
    `;

    it('should parse the entire hand correctly', () => {
        const parser = new HandParser(handText);
        const result = parser.parseHand();

        const expectedTable = new Table('SPMA_14625_26268873', 6, [0.3, 0.6], 0, 14625);
        const expectedClub = new Club(14625, 'SupremaPoker');
        const expectedPlayers = [
            new Player(1172370, '', 14625),
            new Player(458625, '', 14625),
            new Player(1165261, '', 14625),
            new Player(657898, '', 14625),
            new Player(636899, '', 14625),
            new Player(1176294, '', 14625)
        ];

        expect(result.table).toEqual(expectedTable);
        expect(result.club).toEqual(expectedClub);
        expect(result.players).toEqual(expectedPlayers);
    });
});