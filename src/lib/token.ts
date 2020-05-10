const jwtSecret = process.env.JWT_SECRET;
import * as jwt from 'jsonwebtoken';
import { BaseContext } from 'koa';

/**
 * JWT 토큰 생성
 * @param {any} payload
 * @returns {string} token
 */
export function generateToken(payload: Object): Promise<Object> {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            jwtSecret,
            {
                expiresIn: '1d',
            },
            (error: any, token: any) => {
                if (error) reject(error);
                resolve(token);
            },
        );
    });
}

export function decodeToken(token: String): Promise<Object> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (error: any, decoded: any) => {
            if (error) reject(error);
            resolve(decoded);
        });
    });
}

export async function jwtMiddleware(ctx: BaseContext, next: any) {
    const token = ctx.cookies.get('access_token');
    if (!token) return next();

    try {
        const decoded = await decodeToken(token); // 토큰을 디코딩 합니다
        // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다

        if (Date.now() / 1000 - decoded.iat > 60 * 60) {
            // 하루가 지나면 갱신해준다.
            const { id, userID, email } = decoded;
            const freshToken = await generateToken({ id, userID, email });
            ctx.cookies.set('access_token', freshToken, {
                maxAge: 1000 * 60 * 60 * 24, // 1day
                httpOnly: true,
            });
        }

        ctx.request.user = decoded;

        // ctx.request.user 에 디코딩된 값을 넣어줍니다
    } catch (e) {
        // token validate 실패
        ctx.request.user = null;
    }
    return next();
}
