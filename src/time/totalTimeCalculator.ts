import { ItemValue } from '../wasted_experience_item/itemValue';

import { milliseconds } from './millisecondsType';

export function calcTotalTime(itemValueList: ItemValue[]): milliseconds {
    if (itemValueList.length === 0) {
        return 0;
    }

    return itemValueList.map((item) => item.time).reduce((accumulator, current) => accumulator + current);
}
