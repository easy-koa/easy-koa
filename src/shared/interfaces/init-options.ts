import { Services } from './services';

export interface InitOptions {
    getter(key: string): any;
    service(key: string): Services;
    names(): string[];
}