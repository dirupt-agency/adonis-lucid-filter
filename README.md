# @dirupt/adonis-lucid-filter

> Fork of [adonis-lucid-filter](https://github.com/lookinlab/adonis-lucid-filter) with AdonisJS v7 support

[![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

This addon adds the functionality to filter Lucid Models.

> Inspired by [EloquentFilter](https://github.com/Tucker-Eric/EloquentFilter)
> Original work by [Lookin Anton](https://github.com/lookinlab)

## Credits

This package is a fork of [`adonis-lucid-filter`](https://github.com/lookinlab/adonis-lucid-filter) by [LookinLab](https://github.com/lookinlab), updated for AdonisJS v7 compatibility. All credit for the original implementation goes to the original author.

## Versions

| @dirupt/adonis-lucid-filter | @adonisjs/lucid | AdonisJS |
|-----------------------------|-----------------|----------|
| ^6.\*.\*                    | ^22.\*.\*       | v7       |

For AdonisJS v6, use the original package: [`adonis-lucid-filter@^5`](https://github.com/lookinlab/adonis-lucid-filter)

## Introduction

Example, we want to return a list of users filtered by multiple parameters. When we navigate to:

`/users?name=Tony&lastName=&companyId=2&industry=5`

`request.all()` or `request.qs()` will return:

```json
{
  "name": "Tony",
  "lastName": "",
  "companyId": 2,
  "industry": 5
}
```

To filter by all those parameters we would need to do something like:

```ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request }: HttpContext): Promise<User[]> {
    const { companyId, lastName, name, industry } = request.qs()

    const query = User.query().where('company_id', +companyId)

    if (lastName) {
      query.where('last_name', 'LIKE', `%${lastName}%`)
    }
    if (name) {
      query.where(function () {
        this.where('first_name', 'LIKE', `%${name}%`)
          .orWhere('last_name', 'LIKE', `%${name}%`)
      })
    }
    return query.exec()
  }
}
```

To filter that same input with Lucid Filters:

```ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request }: HttpContext): Promise<User[]> {
    return User.filter(request.qs()).exec()
  }
}
```

## Installation

```bash
pnpm add @dirupt/adonis-lucid-filter
```

After install call `configure`:

```bash
node ace configure @dirupt/adonis-lucid-filter
```

## Usage

Make sure to register the provider and commands inside `adonisrc.ts` file.

```ts
providers: [
  // ...
  () => import('@dirupt/adonis-lucid-filter/provider'),
],
commands: [
  // ...
  () => import('@dirupt/adonis-lucid-filter/commands')
]
```

### Generating The Filter

You can create a model filter with the following ace command:

```bash
node ace make:filter user
```

Where `user` is the Lucid Model you are creating the filter for. This will create `app/models/filters/user_filter.ts`

### Defining The Filter Logic

Define the filter logic based on the camel cased input key passed to the `filter()` method.

- Empty strings are ignored
- `setup()` will be called regardless of input
- `_id` is dropped from the end of the input to define the method so filtering `user_id` would use the `user()` method
- Input without a corresponding filter method are ignored
- The value of the key is injected into the method
- All values are accessible through the `this.$input` property
- All QueryBuilder methods are accessible in `this.$query` object in the model filter class.

To define methods for the following input:

```json
{
  "companyId": 5,
  "name": "Tony",
  "mobilePhone": "888555"
}
```

You would use the following methods:

```ts
import { BaseModelFilter } from '@dirupt/adonis-lucid-filter'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import User from '#models/user'

export default class UserFilter extends BaseModelFilter {
  declare $query: ModelQueryBuilderContract<typeof User>

  static blacklist: string[] = ['secretMethod']

  company(id: number) {
    this.$query.where('company_id', id)
  }

  name(name: string) {
    this.$query.where((builder) => {
      builder
        .where('first_name', 'LIKE', `%${name}%`)
        .orWhere('last_name', 'LIKE', `%${name}%`)
    })
  }

  mobilePhone(phone: string) {
    this.$query.where('mobile_phone', 'LIKE', `${phone}%`)
  }

  secretMethod(secretParameter: any) {
    this.$query.where('some_column', true)
  }
}
```

#### Blacklist

Any methods defined in the `blacklist` array will not be called by the filter. Those methods are normally used for internal filter logic.

The `whitelistMethod()` method can be used to dynamically whitelist methods.

Example:
```ts
setup($query) {
  this.whitelistMethod('secretMethod')
  this.$query.where('is_admin', true)
}
```

> `setup()` may not be async

#### Static properties

```ts
export default class UserFilter extends BaseModelFilter {
  // Blacklisted methods
  static blacklist: string[] = []

  // Dropped `_id` from the end of the input
  static dropId: boolean = true

  // Convert input keys to camelCase method names
  static camelCase: boolean = true
}
```

### Applying The Filter To A Model

```ts
import UserFilter from '#models/filters/user_filter'
import { compose } from '@adonisjs/core/helpers'
import { Filterable } from '@dirupt/adonis-lucid-filter'

export default class User extends compose(BaseModel, Filterable) {
  static $filter = () => UserFilter

  // ...columns and props
}
```

This gives you access to the `filter()` method that accepts an object of input:

```ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  async index({ request }: HttpContext): Promise<User[]> {
    return User.filter(request.qs()).exec()
  }

  // or with paginate method

  async index({ request }: HttpContext): Promise<ModelPaginatorContract<User>> {
    const { page = 1, ...input } = request.qs()
    return User.filter(input).paginate(page, 15)
  }
}
```

### Dynamic Filters

You can define the filter dynamically by passing the filter to use as the second parameter of the filter() method.

```ts
import type { HttpContext } from '@adonisjs/core/http'
import AdminFilter from '#models/filters/admin_filter'
import UserFilter from '#models/filters/user_filter'

export default class UsersController {
  async index({ request, auth }: HttpContext): Promise<User[]> {
    const filter = auth.user.isAdmin() ? AdminFilter : UserFilter
    return User.filter(request.qs(), filter).exec()
  }
}
```

### Filtering relations

For filtering relations of model you may use `.query().filter()` or scope `filtration`:

```ts
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UserPostsController {
  async index({ params, request }: HttpContext): Promise<Post[]> {
    const user: User = await User.findOrFail(params.user_id)

    return user.related('posts').query()
      .apply(scopes => scopes.filtration(request.qs()))
      .exec()

    // or

    return user.related('posts').query().filter(request.qs()).exec()
  }
}
```

> The relation model must have the `Filterable` mixin and `$filter` must be defined

## License

[MIT](./LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/@dirupt/adonis-lucid-filter?logo=npm&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@dirupt/adonis-lucid-filter

[license-image]: https://img.shields.io/npm/l/@dirupt/adonis-lucid-filter?style=for-the-badge&color=blueviolet
[license-url]: https://github.com/dirupt-agency/adonis-lucid-filter/blob/master/LICENSE.md

[typescript-image]: https://img.shields.io/npm/types/@dirupt/adonis-lucid-filter?color=294E80&label=%20&logo=typescript&style=for-the-badge
[typescript-url]: https://github.com/dirupt
