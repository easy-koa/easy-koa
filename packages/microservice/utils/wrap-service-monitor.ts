import { InjectPlugin, entries, BaseObject, startTime } from '@kapp/shared';
import { Monitor } from '@kapp/monitor';

export function wrapServiceMonitor(services: BaseObject, monitor: Monitor) {
    const plaignServicesObject: any = {};
    for (let [providerKey, provider] of entries(services)) {
        plaignServicesObject[providerKey] = {};
        for (let [serviceKey, service] of entries(provider)) {
            plaignServicesObject[providerKey][serviceKey] = async function(...args: any[]) {
                const action = providerKey + '.' + serviceKey;
                const end = startTime()
                const result = await service(...args);
                monitor.collect({
                    type: 'microservices',
                    action,
                    payload: {
                        time: end()
                    }
                });
                return result;
            }
        }
    }
    return plaignServicesObject;
}