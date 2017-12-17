import { InjectPlugin, entries, BaseObject, startTime } from '@one-koa/shared';
import { Monitor } from '@one-koa/plugin-monitor';

export function wrapServiceMonitor(services: BaseObject, monitor: Monitor) {
    const plaignServicesObject: any = {};
    for (let [providerKey, provider] of entries(services)) {
        plaignServicesObject[providerKey] = {};
        for (let [serviceKey, service] of entries(provider)) {
            plaignServicesObject[providerKey][serviceKey] = async function(...args: any[]) {
                const action = providerKey + '.' + serviceKey;
                const end = startTime()
                const response = await service(...args);

                monitor.collect({
                    type: 'microservice',
                    payload: {
                        action,
                        time: end()
                    }
                });

                return response;
            }
        }
    }
    return plaignServicesObject;
}