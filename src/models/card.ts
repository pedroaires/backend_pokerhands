export enum CardValue {
    "Two" = 2,
    "Three" = 3,
    "Four" = 4,
    "Five" = 5,
    "Six" = 6,
    "Seven" = 7,
    "Eight" = 8,
    "Nine" = 9,
    "Ten" = 10,
    "Jack" = 11,
    "Queen" = 12,
    "King" = 13,
    "Ace" = 14
}

export enum CardSuit {
    "Hearts" = "h",
    "Diamonds" = "d",
    "Clubs" = "c",
    "Spades" = "s"
}

export class Card {
    constructor(public value: CardValue, public suit: CardSuit) {}
    static fromString(cardStr: string): Card {
        const valueChar = cardStr[0];
        const suitChar = cardStr[1];

        const valueMap: { [key: string]: CardValue } = {
            "2": CardValue.Two,
            "3": CardValue.Three,
            "4": CardValue.Four,
            "5": CardValue.Five,
            "6": CardValue.Six,
            "7": CardValue.Seven,
            "8": CardValue.Eight,
            "9": CardValue.Nine,
            "T": CardValue.Ten,
            "J": CardValue.Jack,
            "Q": CardValue.Queen,
            "K": CardValue.King,
            "A": CardValue.Ace
        };

        const suitMap: { [key: string]: CardSuit } = {
            "h": CardSuit.Hearts,
            "d": CardSuit.Diamonds,
            "c": CardSuit.Clubs,
            "s": CardSuit.Spades
        };

        const value = valueMap[valueChar.toUpperCase()];
        const suit = suitMap[suitChar.toLowerCase()];

        if (!value || !suit) {
            throw new Error(`Invalid card string: ${cardStr}`);
        }

        return new Card(value, suit);
    }
    static fromStringArray(cardStrArray: string[]): Card[] {
        return cardStrArray.map(Card.fromString);
    }
}