import { BaseObject, startTime } from "@kapp/shared";
import * as createMonitorPlainObject from '../utils/create-monitor-plain-object';

export function wrapRenderMonitor (render: Function) {
    return async function(template: string, data: BaseObject) {
        const end = startTime();
        const html = await render(template, data);

        this.collect(createMonitorPlainObject.render({
            action: this.path,
            template: template,
            time: end()
        }));

        this.type = 'html';
        this.body = html;
    };
}