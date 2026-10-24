import pg from 'pg'

// Released idle clients can report connection loss at the pool level. pg-pool
// already removes that client before emitting the event; preserve its normal
// reconnect-on-demand behavior and keep credentials/query details out of logs.
export class SafePool extends pg.Pool {
  constructor(options) {
    super(options)
    this.on('error', () => {
      console.error('[database] An idle Postgres connection was discarded by the pool.')
    })
  }
}

// Payload supports injecting the pg driver. Inherit without evaluating pg.native
// (an enumerable lazy getter); replace only Pool, never its checkout methods.
export const payloadPg = Object.create(pg, {
  Pool: { value: SafePool, enumerable: true },
})
