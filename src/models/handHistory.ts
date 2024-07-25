import { Seat } from './table';
import { Board } from './board';
import {Table} from './table';

enum ActionType {
    ANTE = 'ante',
    SMALL_BLIND = 'small_blind',
    BIG_BLIND = 'big_blind',
    FOLD = 'fold',
    CHECK = 'check',
    CALL = 'call',
    BET = 'bet',
    RAISE = 'raise',
    SHOW = 'show',
    WIN = 'win',
}


class Action {
    player: string;
    type: ActionType;
    amount: number;
    constructor(player: string, type: ActionType, amount: number) {
        this.player = player;
        this.type = type;
        this.amount = amount;
    }
}

class HandHistory {
    id: number;
    seats: Seat[];
    board: Board;
    actions: Action[];
    table: Table;
    rake: number;
    constructor(id: number, seats: Seat[], board: Board, actions: Action[], table: Table, rake: number) {
        this.id = id;
        this.seats = seats;
        this.board = board;
        this.actions = actions;
        this.table = table;
        this.rake = rake;
    }

}