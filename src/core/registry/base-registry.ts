import 'reflect-metadata';

export abstract class Registry {
    private map = new Map();
    public registryCenter: any;

    key() {
        return ''
    }

    constructor(registryCenter: any) {
        this.registryCenter = registryCenter;
    }
    
    abstract getInstance(constructor: any): any;

    public install(component: any) {
        
        const dependencies = Reflect.getMetadata(`${this.key()}s`, component);
        
        if (dependencies) {
            
            dependencies.forEach((constructor: any, componentName: string) => {
                const dependency = this.getInstance(constructor);
                if (dependency) {
                    component[componentName] = dependency;
                } else {
                    throw new Error(`failed to inject the ${this.key()} - ${constructor.name}`)
                }
            });
        }
    }
    
    protected get(item: any) {
        return this.map.get(item);
    }

    protected set(key: any, value: any) {
        return this.map.set(key, value);
    }

    public values() {
        return this.map.values();
    }

    public size() {
        return this.map.size;
    }
}