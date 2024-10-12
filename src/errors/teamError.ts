export class TeamError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class TeamWithNameNotFoundError extends TeamError {
    constructor(name: string) {
        super(`Team with name: ${name} does not exist`, 404);
    }
}

export class TeamAlreadyExistsError extends TeamError{

    constructor(name: string) {
        super(`Team with name: ${name} already exists`, 409);
        this.statusCode = 409;
    }
}

export class TeamUnauthorizedError extends TeamError {
    constructor(userId: string, teamName: string) {
        super(`User with id: ${userId} is not authorized to perform this action for team: ${teamName}`, 401);
    }
}