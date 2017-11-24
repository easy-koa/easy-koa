import { Plugin } from './plugin';
import BaseObject from '../shared/interfaces/base-object';

type Stash = BaseObject;

class Registry {
    $: Stash = {};

    all() {
        return this.$;
    }

    register(name: string, stuff: BaseObject) {
        this.$[name] = stuff;
    }

    unregister(name: string) {
        delete this.$[name];
    }

    lookup(name: string) {
        return this.$[name];
    }
}

export default Registry;