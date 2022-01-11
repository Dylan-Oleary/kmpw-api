export type AccessToken = string;
export type RefreshToken = string;

export interface IGenerateTokenOptions {
    /**
     * The intended audience that the token will be used for
     */
    aud: string;
    /**
     * The token expiry date
     */
    exp: number;
    /**
     * The issuer of the token
     */
    iss: string;
    /**
     * The session id to be used in the token
     */
    sid: string;
    /**
     * The user id to be used in the token
     */
    sub: string;
}
