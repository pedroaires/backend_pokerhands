export class Board {
    constructor(public cards: Card[]) {
        if (new Set(cards).size !== cards.length) {
            throw new Error('Board must have unique cards');
        }
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