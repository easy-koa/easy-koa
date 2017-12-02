import { ComponentsRegistry } from './components';
import { ServicesRegistry } from './services';


export class Registry {
    public readonly components: ComponentsRegistry;
    public readonly services: ServicesRegistry;

    constructor() {
        this.components = new ComponentsRegistry(this);
        this.services = new ServicesRegistry(this);
    }

    public install(component: any) {
        this.components.install(component);
        this.services.install(component);
    }
}