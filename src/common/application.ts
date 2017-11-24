import * as dotProp from 'dot-prop';
import * as ora from 'ora';
import { Plugin, Plugins } from './plugin';
import Registry from './registry';
import { logger } from '../shared/utils/logger';
import entries from '../shared/utils/entries';
import Services from '../shared/interfaces/services';

class Core {
    readonly pluginRegistry: Registry = new Registry();
    readonly serviceRegistry: Registry = new Registry();

    public plugins() {
        return this.pluginRegistry.all();
    }

    public services() {
        return this.serviceRegistry.all();
    }

    public use(plugin: Plugin) {
        if (!(plugin instanceof Plugin)) {
            return;
        }
        
        plugin.afterCreated();

        this.register(plugin);
    }

    private register(plugin: Plugin) {
        const name = plugin.name();
        const services = plugin.service();
        const service = this.bindServiceContext(services, plugin);

        this.pluginRegistry.register(name, plugin);
        this.serviceRegistry.register(name, service);
    }

    // 绑定service上下文
    private bindServiceContext(services: Services, context: Plugin) {
        const newServices: Services = {};

        for (let [
            name, service
        ] of entries(services)) {
            newServices[name] = service.bind(context);
        }

        return newServices;
    }

    private getter(keypath: string) {
        const [pluginName, ...rest] = keypath.split('.');
        const plugin = this.pluginRegistry.lookup(pluginName);
        if (!plugin) {
            return;
        }

        if (rest.length === 0) {
            // TODO: deepClone
            return plugin.$options;
        }

        return dotProp.get(plugin.$options, rest.join('.'));
    }

    public service(keypath: string) {
        const [pluginName, serviceName] = keypath.split('.');
        const pluginService = this.serviceRegistry.lookup(pluginName);
        if (!serviceName) {
            if (pluginService) {
                return pluginService;
            }

            throw `plugin "${pluginName}" is not found!`;
        }

        const services = this.serviceRegistry.lookup(pluginName);

        if (services && serviceName in services) {
            return services[serviceName];
        }

        throw `service "${keypath}" is not found!`;
    }


    private names() {
        const plugins: Plugins = this.pluginRegistry.all();
        return Object.keys(plugins);
    }

    public start() {
        const plugins: Plugins = this.pluginRegistry.all();

        const getter = this.getter.bind(this);
        const service = this.service.bind(this);
        const names = this.names.bind(this);

        const spinner = ora();

        logger.newline();

        async function start(): Promise<void> {
            spinner.start();

            const pluginNum = Object.keys(plugins).length;

            let counter = 0;

            for (let [ name, plugin ] of <[string, Plugin][]> entries(plugins)) {
                counter++;
                spinner.text = `[${counter}/${pluginNum}] Loading ${plugin.name()}`;

                try {
                    if (plugin.$options.enable) {
                        await plugin.init({ getter, service, names});
                    }

                    spinner.succeed(`Plugin ${plugin.name()} loaded`);
                } catch (e) {
                    spinner.fail(`Failed to load plugin "${plugin.name()}"`);
                    return Promise.reject(e);
                }
            }

            return Promise.resolve();
        }

        return start().then(() => {
            for (let [ name, plugin ] of <[string, Plugin][]> entries(plugins)) {
                plugin.ready();
            }
            return Promise.resolve();
        }).catch((error) => {
            return this.stop(error);
        });
    }

    public async stop(error?: any) {
        const plugins = this.pluginRegistry.all();

        for (let [ name, plugin ] of <[string, Plugin][]> entries(plugins)) {
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
        return new Core();
    }
};

export default Core;