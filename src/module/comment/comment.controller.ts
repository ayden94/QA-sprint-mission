import { Router } from 'express';
import { deleteComment, updateComment } from './comment.service';

const commentRoutes = Router();

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

commentRoutes.route('/:id').patch(updateComment).delete(deleteComment);

export default commentRoutes;
