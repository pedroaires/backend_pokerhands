import { BoardChangeEvent, DealtCardsEvent, HandEvent , PlayerActionEvent, UncalledBetEvent } from './handEvent';
export function createParser(action: string): EventParser {
    if (isPlayerAction(action)) {
        return new PlayerActionParser();
    } else if (isBoardChange(action)) {
        return new BoardChangeParser();
    } else if (isUncalledBet(action)) {
        return new UncalledBetParser();
    } else if (isDealtCards(action)) {
        return new DealtCardsParser();
    }
    return new DefaultEventParser();
}

function isPlayerAction(action: string): boolean {
    return action.includes('bets') || action.includes('folds') || action.includes('calls') || action.includes('raises') || action.includes('posts');
}

function isBoardChange(action: string): boolean {
    return action.includes('FLOP') || action.includes('TURN') || action.includes('RIVER');
}

function isUncalledBet(action: string): boolean {
    return action.includes('Uncalled bet');
}

function isDealtCards(action: string): boolean {
    return action.includes('Dealt');
}


export interface EventParser {
    parse(action: string): HandEvent;
}

export class DefaultEventParser implements EventParser {
    parse(action: string): HandEvent {
        return { label: 'UNKNOWN', text: action };
    }
}


export class PlayerActionParser implements EventParser {
    parse(action: string): PlayerActionEvent {
        const self = this;
        
        const playerId = self.extractPlayerId(action);
        const actionType = self.extractActionType(action);
        const amount = self.extractAmount(action);
        const isAllIn = self.extractIsAllIn(action);
        return new PlayerActionEvent(playerId, actionType, amount, isAllIn);
    }
    extractPlayerId(action: string): number {
        const playerIdMatch = action.match(/^\s*(\d+):/);
        if (!playerIdMatch) {
            throw new Error('Player ID not found in action string');
        }
        return parseInt(playerIdMatch[1]);
    }
    extractActionType(action: string): string {
        const actionTypeMatch = action.match(/\b(folds|checks|calls|bets|raises|collected|posts)\b/);
        if (!actionTypeMatch) {
            throw new Error('Action type not found in action string');
        }

        return actionTypeMatch[1];
    }

    extractAmount(action: string): number {
        const amountMatch = action.match(/¥([\d.]+)/);
        if (!amountMatch) {
            throw new Error('Amount not found in action string');
        }
        return parseFloat(amountMatch[1]);
    }

    extractIsAllIn(action: string): boolean {
        return action.includes('all-in');
    }


}


export class BoardChangeParser implements EventParser {
    parse(action: string): BoardChangeEvent {
        const self = this;
        const changeType = self.extractChangeType(action);
        const newBoard = self.extractNewBoard(action);
        return new BoardChangeEvent(changeType, newBoard);
        
    }
    extractChangeType(action: string): string {
        const changeTypeMatch = action.match('\*\*\*\s((FIRST|SECOND)?\s?(FLOP|TURN|RIVER))\s\*\*\*');
        if (!changeTypeMatch) {
            throw new Error('Change type not found in action string');
        }
        return changeTypeMatch[1];
    }
    extractNewBoard(action: string): string[] {
        const newBoardMatch = action.match('\[\s?([2-9TJQKA][scdh](?:\s[2-9TJQKA][scdh])*)\s?\]');
        if (!newBoardMatch) {
            throw new Error('Action type not found in action string');
        }
        return newBoardMatch[1].split(' ');
    }

    extractAmount(action: string): number {
        const amountMatch = action.match(/\$(\d+)/);
        if (!amountMatch) {
            throw new Error('Amount not found in action string');
        }
        return parseInt(amountMatch[1], 10);
    }

    extractIsAllIn(action: string): boolean {
        return action.includes('all-in');
    }

}

export class UncalledBetParser implements EventParser{
    parse(action: string): UncalledBetEvent {
        const self = this;
        const playerId = self.extractPlayerId(action);
        const amount = self.extractAmount(action);
        return new UncalledBetEvent({ playerId, amount });
    }
    extractPlayerId(action: string): number {
        const playerIdMatch = action.match(/Player (\d+)/);
        if (!playerIdMatch) {
            throw new Error('Player ID not found in action string');
        }
        return parseInt(playerIdMatch[1], 10);
    }
    extractAmount(action: string): number {
        const amountMatch = action.match(/\$(\d+)/);
        if (!amountMatch) {
            throw new Error('Amount not found in action string');
        }
        return parseInt(amountMatch[1], 10);
    }
}

export class DealtCardsParser implements EventParser{
    parse(action: string): DealtCardsEvent {
        const self = this;
        const playerId = self.extractPlayerId(action);
        const cards = self.extractCards(action);
        return new DealtCardsEvent({ playerId, cards });
    }
    extractPlayerId(action: string): number {
        const playerIdMatch = action.match(/Player (\d+)/);
        if (!playerIdMatch) {
            throw new Error('Player ID not found in action string');
        }
        return parseInt(playerIdMatch[1], 10);
    }
    extractCards(action: string): string[] {
        const cardsMatch = action.match(/\[([2-9TJQKA][scdh]\s[2-9TJQKA][scdh])\]/);
        if (!cardsMatch) {
            throw new Error('Cards not found in action string');
        }
        return cardsMatch[1].split(' ');
    }
}