export class UserError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class UserNotFoundError extends UserError {
    constructor(id: string) {
        super(`User with id: ${id} does not exist`, 404);
    }
}

export class UserWithUsernameNotFoundError extends UserError {
    constructor(username: string) {
        super(`User with username: ${username} does not exist`, 404);
    }
}

export class UserAlreadyExistsError extends UserError{

    constructor(username: string) {
        super(`User with username: ${username} already exists`, 409);
        this.statusCode = 409;
    }
}

export class InvalidCredentialsError extends UserError {
    constructor() {
        super('Invalid credentials', 401);
    }
}