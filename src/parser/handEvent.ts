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
    // Event for actions of the player, like: fold, call, raise,
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
    changeType: string;
    newBoard: string[];

    constructor(
        changeType: string,
        newBoard: string[]
    ) {
        this.changeType = changeType;
        this.newBoard = newBoard;
    } 
}
export class UncalledBetEvent implements HandEvent {
    // when a player has an uncalled bet and the bet returns to him
    label = "UNCALLED_BET";
    playerId: number;
    amount: number;
    constructor(
        playerId: number,
        amount: number
    ) {
        this.playerId = playerId;
        this.amount = amount;
    }
}

export class DealtCardsEvent implements HandEvent {
    // when a player receives cards
    label = "DEALT_CARDS";
    playerId: number;
    cards: string[];
    constructor(
        playerId: number,
        cards: string[]
    ) {
        this.playerId = playerId;
        this.cards = cards;
    }
}

export class ShowCardsEvent implements HandEvent {
    // when a player shows cards
    label = "SHOW_CARDS";
    playerId: number;
    cards: string[];
    constructor(
        playerId: number,
        cards: string[]
    ) {
        this.playerId = playerId;
        this.cards = cards;
    }
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
