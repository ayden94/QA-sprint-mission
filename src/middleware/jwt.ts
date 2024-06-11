import pkg from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import DotenvFlow from 'dotenv-flow';

const { sign, verify } = pkg;

DotenvFlow.config({
	path: './',
	node_env: process.env.NODE_ENV || 'development',
});

// 토큰 발급
export function generateToken(
	email: string,
	nickname: string,
	type: 'access' | 'refresh',
) {
	const hour = Date.now() + 1000 * 60 * 60;
	const month = hour * 24 * 30;
	const exp = type === 'access' ? hour : month;

	const secretKey = process.env[
		`JWT_SECRET${type === 'access' ? '' : '_REFRESH'}`
	] as string;

	const token = sign({ nickname, email, exp }, secretKey);

	return token;
}

type Decoded = {
	nickname: string;
	email: string;
	exp: number;
};

export function verifyToken(decoded: Decoded): boolean {
	// exp가 현재 시간 이전인 경우(만료된 토큰)
	if (decoded.exp < Date.now()) return false;
	else return true;
}

export function decodeToken(token: string, secret: string) {
	// 임의의 문자열로 구성된 토큰을 Payload로 되돌림
	try {
		const decoded = verify(token, secret) as Decoded;
		return decoded;
	} catch (err) {
		throw new Error('Failed to decode token');
	}
}

export function authValidate(req: Request, res: Response, next: NextFunction) {
	const token = req.headers['authorization']?.split(' ')[1];

	if (token) {
		const decoded = decodeToken(token, process.env.JWT_SECRET!);
		const isOK = verifyToken(decoded);

		if (isOK) {
			req.cookies = {
				email: decoded.email,
				nickname: decoded.nickname,
			};
		} else {
			throw new Error(`token expired`);
		}
	}

	next();
}
