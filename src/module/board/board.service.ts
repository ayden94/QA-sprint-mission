import { Request, Response } from 'express';
import { Board_delete } from './repository/Board_delete';
import { Board_create } from './repository/Board_create';
import { Board_update } from './repository/Board_update';
import { Board_findMany } from './repository/Board_findMany';
import { Board_findUnique } from './repository/Board_findUnique';
import { Board_likes } from './repository/Board_likes';
import { Board_dislikes } from './repository/Board_dislikes';
import { Comment_create_onBoard } from '../comment/repository/Comment_create';
import { Comment_findMany_onBoard } from '../comment/repository/Comment_findMany';
import { CreateBoardProps, PatchBoardProps } from './board.types';
import { isLiked } from '../../helper/isLiked';
import { User_findUnique } from '../user/repository/User_findUnique';

function getBoardList(req: Request, res: Response) {
	Board_findMany(req, res);
}

function getBoard(id: string) {
	return Board_findUnique(id);
}

function createBoard(createBoardProps: CreateBoardProps, email: string) {
	return Board_create(createBoardProps, email);
}

async function deleteBoard(id: string) {
	const board = await Board_findUnique(id);

	if (board?.writer.id === id) {
		await Board_delete(id);

		return true;
	} else {
		return false;
	}
}

async function updateBoard(patchBoardProps: PatchBoardProps, id: string) {
	const board = await Board_findUnique(id);

	if (board?.writer.id === id) {
		const updatedBoard = await Board_update(patchBoardProps, id);

		return updatedBoard;
	}
}

async function likeBoard(boardId: string, userEmail: string) {
	const user = await User_findUnique(userEmail);

	if (await isLiked(boardId, user)) {
		throw new Error('이미 좋아요를 누르셨어요');
	} else {
		const result = await Board_likes(boardId, userEmail);

		return result;
	}
}

async function dislikeBoard(boardId: string, userEmail: string) {
	const user = await User_findUnique(userEmail);

	if (!(await isLiked(boardId, user))) {
		throw new Error('이미 좋아요를 해제하셨어요');
	} else {
		const result = await Board_dislikes(boardId, userEmail);

		return result;
	}
}

function createComment(req: Request, res: Response) {
	Comment_create_onBoard(req, res);
}

export function getCommentList(req: Request, res: Response) {
	Comment_findMany_onBoard(req, res);
}

const boardService = {
	createBoard,
	createComment,
	deleteBoard,
	dislikeBoard,
	getBoard,
	getBoardList,
	getCommentList,
	likeBoard,
	updateBoard,
};

export default boardService;
