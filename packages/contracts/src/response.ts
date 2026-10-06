interface Response {
    success: boolean;
    message: string;
}

export interface BaseResponse extends Response {
    data: null;
}

export interface IsUserSignedUpResponse extends Response {
    data: boolean;
}