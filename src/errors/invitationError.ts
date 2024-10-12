export class InvitationError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class InvitationAlreadyExistsError extends InvitationError{

    constructor(inviteeUsername: string, teamName: string) {
        super(`Invitation for user with id: ${inviteeUsername} to team with name: ${teamName} already exists`, 409);
        this.statusCode = 409;
    }
}

export class UserIsAlreadyTeamMember extends InvitationError {
    
    constructor(inviteeUsername: string, teamName: string) {
        super(`User with id: ${inviteeUsername} is already a member of team with name: ${teamName}`, 409);
    }
}

export class InvitationNotFoundError extends InvitationError {
    constructor(id: string) {
        super(`Invitation with id: ${id} does not exist`, 404);
    }
}

export class InvitationNotPendingError extends InvitationError {
    constructor(id: string) {
        super(`Invitation with id: ${id} is not pending`, 400);
    }
}

export class UserNotAuthorizedForInvitationError extends InvitationError {
    constructor(userId: string, invitationId: string) {
        super(`User with id: ${userId} is not authorized to perform this action for invitation with id: ${invitationId}`, 401);
    }
}

export class InvalidStatusError extends InvitationError {
    constructor(status: string) {
        super(`Invalid status: ${status}`, 400);
    }
}