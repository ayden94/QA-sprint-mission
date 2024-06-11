import { getNextCursor } from '../../helper/getNextCursor';
import commentRepository from './comment.repository';
import { GetCommentProps, PatchCommentProps } from './comment.types';

async function updateComment(
	patchCommentProps: PatchCommentProps,
	commentId: string,
	userEmail: string,
) {
	const comment = await commentRepository.Comment_findUnique(commentId);

	if (comment?.writerId.email === userEmail) {
		const updatedComment = await commentRepository.Comment_update(
			patchCommentProps,
			commentId,
		);

		return updatedComment;
	} else {
		throw new Error('작성자만이 댓글을 수정할 수 있습니다');
	}
}

async function getCommentList(
	getCommentProps: GetCommentProps,
	id: string,
	where: 'boardId' | 'productId',
) {
	const { limit, cursor } = getCommentProps;

	const takeNumber = limit ? parseInt(limit as string, 10) : 10;

	const comments = await commentRepository.Comment_findMany(
		cursor,
		takeNumber,
		id,
		where,
	);

	const nextCursor = await getNextCursor(comments, takeNumber, id, where);

	return {
		nextCursor,
		list: comments,
	};
}

async function deleteComment(id: string) {
	await commentRepository.Comment_delete(id);
}

const commentService = { updateComment, deleteComment, getCommentList };

export default commentService;
