export interface HandEvent {
    label: string;
    text?: string;
    getDataJson(): any;
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

    getDataJson() {
        return {
            playerId: this.playerId,
            actionType: this.actionType,
            amount: this.amount,
            isAllIn: this.isAllIn
        };
    }

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

    getDataJson() {
        return {
            changeType: this.changeType,
            newBoard: this.newBoard
        };
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

    getDataJson() {
        return {
            playerId: this.playerId,
            amount: this.amount
        };
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

    getDataJson() {
        return {
            playerId: this.playerId,
            cards: this.cards
        };
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

    getDataJson() {
        return {
            playerId: this.playerId,
            cards: this.cards
        };
    }
}