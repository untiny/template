import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type User = {
    id: Generated<number>;
    /**
     * 创建时间
     */
    create_time: Generated<Timestamp>;
    /**
     * 更新时间
     */
    update_time: Timestamp;
    /**
     * 邮箱
     */
    email: string;
    /**
     * 用户名
     */
    name: string;
    /**
     * 头像
     */
    avatar: string | null;
    /**
     * 密码
     */
    password: string;
};
export type DB = {
    users: User;
};
