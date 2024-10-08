import { promises as fs } from 'fs';

export class HandService {
    async processHandFile(file: Express.Multer.File, userId: string): Promise<string> {
        try {
            // Use the file path provided by Multer directly, no need to concatenate another absolute path
            const filePath = file.path;

            // Read and process the file
            const fileContent = await fs.readFile(filePath, 'utf-8');

            // console.log(`Processing file for user ${userId}:`, fileContent);
            
            return `Processed file for user ${userId}`;
        } catch (error) {
            console.error('Error processing hand file:', error);
            throw new Error('Failed to process file');
        }
    }
}