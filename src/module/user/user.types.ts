export type CreateUserProps = {
	email: string;
	password: string;
	nickname: string;
};

export type PatchUserProps = Omit<Partial<CreateUserProps>, 'password'>;

export type PatchUserPasswordProps = Pick<CreateUserProps, 'password'>;
