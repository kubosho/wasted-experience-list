import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuid } from 'uuid';

import { ItemTableFormName } from './components/itemTableFormName';
import { itemValueListState } from './wasted_experience_item/itemValueListState';
import { calculatedTotalTimeState } from './time/calculatedTotalTimeState';
import { createItemValue, ItemValue } from './wasted_experience_item/itemValue';
import { IndexPage } from './pages/Index';
import { StorageWrapper, STORAGE_KEY } from './storage/storageWrapper';
import { getSyncStorage } from './storage/syncStorage';
import { createTimeTrackerOfSpentOnPage } from './time/timeTrackerOfSpentOnPage';

type Props = {
    storage: StorageWrapper | null;
};

const ITEM_INITIAL_VALUE = {
    name: '',
    url: '',
    time: 0,
};

export const Main = ({ storage }: Props): JSX.Element => {
    const [itemValueList, setItemValueList] = useRecoilState(itemValueListState);
    const totalTime = useRecoilValue(calculatedTotalTimeState);

    useEffect(() => {
        const timeTrackerOfSpentOnPage = createTimeTrackerOfSpentOnPage();

        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            const pageUrl = tabs[0].url;

            if (!pageUrl) {
                return;
            }

            timeTrackerOfSpentOnPage?.autoTrack(pageUrl, (itemValueList) => {
                itemValueList && setItemValueList(itemValueList);
            });
        });
    }, [setItemValueList]);

    useEffect(() => {
        storage?.get<ItemValue[]>(STORAGE_KEY).then((value) => {
            setItemValueList(value);
        });
    }, [storage, setItemValueList]);

    const saveStorage = (itemValueList: ItemValue[]): void => {
        storage?.set(STORAGE_KEY, itemValueList);
    };

    const setInputText = (event: Event, index: number): void => {
        const target = event.target as HTMLInputElement;
        switch (target.id) {
            case ItemTableFormName.Name:
                {
                    const newList = spliceItemValueList(ItemTableFormName.Name, target.value, index, itemValueList);
                    setItemValueList(newList);
                    saveStorage(newList);
                }
                break;
            case ItemTableFormName.Url:
                {
                    const newList = spliceItemValueList(ItemTableFormName.Url, target.value, index, itemValueList);
                    setItemValueList(newList);
                    saveStorage(newList);
                }
                break;
            default:
                break;
        }
    };

    const onClickAddItem = (): void => {
        const id = uuid();
        const newList = [...itemValueList, { id, ...ITEM_INITIAL_VALUE }];
        setItemValueList(newList);
        saveStorage(newList);
    };

    const onDeleteItem = (index: number): void => {
        const newList = itemValueList.filter((_value, i) => index !== i);
        setItemValueList(newList);
        saveStorage(newList);
    };

    const onBlurInputForm = (event: Event, index: number): void => setInputText(event, index);

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

    itemValueList[index] = createItemValue({
        ...prevItemValue,
        [key]: value,
    });

    return itemValueList;
}

const rootElement = document.querySelector('#wasted-experience-list');
if (rootElement !== null) {
    const storage = getSyncStorage();

    render(
        <RecoilRoot>
            <Main storage={storage} />
        </RecoilRoot>,
        rootElement,
    );
}
