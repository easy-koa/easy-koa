import { Component } from "@kaola/kapp-core"
import { BaseObject } from "@kaola/kapp-shared"

export class Config extends Component {
    private config: BaseObject
    private remote: BaseObject

    name(): string {
        return 'config'
    }

    constructor(options: BaseObject = {}) {
        super()

        if (options.remote) {
            this.remote = options.remote
        }

        delete options.remote

        this.config = options
    }

    init(): void {}

    get(field?: string): BaseObject {
        if (field) {
            return this.config[field]
        }
        return this.config
    }
}
