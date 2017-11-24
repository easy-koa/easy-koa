import Services from './services';

interface initOptions {
    getter(key: string): any;
    service(key: string): Services;
    names(): string[];
}

export default initOptions