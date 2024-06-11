// export type CreateBoardProps = {
// 	name: string;
// 	description: string;
// 	price: number;
// 	tags: Array<string>;
// 	images: Array<string>;
// };

export type CreateBoardProps = {
	title: string;
	content: string;
	imageUrl: Array<string>;
};

export type PatchBoardProps = Partial<CreateBoardProps>;

export type FindBoardsProps = {
	offset: string;
	limit: string;
	order: 'recent' | 'likes';
	search: string;
};

export type BoardOrderBy =
	| { [key in 'createdAt']: 'desc' | 'asc' }
	| { [key in 'likeCount']: 'desc' | 'asc' };
