import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type User = {
    id: Generated<number>;
    create_time: Generated<Timestamp>;
    update_time: Timestamp;
    email: string;
    name: string | null;
};
export type DB = {
    users: User;
};
