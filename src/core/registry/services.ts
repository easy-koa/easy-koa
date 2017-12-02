import { Registry } from "./base-registry";


export class ServicesRegistry extends Registry {
    key() {
        return 'service';
    }

    registry(key: any, value: any) {
        this.set(key, value);
    }

    getInstance(Service: any) {
        let instance = this.get(Service);
        
        if (!instance) {
            instance = new Service();
            this.registry(Service, instance);
            this.registryCenter.install(instance);
        }
        
        return instance
    }
}