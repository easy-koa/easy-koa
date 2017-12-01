import 'reflect-metadata';
import * as dotProp from 'dot-prop';
import * as ora from 'ora';
import { Component, Components } from './component';
import { logger } from '../shared/utils';
import { Services } from '../shared/interfaces';
import { entries } from '../shared/utils';
import { Registry } from './registry';
import { injection } from '../shared/constants';

export class Application {
    readonly componentRegistry: Registry = Registry.create();
    readonly serviceRegistry: Registry = Registry.create();

    public components() {
        return this.componentRegistry.all();
    }

    public use(component: Component) {
        if (!(component instanceof Component)) {
            return;
        }
        component.afterCreated();
        this.register(component);
    }

    private register(component: Component) {
        const constructor = component.constructor;
        if (this.getPlugin(constructor)) {
            throw new Error(`failed to register the duplicated component - ${constructor.name}`)
        }
        this.componentRegistry.register(constructor.name, component);
    }

    public registerService(constructor: any, service: any) {
        this.serviceRegistry.register(constructor, service);
    }

    private names() {
        return this.componentRegistry.keys();
    }

    public getPlugin<T>(constructor: any) {
        return this.componentRegistry.lookup(constructor.name);
    }

    public getServce<T>(serviceConstuctor: T) {
        return this.serviceRegistry.lookup(serviceConstuctor);
    }

    private injectInstance(component: any, key: string, getInstance: Function) {
        const dependencies = Reflect.getMetadata(key, component);
        
        if (dependencies) {
            dependencies.forEach((constructor: any, pluginName: string) => {
                const dependency = getInstance(constructor);
                if (dependency) {
                    component[pluginName] = dependency;
                } else {
                    throw new Error(`failed to inject the ${key.slice(0, -1)} - ${constructor.name}`)
                }
            });
        }
    }

    public injectPlugin(component: any) {
        this.injectInstance(
            component,
            injection.component,
            (constructor: any) => this.getPlugin(constructor)
        );
    }

    public injectService(component: any) {
        this.injectInstance(
            component,
            injection.service,
            (constructor: any) => {
                let instance = this.getServce(constructor);

                if (!instance) {
                    instance = new constructor();
                    this.injectAll(instance);
                }
                
                return instance
            }
        );
    }

    public injectAll(component: any) {
        this.injectPlugin(component);
        this.injectService(component);
    }

    public start() {
        const componentRegistry = this.componentRegistry;

        const spinner = ora();

        const injectAll = this.injectAll.bind(this);
        const registerService = this.registerService.bind(this);
        
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
                        component.registerService = registerService;
                        injectAll(component);
                        await component.init();
                    }

                    spinner.succeed(`Component ${component.name()} starts successfully`);
                } catch (e) {
                    spinner.fail(`Failed to start component "${component.name()}"`);
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
        const componentRegistry = this.componentRegistry;
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