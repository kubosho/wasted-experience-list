import { calcTotalTime } from '../totalTimeCalculator';

it('calcTotalTime: 4:00:00 + 3:00:00', () => {
    expect(
        calcTotalTime([
            {
                name: 'Twitter',
                url: 'https://twitter.com/',
                time: 14400000,
            },
            {
                name: 'Hatena bookmark',
                url: 'https://b.hatena.com/',
                time: 10800000,
            },
        ]),
    ).toBe(25200000);
});
