/*
 * @dirupt/adonis-lucid-filter
 *
 * Original work (c) Lookin Anton <alf@lookinlab.ru>
 * Fork (c) Dirupt
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'
import type { InputObject, LucidFilterContract } from '@dirupt/adonis-lucid-filter/types/filter'
import type {
  ModelQueryBuilderContract,
  QueryScope,
  QueryScopeCallback,
} from '@adonisjs/lucid/types/model'
import { resolveFilter } from './base_model.js'

export const Filterable = <Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) => {
  class FilterableModel extends superclass {
    declare static $filter: () => LucidFilterContract

    /**
     * Filter method of filterable model
     */
    static filter<
      T extends typeof FilterableModel,
      Filter extends LucidFilterContract = ReturnType<T['$filter']>,
    >(
      this: T,
      input: InputObject<InstanceType<Filter>>,
      filter?: Filter
    ): ModelQueryBuilderContract<T> {
      const FilterClass = resolveFilter(this, filter) as Filter
      return new FilterClass(this.query(), input).handle()
    }

    /**
     * Filtration scope of filterable model
     */
    static filtration = function (
      this: typeof FilterableModel,
      query,
      input,
      filter?: LucidFilterContract
    ) {
      const FilterClass = resolveFilter(this, filter)
      return new FilterClass(query, input).handle()
    } as QueryScope<Model, QueryScopeCallback>
  }
  return FilterableModel
}
