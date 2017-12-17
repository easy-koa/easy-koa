<h1 align="center">Koap.js</h1>

A lightweight dependency injection container, also an enterprise solution for node.js project, and written in typescript.

## Installation

```bash
$ npm install koap.js --save
```

## Features

- ✔︎ Startup process
- ✔︎ Dependency injection
- ✔︎ Components system
- ✔︎ Perfect web architecture
- ✔︎ Midway solution
- ✔︎ Written in typescript

## Basics

### Abort application

#### Core

Koap.js provides a lightweight dependency injection container with strict process control.

If any one component failed to load, Application will also fail to start.  This measure can expose the problem as much as possible, and reducing the impact on the production environment.

And the components will achieve specific functions.

#### Components

Just mentioned, Components are units that implement specific functions.

You can indicate the dependencies of a component via the `@InjectPlugin` annotation. Koap.js will help you to manage component dependencies. If a component's dependencies are not initialized, Koap.js will give priority to initializing that component. But remember, do not appear circular dependencies.

Koap.js has some built-in components, including `Cron`, `Logger`, `Monitor`, `Server`.

You can also develop the components you need, just follow our rules - each component will inherit from a base class - `Component`.

[See more information](./component.md)

### Abort Web Layered

You can indicate the dependencies of in the following three via the `@InjectPlugin` and `@InjectService` annotation.

#### Interceptors

Request will enter the interceptor logic before entering others.

When configuring an interceptor, you need to specify the path that the interceptor matches and which interceptor to execute.

The interceptor needs the `preHandle` and `postHandle` methods. `preHandle` generally used to determine whether the request continues, or to write the required fields to the context. `postHandle` generally used to respond to changes in information, such as writing cross-domain head.

#### Controllers

The Controller determines the existence of the final response to the request. Of course, you need to use some annotations to indicate the scope of the request that the controller matches, such as `@RequestMapping` or `@Get` and so on. The controller will generally only do some judgment of the request parameters, the specific implementation will call the service to complete.

#### Services

Service is the role used to fulfill a specific requirement. Including the package some simple calculations, or asynchronous method call.

#### Middlewares

Koap.js is based on koa, so it supports all koa middleware. But we want you to use async function whenever possible. This is also koa's hope.

## Docs

- [Application](./docs/components.md)
- [Components](./docs/components.md)
- [Contribute](./docs/contribute.md)

## Examples

See [examples](./examples).

## License

[MIT](./LICENSE)