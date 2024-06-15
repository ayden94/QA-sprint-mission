import { Request, Response } from 'express';
import { Comment_create_onBoard } from '../comment/repository/Comment_create';
import {
	CreateBoardProps,
	FindBoardsProps,
	PatchBoardProps,
} from './board.types';
import { isLiked } from '../../helper/isLiked';
import { boardOrderBy } from '../../helper/boardOrderBy';
import userRepository from '../user/user.repository';
import { BoardRepository } from './board.repository';

export class BoardService {
	constructor(private BoardRepository: BoardRepository) {}

	async getBoardList(findBoardsProps: FindBoardsProps) {
		const orderBy = boardOrderBy(findBoardsProps.order);

		const boards = await this.BoardRepository.Board_findMany(
			findBoardsProps,
			orderBy,
		);

		return boards;
	}

	getBoard(id: string) {
		return this.BoardRepository.Board_findUnique(id);
	}

	createBoard(createBoardProps: CreateBoardProps, email: string) {
		return this.BoardRepository.Board_create(createBoardProps, email);
	}

	async deleteBoard(id: string) {
		const board = await this.BoardRepository.Board_findUnique(id);

		if (board?.writer.id === id) {
			await this.BoardRepository.Board_delete(id);

			return true;
		} else {
			return false;
		}
	}

	async updateBoard(patchBoardProps: PatchBoardProps, id: string) {
		const board = await this.BoardRepository.Board_findUnique(id);

		if (board?.writer.id === id) {
			const updatedBoard = await this.BoardRepository.Board_update(
				patchBoardProps,
				id,
			);

			return updatedBoard;
		}
	}

	async likeBoard(boardId: string, userEmail: string) {
		const user = await userRepository.User_findUnique(userEmail);

		if (await isLiked(boardId, user)) {
			throw new Error('이미 좋아요를 누르셨어요');
		} else {
			const board = await this.BoardRepository.Board_findUnique(boardId);

			if (board?.writer.id === user?.id) {
				throw new Error('자신의 댓글에는 좋아요를 누를 수 없습니다');
			}

			const result = await this.BoardRepository.Board_likes(boardId, userEmail);

			return result;
		}
	}

	async dislikeBoard(boardId: string, userEmail: string) {
		const user = await userRepository.User_findUnique(userEmail);

		if (!(await isLiked(boardId, user))) {
			throw new Error('이미 좋아요를 해제하셨어요');
		} else {
			const result = await this.BoardRepository.Board_dislikes(
				boardId,
				userEmail,
			);

			return result;
		}
	}

	async createComment(req: Request, res: Response) {
		Comment_create_onBoard(req, res);
	}
}
