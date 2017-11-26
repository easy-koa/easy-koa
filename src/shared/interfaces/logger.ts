import { Message } from './message';

export interface logger {
    info(message: Message): void;

    success(message: Message): void;

    warn(message: Message): void;

    error(message: Message): void;

    newline(): void;

    say(message: Message): void;
}