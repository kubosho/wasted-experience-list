import { ItemValue } from '../itemValue';

import { milliseconds } from './millisecondsType';

export function calcTotalTime(itemValueList: ItemValue[]): milliseconds {
    return itemValueList.map((item) => item.time).reduce((accumulator, current) => accumulator + current);
}
