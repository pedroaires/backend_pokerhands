export class Table {
    id: string;
    maxSeats: number;
    blinds: [number, number];
    ante: number;
    club_id: number;
    constructor(id: string, maxSeats: number, blinds: [number, number], ante: number, club_id:number) {
        this.id = id;
        this.maxSeats = maxSeats;
        this.blinds = blinds;
        this.ante = ante;
        this.club_id = club_id;
    }

}