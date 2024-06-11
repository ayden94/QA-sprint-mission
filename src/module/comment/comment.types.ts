export type CreateCommentProps = {
	content: string;
};

export type GetCommentProps = {
	cursor: string;
	limit: string;
};

export type PatchCommentProps = CreateCommentProps;
