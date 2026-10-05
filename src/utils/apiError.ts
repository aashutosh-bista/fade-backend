export class ApiError extends Error{
    statusCode: number;
    success: boolean = false;
    constructor(statusCode: number, message: string){
        super(message);
        this.statusCode = statusCode;
        this.name = "ApiError";
    }
}