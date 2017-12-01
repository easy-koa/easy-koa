import { ComponentsRegistry } from './components';
import { ServicesRegistry } from './services';


export class Registry {
    public readonly components: ComponentsRegistry;
    public readonly services: ServicesRegistry;

    constructor() {
        this.components = new ComponentsRegistry(this);
        this.services = new ServicesRegistry(this);
    }

    public mount(component: any) {
        this.components.mount(component);
        this.services.mount(component);
    }
}