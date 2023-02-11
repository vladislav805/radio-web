import { getCachedValue, purgeCache, pushCache } from '.';
import { delay } from '../delay';

describe('mapCache', () => {
    beforeEach(() => {
        purgeCache();
    });

    it('should return cached value', () => {
        pushCache('test', 'value');

        expect(getCachedValue('test')).toEqual('value');
    });

    it('should return undefined for expired key', async() => {
        pushCache('test', 'value', 1);

        await delay(2000);

        expect(getCachedValue('test')).toBeUndefined();
    });

    it('should return undefined for non-existed key', async() => {
        expect(getCachedValue('foo')).toBeUndefined();
    });
});
