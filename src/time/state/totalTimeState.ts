import { atom } from 'recoil';

export const totalTimeState = atom<string>({
    key: 'totalTimeState',
    default: '',
});
