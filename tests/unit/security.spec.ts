/*
 * @dirupt/adonis-lucid-filter
 *
 * Original work (c) Lookin Anton <alf@lookinlab.ru>
 * Fork (c) Dirupt
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, ModelQueryBuilder } from '@adonisjs/lucid/orm'

import BaseModelFilter from '../../src/base_model.js'
import { Filterable } from '../../src/mixin.js'
import { extendModelQueryBuilder } from '../../src/bindings/model_query_builder.js'
import { createDatabase, createTables } from '../helpers.js'
import TestModelFilter from '../filters/test_model_filter.js'

test.group('Security and resilience hardening', (group) => {
  group.setup(() => extendModelQueryBuilder(ModelQueryBuilder))

  // -------------------------------------------------------------------------
  // 1. RESERVED_METHODS: lifecycle and internal helpers must never be
  //    invokable through user input.
  // -------------------------------------------------------------------------

  test('reserved internal methods are not callable from input', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()
    const filter = new TestModelFilter(User.query(), {})

    const reserved = [
      'constructor',
      'handle',
      'setup',
      'whitelistMethod',
      '$filterByInput',
      '$getFilterMethod',
      '$methodIsCallable',
      '$methodIsBlacklisted',
    ]

    for (const method of reserved) {
      assert.isFalse(
        filter.$methodIsCallable(method),
        `Reserved method "${method}" must not be callable from input`
      )
    }
  })

  test('input keys mapping to reserved methods are not dispatched', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    let internalCalls = 0
    class TrackingFilter extends BaseModelFilter {
      handle() {
        internalCalls++
        return super.handle()
      }

      $filterByInput() {
        internalCalls++
        return super.$filterByInput()
      }
    }

    const filter = new TrackingFilter(User.query(), {
      handle: 'attack',
      $filterByInput: 'attack',
      whitelistMethod: 'attack',
      setup: 'attack',
    })
    filter.handle()

    // Exactly one outer handle() + one lifecycle $filterByInput(). If reserved
    // methods were dispatched, this would either recurse or bump the counter.
    assert.strictEqual(internalCalls, 2)
  })

  // -------------------------------------------------------------------------
  // 2. Prototype pollution: for...in iterated inherited properties; the fix
  //    switches to Object.keys() which only walks own enumerable properties.
  // -------------------------------------------------------------------------

  test('$filterByInput does not dispatch on prototype-inherited properties', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    let nameCalls = 0
    class TrackingFilter extends BaseModelFilter {
      name(_value: string): void {
        nameCalls++
      }
    }

    const parent = { name: 'inherited' }
    const input = Object.create(parent) as Record<string, unknown>

    const filter = new TrackingFilter(User.query(), input)
    filter.handle()

    assert.strictEqual(nameCalls, 0)
  })

  test('removeEmptyInput ignores prototype-inherited properties', ({ assert }) => {
    const parent = { fromPrototype: 'attack' }
    const input = Object.create(parent) as Record<string, unknown>
    input.own = 'kept'

    const result = BaseModelFilter.removeEmptyInput(input) as Record<string, unknown>

    assert.deepEqual(Object.keys(result), ['own'])
    assert.notProperty(result, 'fromPrototype')
  })

  test('Object.prototype pollution does not leak into filter dispatch', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    let pollutedCalls = 0
    class TrackingFilter extends BaseModelFilter {
      polluted(_value: string): void {
        pollutedCalls++
      }
    }

    // Mutate Object.prototype with an enumerable property. Always restore in
    // finally so a failed assertion never leaks into the rest of the suite.
    Object.defineProperty(Object.prototype, 'polluted', {
      value: 'attack',
      enumerable: true,
      configurable: true,
      writable: true,
    })
    try {
      const filter = new TrackingFilter(User.query(), {})
      filter.handle()
      assert.strictEqual(pollutedCalls, 0)
    } finally {
      delete (Object.prototype as Record<string, unknown>).polluted
    }
  })

  // -------------------------------------------------------------------------
  // 3. $filter() guard: missing static $filter must produce an actionable
  //    error, not an opaque "Filter is not a constructor" TypeError.
  // -------------------------------------------------------------------------

  test('Model.filter() throws actionable error when $filter is missing (mixin path)', async ({
    assert,
  }) => {
    const db = await createDatabase()
    await createTables(db)

    class UnconfiguredModel extends compose(BaseModel, Filterable) {}
    UnconfiguredModel.boot()

    assert.throws(
      () => UnconfiguredModel.filter({}),
      /\[@dirupt\/adonis-lucid-filter\][\s\S]*UnconfiguredModel/
    )
  })

  test('Model.query().filter() throws actionable error when $filter is missing (macro path)', async ({
    assert,
  }) => {
    const db = await createDatabase()
    await createTables(db)

    class UnconfiguredModel extends BaseModel {}
    UnconfiguredModel.boot()

    // The augmented `filter` type resolves to `never` for non-Filterable
    // models (by design). The macro still exists at runtime; cast to bypass
    // the static guard so we can verify the runtime error path.
    const query = UnconfiguredModel.query() as unknown as { filter: (input: object) => unknown }
    assert.throws(
      () => query.filter({}),
      /\[@dirupt\/adonis-lucid-filter\][\s\S]*UnconfiguredModel/
    )
  })

  // -------------------------------------------------------------------------
  // 4. Non-object input: null, arrays, primitives must be neutralized to {}
  //    so no filter method is ever invoked with attacker-controlled values.
  // -------------------------------------------------------------------------

  test('non-object input is neutralized to an empty object', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()
    const query = User.query()

    const nullFilter = new TestModelFilter(query, null as unknown as object)
    assert.deepEqual(nullFilter.$input, {})

    const arrayFilter = new TestModelFilter(query, [] as unknown as object)
    assert.deepEqual(arrayFilter.$input, {})

    const stringFilter = new TestModelFilter(query, 'attack' as unknown as object)
    assert.deepEqual(stringFilter.$input, {})

    const numberFilter = new TestModelFilter(query, 42 as unknown as object)
    assert.deepEqual(numberFilter.$input, {})
  })

  test('non-object input does not invoke any filter method', ({ assert }) => {
    class User extends BaseModel {}
    User.boot()

    let calls = 0
    class TrackingFilter extends BaseModelFilter {
      email(_value: string): void {
        calls++
      }

      username(_value: string): void {
        calls++
      }
    }

    const filter = new TrackingFilter(User.query(), null as unknown as object)
    filter.handle()
    assert.strictEqual(calls, 0)
  })
})
