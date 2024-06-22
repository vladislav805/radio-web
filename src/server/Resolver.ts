import axios from 'axios';

import type { ICurrentTrack, IStreamDatabase } from '@typings';

export type TResolverFetch = (args: any | undefined) => Promise<any | undefined>;

export abstract class Resolver<Raw extends object, ResolverArgument = never> {
    /**
     * @param stream Стрим, информацию о текущем треке которого необходимо получить
     */
    public constructor(
        protected readonly stream: IStreamDatabase,
    ) {

    }

    /**
     * Трансформация ответа от сайта радиостанции или другого источника к единому формату ICurrentTrack.
     * При отсутствии данных необходимо вернуть undefined.
     */
    protected abstract transform(result: Raw, args: ResolverArgument | undefined): ICurrentTrack | undefined;

    /**
     * Получение информации от сайта радиостанции или другого источника. По умолчанию ожидаем JSON.
     */
    protected async fetch(_args: ResolverArgument | undefined): Promise<Raw | undefined> {
        const { data } = await axios.get(this.stream.trackUrl as string, {
            responseType: 'json',
        });

        return data as Raw;
    }

    /**
     * Внешнее общее API для резолвера
     */
    public async get(): Promise<ICurrentTrack | undefined> {
        if (!this.stream.trackUrl) return undefined;

        try {
            const args = this.stream.resolverArguments
                ? JSON.parse(this.stream.resolverArguments) as ResolverArgument
                : undefined;

            const rawResult = await this.fetch(args);

            if (!rawResult) return undefined;

            return this.transform(rawResult, args);
        } catch (e) {
            return undefined;
        } finally {
            this.destruct();
        }
    }

    protected destruct(): void {

    }
}

export interface IResolverCtr<Raw extends object> {
    new(stream: IStreamDatabase): Resolver<Raw, any>;
}
