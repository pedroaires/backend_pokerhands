export class HandError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class HandUploadFailed extends HandError {
    constructor() {
        super('Could not read the file', 500);
    }
}

export class HandParseError extends HandError {
    constructor() {
        super('Could not parse the hand', 400);
    }
}

export class HandNotFoundError extends HandError {
    constructor(handId: string) {
        super(`Hand with ID ${handId} not found`, 404);
    }
}
