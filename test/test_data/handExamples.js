"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handExamples = void 0;
exports.handExamples = [
    {
        description: 'Basic 5 Card Omaha Hand',
        handText: `
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
      `,
        expectedTable: {
            id: 'SPMA_14625_26268873',
            maxSeats: 6,
            blinds: [0.3, 0.6],
            ante: 0,
            club_id: 14625
        },
        expectedPlayers: [
            { id: 1172370, username: '', club_id: 14625 },
            { id: 458625, username: '', club_id: 14625 },
            { id: 1165261, username: '', club_id: 14625 },
            { id: 657898, username: '', club_id: 14625 },
            { id: 636899, username: '', club_id: 14625 },
            { id: 1176294, username: '', club_id: 14625 }
        ]
    },
    {
        description: 'Went to showdon hand',
        handText: `
SupremaPoker Hand #2626993400324:  5 Card Omaha Pot Limit (¥0.50/¥1 CNY) - 2024/07/15 21:21:15 UTC
Table 'ClubId:14625,Table:SPMA_14625_26269934' 6-max Seat #2 is the button
Seat 1: 1120661 (¥100 in chips)
Seat 2: 802228 (¥146.05 in chips)
Seat 3: 1172867 (¥100 in chips)
Seat 4: 1186292 (¥45.50 in chips)
Seat 5: 798076 (¥120.50 in chips)
Seat 6: 657898 (¥89 in chips)
1172867: posts small blind ¥0.50
1186292: posts big blind ¥1
*** HOLE CARDS ***
Dealt to 657898 [As 3h 5h 4h Qs]
798076: folds
657898: raises ¥2.50 to ¥3.50
1120661: folds
802228: calls ¥3.50
1172867: folds
1186292: calls ¥2.50
*** FLOP *** [4d Jd 4c] {Rake: ¥0}
1186292: checks
657898: bets ¥3.65
802228: calls ¥3.65
1186292: calls ¥3.65
*** TURN *** [4d Jd 4c] [Jc] {Rake: ¥0}
1186292: checks
657898: checks
802228: bets ¥14.60
1186292: folds
657898: calls ¥14.60
*** RIVER *** [4d Jd 4c Jc] [3d] {Rake: ¥0}
657898: checks
802228: checks
*** SHOW DOWN ***
657898: shows [As 3h 5h 4h Qs] (a full house, Fours full of Threes)
802228: mucks hand
657898 collected ¥48.05 from pot
*** SUMMARY ***
Total pot ¥51.15 | Rake ¥3.10
Board [4d Jd 4c Jc 3d]
Seat 1: 1120661 folded before Flop (didn't bet)
Seat 2: 802228 (button) mucked
Seat 3: 1172867 (small blind) folded before Flop
Seat 4: 1186292 (big blind) folded on the Turn
Seat 5: 798076 folded before Flop (didn't bet)
Seat 6: 657898 showed [As 3h 5h 4h Qs] and won (¥48.05) with a full house, Fours full of Threes
Hand ended at 2024/07/15 21:22:35
      `,
        expectedTable: {
            id: 'SPMA_14625_26269934',
            maxSeats: 6,
            blinds: [0.5, 1],
            ante: 0,
            club_id: 14625
        },
        expectedPlayers: [
            { id: 1120661, username: '', club_id: 14625 },
            { id: 802228, username: '', club_id: 14625 },
            { id: 1172867, username: '', club_id: 14625 },
            { id: 1186292, username: '', club_id: 14625 },
            { id: 798076, username: '', club_id: 14625 },
            { id: 657898, username: '', club_id: 14625 }
        ]
    },
    {
        description: 'Table with ante',
        handText: `
SupremaPoker Hand #2627490400059:  5 Card Omaha Pot Limit (¥0.50/¥1 - Ante ¥0.50 CNY) - 2024/07/15 20:39:55 UTC
Table 'ClubId:14625,Table:SPMA_14625_26274904' 6-max Seat #1 is the button
Seat 1: 353625 (¥54.55 in chips)
Seat 3: 1144890 (¥100 in chips)
Seat 4: 1168207 (¥123 in chips)
Seat 5: 299983 (¥188.30 in chips)
Seat 6: 624545 (¥55.35 in chips)
1144890: posts small blind ¥0.50
1168207: posts big blind ¥1
353625: posts the ante ¥0.50
1144890: posts the ante ¥0.50
1168207: posts the ante ¥0.50
299983: posts the ante ¥0.50
624545: posts the ante ¥0.50
*** HOLE CARDS ***
299983: folds
624545: raises ¥5 to ¥6
353625: calls ¥6
1144890: folds
1168207: folds
*** FLOP *** [Kh 6h Js] {Rake: ¥0}
624545: checks
353625: checks
*** TURN *** [Kh 6h Js] [Jh] {Rake: ¥0}
624545: checks
353625: bets ¥16
624545: folds
Uncalled bet (¥16) returned to 353625
353625 collected ¥15.20 from pot
*** SUMMARY ***
Total pot ¥16 | Rake ¥0.80
Board [Kh 6h Js Jh]
Seat 1: 353625 (button) collected (¥15.20)
Seat 3: 1144890 (small blind) folded before Flop
Seat 4: 1168207 (big blind) folded before Flop
Seat 5: 299983 folded before Flop (didn't bet)
Seat 6: 624545 folded on the Turn
Hand ended at 2024/07/15 20:40:26
      `,
        expectedTable: {
            id: 'SPMA_14625_26274904',
            maxSeats: 6,
            blinds: [0.5, 1],
            ante: 0.5,
            club_id: 14625
        },
        expectedPlayers: [
            { id: 353625, username: '', club_id: 14625 },
            { id: 1144890, username: '', club_id: 14625 },
            { id: 1168207, username: '', club_id: 14625 },
            { id: 299983, username: '', club_id: 14625 },
            { id: 624545, username: '', club_id: 14625 }
        ]
    },
    {
        description: 'All in before the river',
        handText: `
SupremaPoker Hand #2627490400072:  5 Card Omaha Pot Limit (¥0.50/¥1 - Ante ¥0.50 CNY) - 2024/07/15 20:51:43 UTC
Table 'ClubId:14625,Table:SPMA_14625_26274904' 6-max Seat #3 is the button
Seat 1: 353625 (¥50.25 in chips)
Seat 2: 657898 (¥185 in chips)
Seat 3: 1123550 (¥47 in chips)
Seat 4: 1168207 (¥103 in chips)
Seat 5: 299983 (¥238.35 in chips)
Seat 6: 885662 (¥123.15 in chips)
1168207: posts small blind ¥0.50
299983: posts big blind ¥1
353625: posts the ante ¥0.50
657898: posts the ante ¥0.50
1123550: posts the ante ¥0.50
1168207: posts the ante ¥0.50
299983: posts the ante ¥0.50
885662: posts the ante ¥0.50
*** HOLE CARDS ***
Dealt to 657898 [6d 8h 9s Ks As]
885662: raises ¥5.50 to ¥6.50
353625: calls ¥6.50
657898: folds
1123550: folds
1168207: folds
299983: folds
*** FLOP *** [7s 5s Ah] {Rake: ¥0}
885662: bets ¥17.50
353625: calls ¥17.50
*** TURN *** [7s 5s Ah] [2h] {Rake: ¥0}
885662: bets ¥52.50
353625: calls ¥25.75 and is all-in
Uncalled bet (¥26.75) returned to 885662
*** RIVER *** [7s 5s Ah 2h] [5d] {Rake: ¥5.50}
*** SHOW DOWN ***
885662: mucks hand
353625: mucks hand
885662 collected ¥98.50 from pot
*** SUMMARY ***
Total pot ¥104 | Rake ¥5.50
Board [7s 5s Ah 2h 5d]
Seat 1: 353625 showed [Jd Js Qh Qs 8c]
Seat 2: 657898 folded before Flop (didn't bet)
Seat 3: 1123550 (button) folded before Flop (didn't bet)
Seat 4: 1168207 (small blind) folded before Flop
Seat 5: 299983 (big blind) folded before Flop
Seat 6: 885662 showed [2c 4c 2d Kd 6h]
Hand ended at 2024/07/15 20:52:26
      `,
        expectedTable: {
            id: 'SPMA_14625_26274904',
            maxSeats: 6,
            blinds: [0.5, 1],
            ante: 0.5,
            club_id: 14625
        },
        expectedPlayers: [
            { id: 353625, username: '', club_id: 14625 },
            { id: 657898, username: '', club_id: 14625 },
            { id: 1123550, username: '', club_id: 14625 },
            { id: 1168207, username: '', club_id: 14625 },
            { id: 299983, username: '', club_id: 14625 },
            { id: 885662, username: '', club_id: 14625 }
        ]
    },
    {
        description: 'Hand with deal, double board',
        handText: `
SupremaPoker Hand #2627490400064:  5 Card Omaha Pot Limit (¥0.50/¥1 - Ante ¥0.50 CNY) - 2024/07/15 20:44:17 UTC
Table 'ClubId:14625,Table:SPMA_14625_26274904' 6-max Seat #1 is the button
Seat 1: 353625 (¥59.75 in chips)
Seat 2: 657898 (¥90 in chips)
Seat 3: 1123550 (¥22 in chips)
Seat 4: 1168207 (¥119 in chips)
Seat 5: 299983 (¥243.85 in chips)
657898: posts small blind ¥0.50
1123550: posts big blind ¥1
353625: posts the ante ¥0.50
657898: posts the ante ¥0.50
1123550: posts the ante ¥0.50
1168207: posts the ante ¥0.50
299983: posts the ante ¥0.50
*** HOLE CARDS ***
Dealt to 657898 [9s Th Tc Kd 8s]
1168207: raises ¥3 to ¥4
299983: folds
353625: calls ¥4
657898: calls ¥3.50
1123550: raises ¥17.50 to ¥21.50 and is all-in
1168207: raises ¥53.50 to ¥75
353625: folds
657898: folds
Uncalled bet (¥53.50) returned to 1168207
*** FIRST FLOP *** [4c 9h Js]
*** FIRST TURN *** [4c 9h Js] [Ks]
*** FIRST RIVER *** [4c 9h Js Ks] [Ad]
*** SECOND FLOP *** [7c As 2d]
*** SECOND TURN *** [7c As 2d] [6h]
*** SECOND RIVER *** [7c As 2d 6h] [2h]
*** FIRST SHOW DOWN ***
1123550: mucks hand
1168207: mucks hand
1123550 collected ¥25.15 from pot
*** SECOND SHOW DOWN ***
1123550: mucks hand
1168207: mucks hand
1123550 collected ¥25.15 from pot
*** SUMMARY ***
Total pot ¥53.50 | Rake ¥3.20
Hand was run twice
FIRST Board [4c 9h Js Ks Ad]
SECOND Board [7c As 2d 6h 2h]
Seat 1: 353625 (button) folded before Flop
Seat 2: 657898 (small blind) folded before Flop
Seat 3: 1123550 (big blind) showed [Jd Ah 7h Ac 2s]
Seat 4: 1168207 showed [9d 3d Kc Kh Qh]
Seat 5: 299983 folded before Flop (didn't bet)
Hand ended at 2024/07/15 20:44:58
      `,
        expectedTable: {
            id: 'SPMA_14625_26274904',
            maxSeats: 6,
            blinds: [0.5, 1],
            ante: 0.5,
            club_id: 14625
        },
        expectedPlayers: [
            { id: 353625, username: '', club_id: 14625 },
            { id: 657898, username: '', club_id: 14625 },
            { id: 1123550, username: '', club_id: 14625 },
            { id: 1168207, username: '', club_id: 14625 },
            { id: 299983, username: '', club_id: 14625 }
        ]
    },
    {
        description: 'Hand with STRADDLE',
        handText: `
SupremaPoker Hand #2626993400331:  5 Card Omaha Pot Limit (¥0.50/¥1 CNY) - 2024/07/15 21:31:17 UTC
Table 'ClubId:14625,Table:SPMA_14625_26269934' 6-max Seat #3 is the button
Seat 1: 1120661 (¥100 in chips)
Seat 2: 802228 (¥156.55 in chips)
Seat 3: 1172867 (¥110.80 in chips)
Seat 4: 1186292 (¥114.90 in chips)
Seat 5: 798076 (¥77.65 in chips)
Seat 6: 657898 (¥106.30 in chips)
1186292: posts small blind ¥0.50
798076: posts big blind ¥1
657898: posts straddle ¥2
*** HOLE CARDS ***
Dealt to 657898 [5s 2h Jd Qh 4s]
1120661: folds
802228: calls ¥2
1172867: raises ¥7.50 to ¥9.50
1186292: folds
798076: folds
657898: folds
802228: calls ¥7.50
*** FLOP *** [8s Qs 2d] {Rake: ¥0}
802228: checks
1172867: checks
*** TURN *** [8s Qs 2d] [2c] {Rake: ¥0}
802228: checks
1172867: bets ¥11.25
802228: folds
Uncalled bet (¥11.25) returned to 1172867
1172867 collected ¥20.85 from pot
*** SUMMARY ***
Total pot ¥22.50 | Rake ¥1.65
Board [8s Qs 2d 2c]
Seat 1: 1120661 folded before Flop (didn't bet)
Seat 2: 802228 folded on the Turn
Seat 3: 1172867 (button) collected (¥20.85)
Seat 4: 1186292 (small blind) folded before Flop
Seat 5: 798076 (big blind) folded before Flop
Seat 6: 657898 (straddle) folded before Flop
Hand ended at 2024/07/15 21:32:32
      `,
        expectedTable: {
            id: 'SPMA_14625_26269934',
            maxSeats: 6,
            blinds: [0.5, 1],
            ante: 0.5,
            club_id: 14625
        },
        expectedPlayers: [
            { id: 1120661, username: '', club_id: 14625 },
            { id: 802228, username: '', club_id: 14625 },
            { id: 1172867, username: '', club_id: 14625 },
            { id: 1186292, username: '', club_id: 14625 },
            { id: 798076, username: '', club_id: 14625 },
            { id: 657898, username: '', club_id: 14625 }
        ]
    }
];
