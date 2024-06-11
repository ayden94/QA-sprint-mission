import { Router } from 'express';
import { refreshToken, signIn, signOut, signUp } from './auth.service';

const authRoutes = Router();

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

authRoutes.route('/signUp').post(signUp);
authRoutes.route('/signIn').post(signIn);
authRoutes.route('/signOut').delete(signOut);
authRoutes.route('/refresh-token').post(refreshToken);

export default authRoutes;
