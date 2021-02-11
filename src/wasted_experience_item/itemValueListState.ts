import { atom } from 'recoil';

import { ItemValue } from './itemValue';

export const itemValueListState = atom<ItemValue[]>({
    key: 'itemValueListState',
    default: [],
});
