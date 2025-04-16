type ReplaceDashWithUnderscore<S extends string> =
  S extends `${infer Prefix}-${infer Suffix}`
    ? `${Prefix}_${ReplaceDashWithUnderscore<Suffix>}`
    : S

export type UnionToEnum<T extends string> = {
  [K in T as Uppercase<ReplaceDashWithUnderscore<K>>]: K;
}
