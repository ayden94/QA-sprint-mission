import { Router } from 'express';
import {
	getUser,
	getUserFavoriteProduct,
	getUserOwnedProduct,
	updateUser,
	updateUserPassword,
} from './user.service';

const userRouters = Router();

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
 */

userRouters.route('/me').get(getUser).patch(updateUser);

/**
 * @openapi
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
 */

userRouters.route('/me/password').patch(updateUserPassword);

/**
 * @openapi
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

userRouters.route('/me/products').get(getUserOwnedProduct);
userRouters.route('/me/favorites').get(getUserFavoriteProduct);

export default userRouters;
