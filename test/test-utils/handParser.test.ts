import { HandParser } from '../../src/utils/handParser';
import { PrismaClient } from '@prisma/client';
import  { handExamples } from '../test_data/handExamples';	
// Mocking PrismaClient at the top level
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    table: {
      upsert: jest.fn()
    },
    player: {
      upsert: jest.fn()
    }
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

const prisma = new PrismaClient(); // Instantiate mocked PrismaClient

describe('HandParser Tests', () => {
  // Running the test for each hand example
  it.each(handExamples)(
    'should parse the poker hand correctly: %s', // Display description for each test case
    async ({ description, handText, expectedTable, expectedPlayers }) => {
      
      const parser = new HandParser(handText);

      // Mocking Prisma responses for table and players
      (prisma.table.upsert as jest.Mock).mockResolvedValue(expectedTable);

      (prisma.player.upsert as jest.Mock).mockImplementation(({ where: { id } }) => {
        const player = expectedPlayers.find(p => p.id === id);
        return Promise.resolve(player || { id, username: '', club_id: expectedTable.club_id });
      });

      const result = await parser.parseHand();

      // Expectations for the parsed table
      expect(result.table).toEqual(expectedTable);

      // Expectations for the parsed players
      expect(result.players).toEqual(expectedPlayers);

      // Ensure upsert is called the correct number of times for players and table
      expect(prisma.table.upsert).toHaveBeenCalledTimes(1);
      expect(prisma.player.upsert).toHaveBeenCalledTimes(expectedPlayers.length);
    }
  );

});
