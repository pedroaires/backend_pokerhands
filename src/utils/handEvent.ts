import internal from "stream";

export interface HandEvent {
    label: string;
    text?: string;
}

export interface PlayerActionData {
    playerId: number;
    actionType: string;
    amount: number;
    isAllIn: boolean;
}

export class PlayerActionEvent implements HandEvent {
    // Event for actions of the player, liker: fold, call, raise,
    // posts blind, straddles, collected chips, etc.
    label = "PLAYER_ACTION";
    playerId: number;
    actionType: string;
    amount: number;
    isAllIn: boolean;

    constructor(playerId: number, actionType:string, amount:number, isAllIn: boolean) {
        this.playerId = playerId;
        this.actionType = actionType;
        this.amount = amount;
        this.isAllIn = isAllIn;
    }

}
export interface BoardChangeData {
    label: string;
    new_board: string[];
}
export class BoardChangeEvent implements HandEvent {
    // when there is a change in the board, like flop, turn, river
    // first flop, second flop ...
    label = "BOARD_CHANGE";
    constructor(public data: BoardChangeData) {}
}
export class UncalledBetEvent implements HandEvent {
    // when a player has an uncalled bet and the bet returns to him
    label = "UNCALLED_BET";
    constructor(public data: { playerId: number; amount: number }) {}
}

export class DealtCardsEvent implements HandEvent {
    // when a player receives cards
    label = "DEALT_CARDS";
    constructor(public data: { playerId: number; cards: string[] }) {}
}

export interface SeatSummary {
    seatNumber: number; // Seat number (1-6 in this case)
    playerId: number; // Unique player identifier
    result: string; // "folded", "collected", "shoed"
    resultStage: string; // "flop", "turn", "river", etc.
    role: string; // "small blind", "big blind", "button", etc.
    collectedAmount: number; // Amount collected by the player if they won
    cards: string[]; // Cards held by the player
}
export interface Board{
    cards: string[];
}
export interface SummaryData {
    totalPot: number,
    rake: number,
    boards: Board[],
    seatsResults: SeatSummary[]
    startDate: string,
    endDate: string,
    
}
