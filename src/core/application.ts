import 'reflect-metadata';
import * as dotProp from 'dot-prop';
import * as ora from 'ora';
import { Plugin, Plugins } from './plugin';
import { logger } from '../shared/utils';
import { Services } from '../shared/interfaces';
import { entries } from '../shared/utils';
import { Registry } from './registry';
const servicesKey = 'services';

export class Application {
    readonly pluginRegistry: Registry = Registry.create();
    readonly componentRegistry: Registry = Registry.create();

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

    public registerComponent(constructor: any, component: any) {
        this.componentRegistry.register(constructor, component);
    }

    private names() {
        return this.pluginRegistry.keys();
    }

    public getPlugin(pluginConstuctor: any) {
        const { pluginRegistry, componentRegistry } = this;
        return pluginRegistry.lookup(pluginConstuctor) || componentRegistry.lookup(pluginConstuctor);
    }

    public inject(plugin: any) {
        const dependencies = Reflect.getMetadata(servicesKey, plugin);

        if (dependencies) {
            dependencies.forEach((dependencyPlugin: any, pluginName: string) => {
                const dependency = this.getPlugin(dependencyPlugin);;
                if (dependency) {
                    plugin[pluginName] = dependency;
                } else {
                    throw new Error(`inject dependency error, pleace check the service${dependencyPlugin.name}`)
                }
            });
        }
    }

    public start() {
        const pluginRegistry = this.pluginRegistry;

        const spinner = ora();

        const inject = this.inject.bind(this);
        const registerComponent = this.registerComponent.bind(this);
        
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
                        inject(plugin);
                        plugin.registerComponent = registerComponent;
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