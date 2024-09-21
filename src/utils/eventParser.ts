import { HandEvent , PlayerActionEvent } from './handEvent';
function createParser(action: string): EventParser {
    if (action.includes('bets')) {
        return new PlayerActionParser();
    } else {
        console.log('Unknown action type: ', action);
        return new DefaultEventParser();
    }
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
        const playerIdMatch = action.match(/Player (\d+)/);
        if (!playerIdMatch) {
            throw new Error('Player ID not found in action string');
        }
        return parseInt(playerIdMatch[1], 10);
    }
    extractActionType(action: string): string {
        const actionTypeMatch = action.match(/(bets|folds|calls)/);
        if (!actionTypeMatch) {
            throw new Error('Action type not found in action string');
        }
        return actionTypeMatch[1];
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
