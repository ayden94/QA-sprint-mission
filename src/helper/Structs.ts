import isUUID from 'is-uuid';
import { define, nullable, object, string } from 'superstruct';

export const Uuid = define('Uuid', (value) => isUUID.v4(value as string));

export const FindMany = object({
	offset: nullable(string()),
	limit: nullable(string()),
	order: nullable(string()),
	search: nullable(string()),
});
