import { Seat } from './seat'

export enum ActionType {
    ANTE = 'ante',
    SMALL_BLIND = 'small_blind',
    BIG_BLIND = 'big_blind',
    STRADDLE = 'straddle',
    FOLD = 'fold',
    CHECK = 'check',
    CALL = 'call',
    BET = 'bet',
    RAISE = 'raise',
    SHOW = 'show'
}


export class Action {
    seat: Seat;
    type: ActionType;
    amount: number;
    constructor(seat: Seat, type: ActionType, amount: number) {
        this.seat = seat;
        this.type = type;
        this.amount = amount;
    }
}