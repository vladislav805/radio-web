import { toTimeFormat } from '.';

describe('toTimeFormat', () => {
    it('should return formatted time', () => {
        expect(toTimeFormat(0)).toEqual('0:00');
        expect(toTimeFormat(1)).toEqual('0:01');
        expect(toTimeFormat(10)).toEqual('0:10');
        expect(toTimeFormat(59)).toEqual('0:59');
        expect(toTimeFormat(60)).toEqual('1:00');
        expect(toTimeFormat(600)).toEqual('10:00');
        expect(toTimeFormat(3600)).toEqual('1:00:00');
    });
});
