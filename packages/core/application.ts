import 'reflect-metadata';
import { Registry } from './registry';
import { Component } from './index';
import { logger } from '@kapp/shared/index';

export class Application {
    readonly registry = new Registry();
    public use(component: Component) {
        if (!(component instanceof Component)) {
            return;
        }
        component.afterCreated();

        this.registry.registerComponnet(component);
    }

    public async start() {
        const components = Array.from(this.registry.components);

        let index = 0;
        const total = components.length;

        for (let [name, component] of components) {
            index++;
            try {
                if (component.$options.enable) {
                    this.registry.install(component);
                    
                    if (component.init) {
                        await component.init()
                    }
                }
                logger.info(`Componnet started successfully - ${name}`);
            } catch (e) {
                logger.error(`Started ${name} failed, because '${e}'`);
                return Promise.reject(e);
            }
        }

        logger.info('Application started successfully');
    }

    async ready() {
        const components = Array.from(this.registry.components);
        
        for (let [, component] of components) {
            await component.ready();
        }
    }

    public async stop(error?: any) {
        const components = Array.from(this.registry.components);

        for (let [, component] of components) {
            if (component.$options.enable) {
                try {
                    await component.destroy(error);
                } catch(e) {
                    return Promise.reject(e);
                }
            }
        }

        if (error) {
            return Promise.reject(error);
        }
    }

    public static create() {
        return new this();
    }
};
