import { Router, Request, Response } from 'express';
import commentService from './comment.service';
import { authChecker } from '../../middleware/authChecker';
import { requestChecker } from '../../middleware/requestChecker';
import { Uuid } from '../../helper/Structs';
import { PatchComment } from './comment.struct';

const commentRoutes = Router();

commentRoutes.patch(
	'/:id',
	authChecker,
	requestChecker('params', Uuid),
	requestChecker('body', PatchComment),
	async (req: Request, res: Response) => {
		const patchCommentProps = req.body;
		const { id } = req.params;
		const { email } = req.cookies;

		const result = await commentService.updateComment(
			patchCommentProps,
			id,
			email,
		);

		res.send(result);
	},
);

commentRoutes.delete(
	'/:id',
	authChecker,
	requestChecker('params', Uuid),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		await commentService.deleteComment(id);

		res.sendStatus(204);
	},
);

export default commentRoutes;

/**
 * @openapi
 * '/comments/{commentId}':
 *   patch:
 *     tags:
 *     - comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchCommentCommentIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentBaseResponse'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 *   delete:
 *     tags:
 *     - comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchCommentCommentIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                  $ref: '#/components/schemas/Uuid'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */
