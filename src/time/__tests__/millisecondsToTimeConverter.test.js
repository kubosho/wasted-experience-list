import { convertMsToTime } from '../millisecondsToTimeConverter';

it('convertMsToTime: 30 minutes (1800000 ms)', () => {
    expect(convertMsToTime(1800000)).toBe('00:30:00');
});

it('convertMsToTime: 4 hours (14400000 ms)', () => {
    expect(convertMsToTime(14400000)).toBe('04:00:00');
});

it('convertMsToTime: 1 day (86400000 ms)', () => {
    expect(convertMsToTime(86400000)).toBe('1 day 00:00:00');
});

it('convertMsToTime: 2 days (172800000 ms)', () => {
    expect(convertMsToTime(172800000)).toBe('2 days 00:00:00');
});
