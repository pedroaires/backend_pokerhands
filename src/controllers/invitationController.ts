import { Request, Response } from "express";
import { InvitationService } from "../services/invitationService";

export class InvitationController {
    private invitationService: InvitationService;

    constructor(invitationService: InvitationService) {
        this.invitationService = invitationService;
    }

    async sendInvitation(req: Request, res: Response) {
        const { userId, teamName } = req.params;
        const { inviteeUsername } = req.body;

        if (!userId) {
            return res.status(400).send({ message: 'Missing user ID' });
        }
        if (!teamName) {
            return res.status(400).send({ message: 'Missing team ID' });
        }
        
        if (!inviteeUsername) {
            return res.status(400).send({ message: 'Missing invitee username' });
        }
        

    
        const invitation = await this.invitationService.sendInvitation(userId, teamName, inviteeUsername);
        res.status(201).send({ message: 'Invitation sent', invitation });
    }

    async getPendingInvitations(req: Request, res: Response) {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).send({ message: 'Missing user ID' });
        }
    
        const invitations = await this.invitationService.getPendingInvitations(userId);
        res.status(200).send({ invitations });
    }

    async respondToInvitation(req: Request, res: Response) {
        const { invitationId, userId } = req.params;
        const { response } = req.body;

        if (!invitationId) {
            return res.status(400).send({ message: 'Missing invitation ID' });
        }
        if (!response) {
            return res.status(400).send({ message: 'Missing response (ACCEPTED or REJECTED)' });
        }

    
        const updatedInvitation = await this.invitationService.respondToInvitation(userId, invitationId, response);
        res.status(200).send({ message: 'Invitation updated', updatedInvitation });
    }
}
