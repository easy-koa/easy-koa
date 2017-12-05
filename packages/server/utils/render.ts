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


    return function (view: string, data: any = {}) {
        const ctx = this;
        const context = Object.assign({}, ctx.state, data);
        const html = render(view, context);
        const writeResp = context.writeResp === false ? false : (context.writeResp || settings.writeResp);

        if (writeResp) {
            ctx.type = 'html';
            ctx.body = html;
        } else {
            return html;
        }
    };
}