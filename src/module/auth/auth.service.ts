import pkg from 'bcryptjs';
import DotenvFlow from 'dotenv-flow';
import { decodeToken, generateToken, verifyToken } from '../../middleware/jwt';
import { CreateUserProps } from '../user/user.types';
import userRepository from '../user/user.repository';

DotenvFlow.config({
	path: './',
	node_env: process.env.NODE_ENV || 'development',
});

const { genSalt, hash, compare } = pkg;

async function signUp({ email, password, nickname }: CreateUserProps) {
	// salt + hash
	const salt = await genSalt();
	const hashedPassword = await hash(password, salt);

	await userRepository.User_create({
		email,
		password: hashedPassword,
		nickname,
	});

	return {
		accessToken: generateToken(email, nickname, 'access'),
		refreshToken: generateToken(email, nickname, 'refresh'),
	};
}

async function signIn({ email, password }: Omit<CreateUserProps, 'nickname'>) {
	const user = await userRepository.User_findUnique(email);

	if (user && (await compare(password, user.password))) {
		return {
			accessToken: generateToken(email, user.nickname, 'access'),
			refreshToken: generateToken(email, user.nickname, 'refresh'),
		};
	} else if (!user) {
		throw new Error('이메일을 다시 확인해주세요');
	} else {
		throw new Error('비밀번호가 일치하지 않습니다');
	}
}

async function refreshToken(oldRefreshToken: string) {
	const decoded = decodeToken(oldRefreshToken, process.env.JWT_SECRET_REFRESH!);
	const isOk = verifyToken(decoded);

	if (isOk) {
		const accessToken = generateToken(
			decoded.email,
			decoded.nickname,
			'access',
		);

		return accessToken;
	} else {
		throw new Error('리프레시 토큰이 만료되었습니다');
	}
}

const authService = { signUp, signIn, refreshToken };

export default authService;
