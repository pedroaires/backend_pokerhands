import { promises as fs } from 'fs';
import { PrismaClient, Hand, HandEvent } from '@prisma/client';
import { HandUploadFailed, HandParseError, HandNotFoundError } from '../errors/handError';
import { HandMetadataParser, HandMetadata } from '../parser/metadataParser';
import { createParser } from '../parser/eventParser';
import { HandEvent as HandEventInterface, DealtCardsEvent, BoardChangeEvent, PlayerActionEvent} from '../parser/handEvent';
import { UserNotFoundError } from '../errors/userError';
  
  
export class HandService {
    private prisma: PrismaClient;
    
    constructor() {
        this.prisma = new PrismaClient();
    }

    async processHand(handContent: string, userId: string): Promise<Hand> {
        try {
            // Parse hand events and metadata
            const events = this.parseHandEvents(handContent);
            const handMetadata = this.parseHandMetadata(handContent);
            
            // Process and store the hand
            const { hand, handEvents } = await this.createHand(events, handMetadata, userId);
            return hand;
        } catch (error) {
            console.error('Failed to parse or process hand:', error);
            throw new HandParseError();
        }
    }

    async processHandFile(file: Express.Multer.File, userId: string): Promise<Hand[]> {
        // Check if the user exists
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
        });
    
        if (!userExists) {
            throw new UserNotFoundError(userId);
        }
    
        try {
            const filePath = file.path;
            const fileContent = await fs.readFile(filePath, 'utf-8');
    
            // Split the file by empty lines to separate hands
            const hands = fileContent.split(/\n\s*\n/).filter(Boolean); // Splitting by empty lines
            const processedHands: Hand[] = [];
    
            // Process each hand one by one
            for (const handContent of hands) {
                const hand = await this.processHand(handContent, userId);
                processedHands.push(hand);
            }
    
            return processedHands; // Return all processed hands
        } catch (error) {
            console.error('Failed to upload and process hands:', error);
            throw new HandUploadFailed();
        }
    }
    


    parseHandEvents(handText: string): HandEventInterface[] {
        const lines = handText.split('\n');
        let events = lines.map(line => {
            const eventParser = createParser(line);
            return eventParser.parse(line);
        });
        events = events.filter(event => event.label !== 'UNKNOWN');

        return events;
    }

    parseHandMetadata(handText: string): HandMetadata {
        const metadataParser = new HandMetadataParser();
        return metadataParser.parse(handText);
    }

    extractNumericValue(stack: string): number {
        // Use a regular expression to remove non-numeric characters
        const numericValue = stack.replace(/[^\d.-]/g, '');  // Keeps digits, dots, and minus sign (for negative numbers)
        return parseFloat(numericValue);  
    }

    async createHand(events: HandEventInterface[], handMetadata: HandMetadata, userId: string): Promise<{ hand: Hand, handEvents: HandEvent[] }> {
        return await this.prisma.$transaction(async (prisma) => {
            const hand = await prisma.hand.create({
                data: {
                    ownerId: userId,
                    startDateTime: new Date(handMetadata.startDateTime),
                    endDateTime: new Date(handMetadata.endDateTime),
                    gameType: handMetadata.gameType,
                    blinds: {
                        smallBlind: this.extractNumericValue(handMetadata.blinds.smallBlind),
                        bigBlind: this.extractNumericValue(handMetadata.blinds.bigBlind),
                        ante: handMetadata.blinds.ante ? this.extractNumericValue(handMetadata.blinds.ante) : undefined,
                    },
                    tableId: handMetadata.tableId,
                    clubId: Number(handMetadata.clubId),
                    maxSeats: handMetadata.maxSeats,
                    seatMapper: handMetadata.players.map((player) => ({
                        seat: player.seat,
                        playerId: player.playerId,
                        stack: this.extractNumericValue(player.stack)
                    })) as { seat: number, playerId: number, stack: number }[],
                    buttonSeat: handMetadata.buttonSeat,
                    players: {
                        create: handMetadata.players.map((player) => ({
                            username: String(player.playerId),
                            clubId: Number(handMetadata.clubId),
                        })),
                    },
                    totalPot: this.extractNumericValue(handMetadata.totalPot),
                    rake: this.extractNumericValue(handMetadata.rake),
                    boards: handMetadata.boards, // Storing the array of board runs
                    heroCards: handMetadata.heroCards // Storing hero's dealt cards
                }
            });
    
            const handEvents = await Promise.all(events.map(async (event) => {
                return prisma.handEvent.create({
                    data: {
                        handId: hand.id,               
                        eventType: event.label,        
                        eventData: event.getDataJson() 
                    },
                });
            }));
    
            return {
                hand,
                handEvents,
            };
        });
    }

    async getHandsByUser(userId: string): Promise<Hand[]> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!userExists) {
            throw new UserNotFoundError(userId);
        }

        const hands = this.prisma.hand.findMany({
            where: {
                ownerId: userId
            }
        });
        
        const handsWithBalance = await Promise.all(
            (await hands).map(async (hand) => {
                const balance = await this.computeHeroBalance(hand);
                return {
                    ...hand,
                    balance, // Include the calculated balance for each hand
                };
            })
        );
        
        return handsWithBalance;
    }

    async getAllTeamHands(userId: string): Promise<Hand[]> {
        
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                teams: {
                    include: {
                        users: true,
                    }
                }
            }
        });
    
        if (!userExists) {
            throw new UserNotFoundError(userId);
        }
    
        
        const teamUserIds = userExists.teams.flatMap(team => 
            team.users.map(user => user.id)
        ).filter(id => id !== userId);  
    
        
        const hands = await this.prisma.hand.findMany({
            where: {
                ownerId: {
                    in: teamUserIds  
                }
            }
        });
        return hands;
    }

    async getHandById(userId:string, handId: string): Promise<Hand | null> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!userExists) {
            throw new UserNotFoundError(userId);
        }
        
        const hand = this.prisma.hand.findUnique({
            where: {
                id: handId,
                ownerId: userId
            }
        });
        if (!hand) {
            throw new HandNotFoundError(handId);
        }
        return hand;
    }

    async deleteUserHand(userId: string, handId: string): Promise<Hand | undefined> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            throw new UserNotFoundError(userId);
        }

        const hand = await this.prisma.hand.findUnique({
            where: {
                id: handId,
                ownerId: userId
            }
        });

        if (!hand) {
            throw new HandNotFoundError(handId);
        }

        const deleted = await this.prisma.hand.delete({
            where: {
                id: handId
            }
        });
        return deleted
    }

    async computeHeroBalance(hand: Hand): Promise<number> {
        const handEvents = await this.prisma.handEvent.findMany({
            where: {
                handId: hand.id
            }
        });
        const heroId = this.findHeroId(handEvents);
    
        const heroSeat = Array.isArray(hand.seatMapper)
            ? (hand.seatMapper as { seat: number, playerId: number, stack: number }[])
                  .find(seat => seat.playerId === heroId)
            : null;
            
        if (!heroSeat) {
            console.log('Hero seat not found');
            return 0;
        }
    
        let initialStack = heroSeat.stack;
        let finalStack = initialStack;
    
        for (const event of handEvents) {
            if (event.eventType === 'PLAYER_ACTION') {
                const parsedEvent = event.eventData as unknown as PlayerActionEvent;
                
                
                if (parsedEvent.playerId === heroId) {
                    // Deduct stack for bets, calls, raises, posts
                    if (['bets', 'calls', 'raises', 'posts'].includes(parsedEvent.actionType)) {
                        finalStack -= parsedEvent.amount;
                    }
    
                    // If hero collected chips, add the amount to the stack
                    if (parsedEvent.actionType === 'collected') {
                        finalStack += parsedEvent.amount;
                    }
                }
            }
        }
    
        const balance = finalStack - initialStack;
        return parseFloat(balance.toFixed(2));
    }

    findHeroId(events: HandEvent[]): number {
        const dealtCardsEvent = events.find(event => event.eventType === 'DEALT_CARDS') as unknown as DealtCardsEvent;
    
        if (dealtCardsEvent && (dealtCardsEvent as any).eventData) {
            const eventData = (dealtCardsEvent as any).eventData as { playerId: number; cards: string[] };
        
            if (eventData && eventData.playerId) {
                return eventData.playerId;
            }
        }

        throw new Error('Dealt cards event not found');

    }
    isDealtCardsEventData(data: any): data is DealtCardsEvent {
        return typeof data === 'object' && data !== null && 'playerId' in data && Array.isArray(data.cards);
    }
}
