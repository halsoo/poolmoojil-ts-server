const jwtSecret: any = process.env.JWT_SECRET;
import * as jwt from 'jsonwebtoken';

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

export function decodeToken(token: any): Promise<Object> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (error: any, decoded: any) => {
            if (error) reject(error);
            resolve(decoded);
        });
    });
}

export async function jwtMiddleware(ctx: any, next: any) {
    const token = ctx.cookies.get('access_token');
    const admin = ctx.cookies.get('admin_token');
    if (!token) return next();

    try {
        const decoded: any = await decodeToken(token); // 토큰을 디코딩 합니다
        // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
        let decodedAdmin: any = undefined;
        if (admin) decodedAdmin = await decodeToken(admin);

        if (Date.now() / 1000 - decoded.iat > 60 * 60) {
            const { id, userID, email } = decoded;
            const freshToken = await generateToken({ id, userID, email });
            ctx.cookies.set('access_token', freshToken, {
                maxAge: 1000 * 60 * 60 * 24, // 1day
                httpOnly: false,
            });
        }

        if (decodedAdmin) {
            if (Date.now() / 1000 - admin.iat > 60 * 60) {
                const { id, userID } = decodedAdmin;
                const freshAdmin = await generateToken({ id, userID });
                ctx.cookies.set('admin_token', freshAdmin, {
                    maxAge: 1000 * 60 * 60 * 24, // 1day
                    httpOnly: false,
                });
            }
        }

        ctx.request.user = decoded;
        ctx.request.admin = decodedAdmin;

        // ctx.request.user 에 디코딩된 값을 넣어줍니다
    } catch (e) {
        // token validate 실패
        ctx.request.user = null;
        ctx.request.admin = null;
    }
    return next();
}
