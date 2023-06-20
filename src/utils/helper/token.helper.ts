import * as speakeasy from 'speakeasy';

const generateToken = (secret: string, digits = 6): string => {
    return speakeasy.totp({ secret, encoding: 'base32', digits });
}

const validationToken = (secret: string, token: string): boolean => {
    return speakeasy.totp.verify({
        secret, encoding: 'base32', window: 4, token
    });
}

export { generateToken, validationToken }