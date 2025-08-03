import Snowflakify from 'snowflakify'

const SNOWFLAKE_EPOCH = 1716786840000 // 2024-05-27 13:14:00
const Snowflake = new Snowflakify({
  epoch: SNOWFLAKE_EPOCH,
})

export function generateSnowflakeId(): bigint {
  return Snowflake.nextId()
}
