import 'reflect-metadata';
import * as dotProp from 'dot-prop';
import * as ora from 'ora';
import { Component, Components } from './component';
import { logger } from '../shared/utils';
import { Services } from '../shared/interfaces';
import { entries } from '../shared/utils';
import { Registry } from './registry/index';
import { injection } from '../shared/constants';

export class Application {
    readonly registry = new Registry();
    public use(component: Component) {
        if (!(component instanceof Component)) {
            return;
        }
        component.afterCreated();

        this.registry.components.register(component);
    }

    public start() {
        const componentRegistry = this.registry.components;
        const spinner = ora();
        const ctx = this;
        
        logger.newline();

        async function start(): Promise<void> {
            spinner.start();

            let counter = 0;
            let iterator;
            const components = componentRegistry.values();
            const pluginNum = componentRegistry.size();
            while (iterator = components.next()) {
                if (iterator.done) {
                    break;
                }

                const component = iterator.value;
                
                counter++;
                spinner.text = `[${counter}/${pluginNum}] Starting ${component.name()}`;

                try {
                    if (component.$options.enable) {
                        ctx.registry.install(component);
                        
                        if (component.init) {
                            await component.init()
                        }
                    }
                    
                    spinner.succeed(`Started successfully - ${component.name()}`);
                } catch (e) {
                    spinner.fail(`Started failed - "${component.name()}"`);
                    return Promise.reject(e);
                }
            }

            return Promise.resolve();
        }

        return start()
            .then(() => {
                let iterator;
                const components = componentRegistry.values();
                
                while (iterator = components.next()) {
                    if (iterator.done) {
                        break;
                    }

                    const component = iterator.value;
                    component.ready();
                }
                
                return Promise.resolve();
            }).catch((error) => {
                return this.stop(error);
            });
    }

    public async stop(error?: any) {
        const componentRegistry = this.registry.components;
        let iterator;
        
        const components = componentRegistry.values();
        
        while (iterator = components.next()) {
            if (iterator.done) {
                break;   
            }
            const component = iterator.value;
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
