import { BoardOrderBy } from '../module/board/board.types';

export const boardOrderBy = (order: 'recent' | 'likes') => {
	let orderBy: BoardOrderBy;
	switch (order) {
		case 'recent':
			orderBy = { createdAt: 'desc' };
			break;
		case 'likes':
			orderBy = { likeCount: 'desc' };
			break;
		default:
			orderBy = { createdAt: 'desc' };
			break;
	}

	return orderBy;
};
