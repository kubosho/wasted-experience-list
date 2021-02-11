import { selector } from 'recoil';

import { itemValueListState } from '../wasted_experience_item/itemValueListState';

import { convertMsToTime } from './millisecondsToTimeConverter';
import { calcTotalTime } from './totalTimeCalculator';

export const calculatedTotalTimeState = selector({
    key: 'calculatedTotalTimeState',
    get: ({ get }) => {
        const itemValueList = get(itemValueListState);
        const totalTime = calcTotalTime(itemValueList);
        return convertMsToTime(totalTime);
    },
});
