import isUUID from 'is-uuid';
import { define } from 'superstruct';

export const Uuid = define('Uuid', (value) => isUUID.v4(value as string));
