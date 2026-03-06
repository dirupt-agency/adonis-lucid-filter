/*
 * @dirupt/adonis-lucid-filter
 *
 * Original work (c) Lookin Anton <alf@lookinlab.ru>
 * Fork (c) Dirupt
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type Configure from '@adonisjs/core/commands/configure'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@dirupt/adonis-lucid-filter/provider')
    rcFile.addCommand('@dirupt/adonis-lucid-filter/commands')
  })
}
