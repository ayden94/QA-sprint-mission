import { Router, Request, Response } from 'express';
import userService from './user.service';
import { authChecker } from '../../middleware/authChecker';
import { requestChecker } from '../../middleware/requestChecker';
import { UpdateUser, UpdateUserPassword } from './user.structs';

const userRouters = Router();

userRouters.get('/me', authChecker, async (req: Request, res: Response) => {
	const { email } = req.cookies;

	const result = await userService.getUser(email);

	res.send(result);
});

userRouters.patch(
	'/me',
	authChecker,
	requestChecker('body', UpdateUser),
	async (req: Request, res: Response) => {
		const { email } = req.cookies;
		const patchUserProps = req.body;

		const result = await userService.updateUser(email, patchUserProps);

		res.send(result);
	},
);

userRouters.patch(
	'/me/password',
	authChecker,
	requestChecker('body', UpdateUserPassword),
	async (req: Request, res: Response) => {
		const { email } = req.cookies;
		const patchUserProps = req.body;

		const result = await userService.updateUserPassword(email, patchUserProps);

		res.send(result);
	},
);

userRouters.get(
	'/me/products',
	authChecker,
	async (req: Request, res: Response) => {
		const { email } = req.cookies;
		const result = await userService.getUserOwnedProduct(email);

		res.send(result);
	},
);

userRouters.get(
	'/me/favorites',
	authChecker,
	async (req: Request, res: Response) => {
		const { email } = req.cookies;
		const result = await userService.getUserFavoriteProduct(email);

		res.send(result);
	},
);

export default userRouters;

/**
 * @openapi
 * '/user/me':
 *   get:
 *     tags:
 *     - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   patch:
 *     tags:
 *     - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   $ref: '#/components/schemas/UrlType'
 *
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 * '/user/me/password':
 *   patch:
 *     tags:
 *     - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdatePassword'
 *
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 * '/user/me/products':
 *   get:
 *     tags:
 *     - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchPageQuery'
 *       - $ref: '#/components/schemas/SearchPageSizeQuery'
 *       - $ref: '#/components/schemas/SearchKeywordQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductAll'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 * '/user/me/favorites':
 *   get:
 *     tags:
 *     - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchPageQuery'
 *       - $ref: '#/components/schemas/SearchPageSizeQuery'
 *       - $ref: '#/components/schemas/SearchKeywordQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductAll'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */
