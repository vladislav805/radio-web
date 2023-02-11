import { leadZero } from '.';

describe('leadZero', () => {
    it('should pad zero', () => {
        expect(leadZero(1)).toEqual('01');
        expect(leadZero(10)).toEqual('10');
        expect(leadZero(100)).toEqual('00');

        expect(leadZero(1, 3)).toEqual('001');
        expect(leadZero(10, 3)).toEqual('010');
        expect(leadZero(100, 3)).toEqual('100');
    });
});
