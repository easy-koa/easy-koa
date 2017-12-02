import 'reflect-metadata';
import * as dotProp from 'dot-prop';
import * as ora from 'ora';
import { Component, Components } from './component';
import { logger } from '../shared/utils';
import { Services } from '../shared/interfaces';
import { entries } from '../shared/utils';
import { Registry } from './registry';
import { registry } from '../shared/constants';

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
        const spinner = ora();
        const components = Array.from(this.registry.components);

        let index = 0;
        const total = components.length;
        
        spinner.start();

        for (let [name, component] of components) {
            index++;
            spinner.text = `[${index}/${total}] Starting ${name}`;

            try {
                if (component.$options.enable) {
                    this.registry.install(component);
                    
                    if (component.init) {
                        await component.init()
                    }
                }
                
                spinner.text = `121`;
            
            } catch (e) {
                spinner.fail(`Started ${name} failed, because '${e}'`);
                return Promise.reject(e);
            }
        }

        spinner.succeed('Kapp.js started successfully');
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
