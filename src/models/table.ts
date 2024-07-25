export class Seat {
    seatNumber: number;
    player: string;
    stack: number;

    constructor(seatNumber: number, player: string, stack: number, position: string) {
        this.seatNumber = seatNumber;
        this.player = player;
        this.stack = stack;
    }
    isOccupied() {
        return this.player !== null;
    }
}


export class Table {
    id: string;
    maxSeats: number;
    blinds: [number, number];
    ante: number;
    
    constructor(id: string, maxSeats: number, blinds: [number, number], ante: number) {
        this.id = id;
        this.maxSeats = maxSeats;
        this.blinds = blinds;
        this.ante = ante;
    }

}