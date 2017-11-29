import 'reflect-metadata';
import * as dotProp from 'dot-prop';
import * as ora from 'ora';
import { Plugin, Plugins } from './plugin';
import { logger } from '../shared/utils';
import { Services } from '../shared/interfaces';
import { entries } from '../shared/utils';
import { Registry } from './registry';
import { injection } from '../shared/constants';

export class Application {
    readonly pluginRegistry: Registry = Registry.create();
    readonly serviceRegistry: Registry = Registry.create();

    public plugins() {
        return this.pluginRegistry.all();
    }

    public use(plugin: Plugin) {
        if (!(plugin instanceof Plugin)) {
            return;
        }
        plugin.afterCreated();
        this.register(plugin);
    }

    private register(plugin: Plugin) {
        this.pluginRegistry.register(plugin.constructor, plugin);
    }

    public registerService(constructor: any, service: any) {
        this.serviceRegistry.register(constructor, service);
    }

    private names() {
        return this.pluginRegistry.keys();
    }

    public getPlugin<T>(pluginConstuctor: T) {
        return this.pluginRegistry.lookup(pluginConstuctor);
    }

    public getServce<T>(serviceConstuctor: T) {
        return this.serviceRegistry.lookup(serviceConstuctor);
    }

    private injectInstance(plugin: any, key: string, getInstance: Function) {
        const dependencies = Reflect.getMetadata(key, plugin);
            
        if (dependencies) {
            dependencies.forEach((constructor: any, pluginName: string) => {
                const dependency = getInstance(constructor);

                if (dependency) {
                    plugin[pluginName] = dependency;
                } else {
                    throw new Error(`inject dependency error, pleace check the ${key} ${constructor.name}`)
                }
            });
        }
    }

    public injectPlugin(plugin: any) {
        this.injectInstance(
            plugin,
            injection.plugin,
            (constructor: any) => this.getPlugin(constructor)
        );
    }

    public injectService(plugin: any) {
        this.injectInstance(
            plugin,
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

    public injectAll(plugin: any) {
        this.injectPlugin(plugin);
        this.injectService(plugin);
    }

    public start() {
        const pluginRegistry = this.pluginRegistry;

        const spinner = ora();

        const injectAll = this.injectAll.bind(this);
        const registerService = this.registerService.bind(this);
        
        logger.newline();

        async function start(): Promise<void> {
            spinner.start();

            let counter = 0;
            let iterator;
            const plugins = pluginRegistry.values();
            const pluginNum = pluginRegistry.size();

            while (iterator = plugins.next()) {
                if (iterator.done) {
                    break;
                }

                const plugin = iterator.value;
                
                counter++;
                spinner.text = `[${counter}/${pluginNum}] Loading ${plugin.name()}`;

                try {
                    if (plugin.$options.enable) {
                        plugin.registerService = registerService;
                        injectAll(plugin);
                        await plugin.init();
                    }

                    spinner.succeed(`Plugin ${plugin.name()} loaded`);
                } catch (e) {
                    spinner.fail(`Failed to load plugin "${plugin.name()}"`);
                    return Promise.reject(e);
                }
            }

            return Promise.resolve();
        }

        return start()
            .then(() => {
                let iterator;
                const plugins = pluginRegistry.values();
                
                while (iterator = plugins.next()) {
                    if (iterator.done) {
                        break;
                    }

                    const plugin = iterator.value;
                    plugin.ready();
                }

                return Promise.resolve();
            }).catch((error) => {
                return this.stop(error);
            });
    }

    public async stop(error?: any) {
        const pluginRegistry = this.pluginRegistry;
        let iterator;
        
        const plugins = pluginRegistry.values();
        
        while (iterator = plugins.next()) {
            if (iterator.done) {
                break;   
            }
            const plugin = iterator.value;
            if (plugin.$options.enable) {
                try {
                    await plugin.destroy(error);
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