import { Card } from './card'

export class PlayerHand {
    constructor(public cards: Card[]) {
      this.cards = cards;
      if (new Set(cards).size !== cards.length) {
        throw new Error('Player hand must have unique cards');
      }
    }
  }
  
export class Omaha5PlayerHand extends PlayerHand {
    constructor(public cards: Card[]) {
      if (cards.length !== 5) {
          throw new Error('Omaha 5 player hand must have 5 cards');
      }
      super(cards);
    }
}
export class PlayerHandNotShown extends PlayerHand {
    constructor() {
        super([]);
    }
}

export class Seat {
    seatNumber: number;
    playerId: number;
    stack: number;
    playerHand: PlayerHand;
    isHero: boolean;

    constructor(seatNumber: number, playerId: number, stack: number, playerHand: PlayerHand, isHero: boolean) {
        this.seatNumber = seatNumber;
        this.playerId = playerId;
        this.stack = stack;
        this.playerHand = playerHand;
        this.isHero = isHero;
    }
    isOccupied() {
        return this.playerId !== null;
    }
}