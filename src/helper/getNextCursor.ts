import commentRepository from '../module/comment/comment.repository';

export const getNextCursor = async <T extends { [key in 'id']: string }>(
	comments: Array<T>,
	takeNumber: number,
	id: string,
	where: 'boardId' | 'productId',
) => {
	let nextCursor = '';
	if (comments.length === takeNumber) {
		const nextComment = comments.pop();

		const isNextExist = await commentRepository.Comment_findMany(
			nextComment!.id,
			1,
			id,
			where,
		);

		if (isNextExist.length) {
			nextCursor = nextComment!.id;
		}
	}

	return nextCursor;
};
