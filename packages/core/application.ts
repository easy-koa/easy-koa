import { Registry } from './registry'
import { Component } from './component'
import { loggerFactory } from '@one-koa/shared'

export class Application {
    readonly logger: any = loggerFactory.getLogger('one-koa')
    readonly registry: Registry = new Registry()
    public use(component: Component): void {
        if (!(Component.isInstance(component))) {
            return
        }
        component.afterCreated()

        this.registry.registerComponnet(component)
    }

    public async start(): Promise<any> {
        const components: any[] = Array.from(this.registry.components)
        const logger: any = this.logger

        let index: number = 0
        const total: number = components.length

        for (const [name, component] of components) {
            index++
            try {
                if (component.$options.enable) {
                    this.registry.install(component)

                    if (component.init) {
                        await component.init()
                    }
                }
                logger.info(`Componnet started successfully - ${name}`)
            } catch (e) {
                logger.error(`Started ${name} failed, because '${e}'`)
                return Promise.reject(e)
            }
        }

        logger.info('Application started successfully')
    }

    async ready(): Promise<void> {
        const components: any[] = Array.from(this.registry.components)

        for (const [, component] of components) {
            await component.ready()
        }
    }

    public async stop(error?: any): Promise<void> {
        const components: any[] = Array.from(this.registry.components)

        for (const [, component] of components) {
            if (component.$options.enable) {
                try {
                    await component.destroy(error)
                } catch (e) {
                    return Promise.reject(e)
                }
            }
        }

        if (error) {
            return Promise.reject(error)
        }
    }

    public static create(): Application {
        return new this()
    }
}
