interface BaseResponse {
    success: boolean;
    message: string;
}

export interface DefaultResponse extends BaseResponse {
    data: null;
}

export interface ProfileNotCompletedResponse extends BaseResponse {
    data: {
        isProfileComplete: false
    }
}
