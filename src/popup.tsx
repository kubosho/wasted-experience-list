import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
import Recoil, { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

import { calculatedTotalTimeState } from './time/state/calculatedTotalTimeState';
import { ItemTableFormName } from './components/itemTableFormName';
import { itemValueListState } from './wasted_experience_item/state/itemValueListState';
import { createItemValue, ItemValue } from './wasted_experience_item/itemValue';
import { IndexPage } from './pages/Index';
import { connectItemValueListConnectPort } from './chrome/port_connecter/itemValueListConnectPort';
import { connectPopupInitialValueConnectPort } from './chrome/port_connecter/popupInitialValueConnectPort';
import { useInstance } from './hooks/useInstance';

const ITEM_INITIAL_VALUE = {
    name: '',
    url: '',
    time: 0,
};

export const Main = (): JSX.Element => {
    const [itemValueList, setItemValueList] = useRecoilState(itemValueListState);
    const totalTime = useRecoilValue(calculatedTotalTimeState);
    const itemValueListPort = useInstance<chrome.runtime.Port>(() => connectItemValueListConnectPort());

    const saveItemValueList = (newList: ItemValue[]): void => {
        setItemValueList(newList);
        itemValueListPort.postMessage(newList);
    };

    const setInputText = (event: Event, index: number): void => {
        const target = event.target as HTMLInputElement;
        const newList = spliceItemValueList(ItemTableFormName.Url, target.value, index, itemValueList);
        saveItemValueList(newList);
    };

    const onClickAddItem = (): void => {
        const id = uuid();
        const newList = [...itemValueList, { id, ...ITEM_INITIAL_VALUE }];
        saveItemValueList(newList);
    };

    const onDeleteItem = (index: number): void => {
        const newList = itemValueList.filter((_value, i) => index !== i);
        saveItemValueList(newList);
    };

    const onBlurInputForm = (event: Event, index: number): void => setInputText(event, index);
    const onKeyupInputForm = (event: KeyboardEvent, index: number): void => {
        if (!event.isComposing) {
            setInputText(event, index);
        }
    };

    useEffect(() => {
        itemValueListPort.onMessage.addListener((newList: ItemValue[]) => {
            setItemValueList(newList);
        });
    }, [itemValueListPort, setItemValueList]);

    return (
        <IndexPage
            totalTime={totalTime}
            itemValueList={itemValueList}
            onDeleteItem={onDeleteItem}
            onBlurInputForm={onBlurInputForm}
            onClickAddItem={onClickAddItem}
            onKeyupInputForm={onKeyupInputForm}
        />
    );
};

function spliceItemValueList(key: string, value: string, index: number, baseItemValueList: ItemValue[]): ItemValue[] {
    const itemValueList = [...baseItemValueList];
    const prevItemValue = itemValueList[index];

    itemValueList[index] = createItemValue({
        ...prevItemValue,
        [key]: value,
    });

    return itemValueList;
}

const rootElement = document.querySelector('#wasted-experience-list');
if (rootElement !== null) {
    const popupInitialValuePort = connectPopupInitialValueConnectPort();

    popupInitialValuePort.onMessage.addListener((itemValueList) => {
        const initializeState = ({ set }: Recoil.MutableSnapshot): void => {
            set(itemValueListState, itemValueList);
        };

        render(
            <RecoilRoot initializeState={initializeState}>
                <Main />
            </RecoilRoot>,
            rootElement,
        );

        popupInitialValuePort.disconnect();
    });
}
