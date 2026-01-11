/**
 * `Record<K, V>` 型のオブジェクトのキーの配列を取得します
 * @param object `Record<K, V>` 型のオブジェクト
 * @returns `keyof T` 型の配列
 * @example
 * toKeys({ a: 1, b: 2, c: 3 });
 * // => ("a" | "b" | "c")[]
 */
export function toKeys<T extends Record<PropertyKey, any>>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

/**
 * `keys` を元に `Record<K, V>` 型のオブジェクトを生成します
 * @param keys `string | number | symbol` のキーの配列
 * @param getValue キーから値を取得する関数
 * @returns `Record<K, V>` 型のオブジェクト
 * @example
 * createRecordFromKeys(["a", "b", "c"], key => key.length);
 * // => Record<"a" | "b" | "c", number>
 */
export function createRecordFromKeys<const K extends readonly PropertyKey[], V>(
  keys: K,
  getValue: (key: K[number]) => V
): Record<K[number], V> {
  return Object.fromEntries(
    keys.map(key => [key, getValue(key)])
  ) as Record<K[number], V>;
}
