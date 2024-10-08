export class Player {
    id: number;
    username: string;
    club_id: number;

    constructor(id: number, username: string, club_id: number){
        this.id = id;
        this.username = username;
        this.club_id = club_id;
    }
}