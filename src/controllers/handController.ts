import { Request, Response } from 'express';
import { HandService } from '../services/handService';

export class HandController {
    private handService: HandService;

    constructor(handService: HandService) {
        this.handService = handService;
    }

    async uploadHandFile(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const result = await this.handService.processHandFile(file, userId);

            return res.json({ message: 'File uploaded and processed successfully', result });
        } catch (error) {
            console.error('Error uploading hand file:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    }
}
