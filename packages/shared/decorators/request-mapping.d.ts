import 'reflect-metadata';
export declare function RequestMapping({path, methods}: {
    path?: string;
    methods?: string[];
}): (target: any, property: any, descriptor: any) => void;
