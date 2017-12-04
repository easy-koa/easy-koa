import { BaseObject, InitOptions } from "@kapp/shared/interfaces/index";
export declare abstract class Component {
    constructor(...args: any[]);
    id: any;
    $options: any;
    abstract name(): string;
    init(options: InitOptions): void;
    ready(): void;
    destroy(options?: any): void;
    afterCreated(): void;
    static configure(options: BaseObject): BaseObject;
}
export interface Components {
    [propName: string]: Component;
}
