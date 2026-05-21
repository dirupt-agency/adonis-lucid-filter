/*
 * @dirupt/adonis-lucid-filter
 *
 * Original work (c) Lookin Anton <alf@lookinlab.ru>
 * Fork (c) Dirupt
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import camelCase from 'lodash/camelCase.js'
import type { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { LucidFilter, LucidFilterContract } from './types/filter.js'

const DROP_ID_RE = /^(.*)(_id|Id)$/

/**
 * Lifecycle and internal helpers that must never be invoked through user input.
 * Without this guard, an input key like `handle` or `$filterByInput` would
 * dispatch to the lifecycle method itself with the raw user value.
 */
const RESERVED_METHODS = new Set<string>([
  'constructor',
  'handle',
  'setup',
  'whitelistMethod',
  '$filterByInput',
  '$getFilterMethod',
  '$methodIsCallable',
  '$methodIsBlacklisted',
])

/**
 * Resolve a filter class from either an explicit override or the model's
 * static `$filter()` factory, with an actionable error if neither is defined.
 */
export function resolveFilter(
  model: { name?: string; $filter?: () => LucidFilterContract },
  explicit?: LucidFilterContract
): LucidFilterContract {
  const Filter = explicit ?? model.$filter?.()
  if (typeof Filter !== 'function') {
    throw new Error(
      `[@dirupt/adonis-lucid-filter] $filter() is not defined on model "${model.name ?? 'unknown'}". Apply the Filterable mixin and assign a static $filter.`
    )
  }
  return Filter
}

/**
 * Class to filtering AdonisJS Lucid ORM
 *
 * @class BaseModelFilter
 * @constructor
 */
export class BaseModelFilter implements LucidFilter {
  declare ['constructor']: typeof BaseModelFilter
  declare $blacklist: string[]

  static blacklist: string[] = []
  static dropId: boolean = true
  static camelCase: boolean = true

  setup?($query: ModelQueryBuilderContract<LucidModel, LucidRow>): void

  constructor(
    public $query: ModelQueryBuilderContract<LucidModel, LucidRow>,
    public $input: object
  ) {
    const safeInput =
      $input !== null && typeof $input === 'object' && !Array.isArray($input) ? $input : {}
    this.$input = BaseModelFilter.removeEmptyInput(safeInput)
    this.$blacklist = [...this.constructor.blacklist]
  }

  handle(): ModelQueryBuilderContract<LucidModel, LucidRow> {
    if (typeof this.setup === 'function') {
      this.setup(this.$query)
    }
    this.$filterByInput()

    return this.$query
  }

  whitelistMethod(method: string): boolean {
    const index = this.$blacklist.indexOf(method)

    const isBlacklisted = index !== -1
    if (isBlacklisted) this.$blacklist.splice(index, 1)

    return isBlacklisted
  }

  $filterByInput(): void {
    const input = this.$input as Record<string, unknown>
    for (const key of Object.keys(input)) {
      const method = this.$getFilterMethod(key)
      const value = input[key]

      if (this.$methodIsCallable(method)) {
        ;(this[method as keyof this] as (v: unknown) => unknown)(value)
      }
    }
  }

  $getFilterMethod(key: string): string {
    const methodName = this.constructor.dropId ? key.replace(DROP_ID_RE, '$1') : key
    return this.constructor.camelCase ? camelCase(methodName) : methodName
  }

  static removeEmptyInput(input: object): object {
    const filteredInput: Record<string, unknown> = {}
    const source = input as Record<string, unknown>

    for (const key of Object.keys(source)) {
      const value = source[key]
      if (value !== '' && value !== null && value !== undefined) {
        filteredInput[key] = value
      }
    }
    return filteredInput
  }

  $methodIsCallable(method: string): boolean {
    if (RESERVED_METHODS.has(method)) return false
    const fn = this[method as keyof this]
    return typeof fn === 'function' && !this.$methodIsBlacklisted(method)
  }

  $methodIsBlacklisted(method: string): boolean {
    return this.$blacklist.includes(method)
  }
}
export default BaseModelFilter
