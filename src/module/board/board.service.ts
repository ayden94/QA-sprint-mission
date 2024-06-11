import { Request, Response } from 'express';

import { Comment_create_onBoard } from '../comment/repository/Comment_create';
import { Comment_findMany_onBoard } from '../comment/repository/Comment_findMany';
import {
	CreateBoardProps,
	FindBoardsProps,
	PatchBoardProps,
} from './board.types';
import { isLiked } from '../../helper/isLiked';
import { User_findUnique } from '../user/repository/User_findUnique';
import boardRepository from './board.repository';
import { boardOrderBy } from '../../helper/boardOrderBy';

async function getBoardList(findBoardsProps: FindBoardsProps) {
	const orderBy = boardOrderBy(findBoardsProps.order);

	const boards = await boardRepository.Board_findMany(findBoardsProps, orderBy);

	return boards;
}

function getBoard(id: string) {
	return boardRepository.Board_findUnique(id);
}

function createBoard(createBoardProps: CreateBoardProps, email: string) {
	return boardRepository.Board_create(createBoardProps, email);
}

async function deleteBoard(id: string) {
	const board = await boardRepository.Board_findUnique(id);

	if (board?.writer.id === id) {
		await boardRepository.Board_delete(id);

		return true;
	} else {
		return false;
	}
}

async function updateBoard(patchBoardProps: PatchBoardProps, id: string) {
	const board = await boardRepository.Board_findUnique(id);

	if (board?.writer.id === id) {
		const updatedBoard = await boardRepository.Board_update(
			patchBoardProps,
			id,
		);

		return updatedBoard;
	}
}

async function likeBoard(boardId: string, userEmail: string) {
	const user = await User_findUnique(userEmail);

	if (await isLiked(boardId, user)) {
		throw new Error('이미 좋아요를 누르셨어요');
	} else {
		const result = await boardRepository.Board_likes(boardId, userEmail);

		return result;
	}
}

async function dislikeBoard(boardId: string, userEmail: string) {
	const user = await User_findUnique(userEmail);

	if (!(await isLiked(boardId, user))) {
		throw new Error('이미 좋아요를 해제하셨어요');
	} else {
		const result = await boardRepository.Board_dislikes(boardId, userEmail);

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
