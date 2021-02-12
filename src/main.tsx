import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

import { ItemTableFormName } from './components/itemTableFormName';
import { itemValueListState } from './wasted_experience_item/itemValueListState';
import { calculatedTotalTimeState } from './time/calculatedTotalTimeState';
import { createItemValue, ItemValue } from './wasted_experience_item/itemValue';
import { IndexPage } from './pages/Index';
import { STORAGE_KEY } from './storage/storageWrapper';
import { getSyncStorage } from './storage/syncStorage';

const ITEM_INITIAL_VALUE = {
    name: '',
    url: '',
    time: 0,
};

const storage = getSyncStorage();

export const Main = (): JSX.Element => {
    const [itemValueList, setItemValueList] = useRecoilState(itemValueListState);
    const totalTime = useRecoilValue(calculatedTotalTimeState);

    const onClickAddItem = (): void => {
        const id = uuid();
        setItemValueList((itemValueList) => [...itemValueList, { id, ...ITEM_INITIAL_VALUE }]);
    };

    const onDeleteItem = (index: number): void => {
        setItemValueList((itemValueList) => {
            const newList = [...itemValueList];
            newList.splice(index, 1);
            return newList;
        });
    };

    const onBlurInputForm = (event: Event, index: number): void => {
        const target = event.target as HTMLInputElement;

        switch (target.id) {
            case ItemTableFormName.Name:
                return setItemValueList(
                    spliceItemValueList(ItemTableFormName.Name, target.value, index, itemValueList),
                );
            case ItemTableFormName.Url:
                return setItemValueList(spliceItemValueList(ItemTableFormName.Url, target.value, index, itemValueList));
            default:
                break;
        }
    };

    useEffect(() => {
        storage?.get<ItemValue[]>(STORAGE_KEY).then((value) => {
            setItemValueList(value);
        });
    }, [setItemValueList]);

    useEffect(() => {
        storage?.set(STORAGE_KEY, itemValueList);
    }, [itemValueList]);

    return (
        <IndexPage
            totalTime={totalTime}
            itemValueList={itemValueList}
            onDeleteItem={onDeleteItem}
            onBlurInputForm={onBlurInputForm}
            onClickAddItem={onClickAddItem}
        />
    );
};

function spliceItemValueList(key: string, value: string, index: number, baseItemValueList: ItemValue[]): ItemValue[] {
    const itemValueList = [...baseItemValueList];
    const prevItemValue = itemValueList[index];
    const itemValue = createItemValue({
        ...prevItemValue,
        [key]: value,
    });
    itemValueList.splice(index, 1, itemValue);
    return itemValueList;
}

const rootElement = document.querySelector('#wasted-experience-list');
if (rootElement !== null) {
    render(
        <RecoilRoot>
            <Main />
        </RecoilRoot>,
        rootElement,
    );
}
