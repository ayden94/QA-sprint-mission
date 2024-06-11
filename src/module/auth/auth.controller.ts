import { Router, Request, Response } from 'express';
import authService from './auth.service';
import { requestChecker } from '../../middleware/requestChecker';
import { RefreshToken, SignIn, SignUp } from './auth.structs';

const authRoutes = Router();

authRoutes.post(
	'/signup',
	requestChecker('body', SignUp),
	async (req: Request, res: Response) => {
		const { email, password, nickname } = req.body;

		const result = await authService.signUp({ email, password, nickname });

		res.status(201).send(result);
	},
);

authRoutes.post(
	'/signIn',
	requestChecker('body', SignIn),
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const result = await authService.signIn({ email, password });

		res.send(result);
	},
);

authRoutes.post(
	'/refresh-token',
	requestChecker('body', RefreshToken),
	async (req: Request, res: Response) => {
		const { refreshToken } = req.body;

		const result = await authService.refreshToken(refreshToken);

		res.send(result);
	},
);

export default authRoutes;

/**
 * @openapi
 * '/auth/signUp':
 *   post:
 *     tags:
 *     - Auth
 *     description: 회원가입
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequestBody'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 * '/auth/signIn':
 *   post:
 *     tags:
 *     - Auth
 *     description: 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequestBody'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *
 * '/auth/refresh-token':
 *   post:
 *     tags:
 *     - Auth
 *     description: 로그인
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */
