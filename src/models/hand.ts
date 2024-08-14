import { Table } from './table';
import { Card } from './card'
import { Seat } from './seat'
import { Action } from './action'

export class Board {
    cards: Card[];

    constructor(cards: Card[]) {
        if (new Set(cards).size !== cards.length) {
            throw new Error('Board must have unique cards');
        }
        this.cards = cards;
    }
    getFloppedCards() {
        if (this.cards.length < 3) {
            return [];
        }
        return this.cards.slice(0, 3);
    }
    getTurnCard() {
        if (this.cards.length < 4) {
            return null;
        }
        return this.cards[3];
    }
    getRiverCard() {
        if (this.cards.length < 5) {
            return null;
        }
        return this.cards[4];
    }

}


export class Hand {
    id: number;
    seats: Seat[];
    board: Board;
    preflopActions: Action[];
    flopActions: Action[];
    turnActions: Action[];
    riverActions: Action[];
    table: Table;
    rake: number;
    constructor(id: number, seats: Seat[], board: Board, table: Table, rake: number, preflopActions: Action[], flopActions: Action[], turnActions: Action[], riverActions: Action[]) {
        this.id = id;
        this.seats = seats;
        this.board = board;
        this.preflopActions = preflopActions;
        this.flopActions = flopActions;
        this.turnActions = turnActions;
        this.riverActions = riverActions;
        this.table = table;
        this.rake = rake;
    }
}