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
