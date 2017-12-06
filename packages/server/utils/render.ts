import artTemplate = require('art-template');

const defaultSettings = {
    debug: process.env.NODE_ENV !== 'production',
    writeResp: true
};

export function defaultRender(settings: any = {}) {
    settings = Object.assign({}, defaultSettings, settings);
    
    function render(view: string, data: any) {
        settings.filename = view;
        return artTemplate.compile(settings)(data);
    }

    return render;
}