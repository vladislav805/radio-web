import { convertParams } from '.';

describe('convertParams', () => {
    it('should convert all keys', () => {
        expect(convertParams({
            trueString_to_true: 'true',
            falseString_to_true: 'false',
            number: '123',
            number_start: '123a',
            number_end: 'a123',
            string: 'foo',
            empty_string: '',
        })).toEqual({
            trueString_to_true: true,
            falseString_to_true: false,
            number: 123,
            number_start: '123a',
            number_end: 'a123',
            string: 'foo',
            empty_string: '',
        })
    });
});
