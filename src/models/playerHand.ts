
export class PlayerHand {
  constructor(public cards: Card[]) {
    this.cards = cards;
    if (new Set(cards).size !== cards.length) {
      throw new Error('Omaha 5 poker hand must have unique cards');
    }
  }
}

export class Omaha5PlayerHand extends PlayerHand {
  constructor(public cards: Card[]) {
    if (cards.length !== 5) {
        throw new Error('Omaha 5 poker hand must have 5 cards');
    }
    super(cards);
  }
}