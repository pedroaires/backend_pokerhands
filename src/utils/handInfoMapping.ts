interface HandEvent {
    label: string;
}

interface PlayerActionData {
    playerId: number;
    actionType: string;
    amount: number;
    isAllIn: boolean;
}

class PlayerActionEvent implements HandEvent {
    // Event for actions of the player, liker: fold, call, raise,
    // posts blind, straddles, collected chipes, etc.
label = "PLAYER_ACTION";
constructor(public data: PlayerActionData) {}
}
interface BoardChangeData {
    label: string;
    cards: string[];
}
class BoardChangeEvent implements HandEvent {
    // when there is a change in the board, like flop, turn, river
    // first flop, second flop ...
    label = "STAGE_CHANGE";
    constructor(public data: BoardChangeData) {}
}
class UncalledBetEvent implements HandEvent {
    // when a player has an uncalled bet and the bet returns to him
    label = "UNCALLED_BET";
    constructor(public data: { playerId: number; amount: number }) {}
}

class DealtCardsEvent implements HandEvent {
    // when a player receives cards
    label = "DEALT_CARDS";
    constructor(public data: { playerId: number; cards: string[] }) {}
}

interface SeatSummary {
    seatNumber: number; // Seat number (1-6 in this case)
    playerId: number; // Unique player identifier
    result: string; // "folded", "collected", "shoed"
    resultStage: string; // "flop", "turn", "river", etc.
    role: string; // "small blind", "big blind", "button", etc.
    collectedAmount: number; // Amount collected by the player if they won
    cards: string[]; // Cards held by the player
}
interface Board{
    cards: string[];
}
// SummaryEvent Composition
interface SummaryData {
    totalPot: number,
    rake: number,
    boards: Board[],
    seatsResults: SeatSummary[]
    startDate: string,
    endDate: string,
    
}
