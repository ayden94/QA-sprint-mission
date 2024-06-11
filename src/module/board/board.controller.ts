import { Router, Request, Response } from 'express';
import boardService from './board.service';
import { authChecker } from '../../middleware/authChecker';
import { requestChecker } from '../../middleware/requestChecker';
import { CreateBoard, PatchBoard } from './board.structs';
import { Uuid } from '../../helper/Structs';

const boardRoutes = Router();

boardRoutes.get('/', boardService.getBoardList);

boardRoutes.post(
	'/',
	authChecker,
	requestChecker('body', CreateBoard),
	async (req: Request, res: Response) => {
		const createBoardProps = req.body;
		const { email } = req.cookies;

		const result = await boardService.createBoard(createBoardProps, email);

		res.send(result);
	},
);

boardRoutes.get(
	'/:id',
	requestChecker('params', Uuid),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const result = await boardService.getBoard(id);

		res.send(result);
	},
);

boardRoutes.delete(
	'/:id',
	authChecker,
	requestChecker('params', Uuid),
	async (req: Request, res: Response) => {
		const { id } = req.params;

		const result = await boardService.deleteBoard(id);

		if (result) {
			// 삭제가 잘 됐을 때
			res.sendStatus(204);
		} else {
			// 삭제할 권한이 없을 때
			res
				.status(403)
				.send({ error: 'You are not authorized to delete this Article' });
		}
	},
);

boardRoutes.patch(
	'/:id',
	authChecker,
	requestChecker('body', PatchBoard),
	requestChecker('params', Uuid),
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const patchBoardProps = req.body;

		const result = boardService.updateBoard(patchBoardProps, id);

		if (result) {
			res.send(result);
		} else {
			res
				.status(403)
				.send({ error: 'You are not authorized to update this Article' });
		}
	},
);

boardRoutes.get('/:id/comments', boardService.getCommentList);
boardRoutes.post('/:id/comments', authChecker, boardService.createComment);

boardRoutes.post(
	'/:id/comments',
	authChecker,
	requestChecker('params', Uuid),
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { email } = req.cookies;

		const result = await boardService.likeBoard(id, email);

		res.send(result);
	},
);

boardRoutes.delete(
	'/:id/comments',
	authChecker,
	requestChecker('params', Uuid),
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { email } = req.cookies;

		const result = await boardService.dislikeBoard(id, email);

		res.send(result);
	},
);

export default boardRoutes;

/**
 * @openapi
 * '/boards':
 *   post:
 *     tags:
 *     - boards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BoardBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardBaseResponse'
 *   get:
 *     tags:
 *     - boards
 *     description: 상품 목록 조회
 *     parameters:
 *       - $ref: '#/components/schemas/SearchPageQuery'
 *       - $ref: '#/components/schemas/SearchPageSizeQuery'
 *       - $ref: '#/components/schemas/SearchBoardsOrderByQuery'
 *       - $ref: '#/components/schemas/SearchKeywordQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardAll'
 *
 * '/boards/{boardId}':
 *   get:
 *     tags:
 *     - boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardBaseResponse'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   patch:
 *     tags:
 *     - boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardSome'
 *               isFavorites:
 *                 type: boolean
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
 *   delete:
 *     tags:
 *     - boards
 *     security:
 *       - bearerAuth: []
 *     description: 상품 삭제
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
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
 * '/boards/{boardId}/comments':
 *   post:
 *     tags:
 *     - comment
 *     security:
 *       - bearerAuth: []
 *     description: 게시글의 댓글 작성
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentBaseRequest'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentBaseResponse'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *   get:
 *     tags:
 *     - comment
 *     description: 게시글의 댓글 목록 조회
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *       - $ref: '#/components/schemas/SearchCommentsLimitQuery'
 *       - $ref: '#/components/schemas/SearchCommentsCursorQuery'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchCommentAll'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 * '/boards/{boardId}/like':
 *   post:
 *     tags:
 *     - boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 *   delete:
 *     tags:
 *     - boards
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/schemas/SearchBoardBoardIdPath'
 *     responses:
 *       200:
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBoardSome'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *
 */
