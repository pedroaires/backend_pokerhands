import { promises as fs } from 'fs';
import { PrismaClient, Hand, HandEvent } from '@prisma/client';
import { HandUploadFailed, HandParseError, HandNotFoundError } from '../errors/handError';
import { HandMetadataParser, HandMetadata } from '../parser/metadataParser';
import { createParser } from '../parser/eventParser';
import { HandEvent as HandEventInterface} from '../parser/handEvent';
import { UserNotFoundError } from '../errors/userError';

export class HandService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    async processHandFile(file: Express.Multer.File, userId: string): Promise<Hand> {
        const userExists = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            throw new UserNotFoundError(userId);
        }
        try {
            const filePath = file.path;
            const fileContent = await fs.readFile(filePath, 'utf-8');
            
            try {
                const events = this.parseHandEvents(fileContent);
                const handMetadata = this.parseHandMetadata(fileContent);
                const { hand, handEvents } = await this.createHand(events, handMetadata, userId);
                return hand;
                
            }
            catch (error) {
                throw new HandParseError();
            }
        } catch (error) {
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
                data:{
                    ownerId: userId,
                    startDateTime: new Date(handMetadata.startDateTime),
                    endDateTime: new Date(handMetadata.endDateTime),
                    gameType: handMetadata.gameType,
                    blinds: {
                        smallBlind: this.extractNumericValue(handMetadata.blinds.smallBlind),
                        bigBlind: this.extractNumericValue(handMetadata.blinds.bigBlind),
                        ante: handMetadata.blinds.ante? this.extractNumericValue(handMetadata.blinds.ante) : undefined,
                    },
                    tableId: handMetadata.tableId,
                    clubId: Number(handMetadata.clubId),
                    maxSeats: handMetadata.maxSeats,
                    seatMapper: handMetadata.players.map((player) => ({
                            seat: player.seat,
                            playerId: player.playerId,
                            stack: this.extractNumericValue(player.stack)
                        }))
                    ,
                    buttonSeat: handMetadata.buttonSeat,
                    players: {
                        create: handMetadata.players.map((player) => ({
                            username: String(player.playerId),
                            clubId: Number(handMetadata.clubId),
                        })),
                    }
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

}
