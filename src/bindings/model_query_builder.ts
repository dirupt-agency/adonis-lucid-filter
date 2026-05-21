/*
 * @dirupt/adonis-lucid-filter
 *
 * Original work (c) Lookin Anton <alf@lookinlab.ru>
 * Fork (c) Dirupt
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import type { LucidModel, LucidRow, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { LucidFilterContract } from '@dirupt/adonis-lucid-filter/types/filter'
import { resolveFilter } from '../base_model.js'

/**
 * Define filter method to ModelQueryBuilder
 */
export function extendModelQueryBuilder(builder: any) {
  builder.macro(
    'filter',
    function (this: ModelQueryBuilder, input: any, filter?: LucidFilterContract) {
      const FilterClass = resolveFilter(this.model as any, filter)
      const query = this as unknown as ModelQueryBuilderContract<LucidModel, LucidRow>
      return new FilterClass(query, input).handle()
    }
  )
}
