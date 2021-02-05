import { h, render } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { v4 as uuid } from 'uuid';

import { ItemTable } from '../components/ItemTable';
import { createItemValue, ItemValue } from '../wasted_experience_item/itemValue';
import { calcTotalTime } from '../time/totalTimeCalculator';
import { convertMsToTime } from '../time/millisecondsToTimeConverter';
import { ItemTableFormName } from '../components/itemTableFormName';
import { createItemRepository, ItemRepository } from '../wasted_experience_item/itemRepository';
import { createStorageWrapper, STORAGE_KEY } from '../storage/storage';

interface Props {
    repository: ItemRepository;
}

const ITEM_INITIAL_VALUE = {
    name: '',
    url: '',
    time: 0,
};

export const ContentScripts = ({ repository }: Props): JSX.Element => {
    const initialValue = repository.getMap<ItemValue>(STORAGE_KEY);
    const [itemValueMap, setItemValueMap] = useState<Map<string, ItemValue>>(initialValue ?? new Map());

    const addItem = useCallback((): void => {
        const id = uuid();
        itemValueMap.set(id, createItemValue({ id, ...ITEM_INITIAL_VALUE }));

        saveItemValueMap(repository, itemValueMap, setItemValueMap);
    }, [itemValueMap, repository]);

    const deleteItem = useCallback(
        (key: string): void => {
            itemValueMap.delete(key);

            saveItemValueMap(repository, itemValueMap, setItemValueMap);
        },
        [itemValueMap, repository],
    );

    const totalTime = useCallback(() => {
        const totalTime = calcTotalTime(Array.from(itemValueMap.values()));
        return convertMsToTime(totalTime);
    }, [itemValueMap]);

    const onBlurInputForm = useCallback(
        (event: Event, id: string): void => {
            const target = event.target as HTMLInputElement;
            const prevValue = itemValueMap.get(id) ?? createItemValue({ id, ...ITEM_INITIAL_VALUE });

            if (target.id === ItemTableFormName.Name) {
                itemValueMap.set(
                    id,
                    createItemValue({
                        ...prevValue,
                        name: target.value,
                    }),
                );
            }

            if (target.id === ItemTableFormName.Url) {
                itemValueMap.set(
                    id,
                    createItemValue({
                        ...prevValue,
                        url: target.value,
                    }),
                );
            }

            saveItemValueMap(repository, itemValueMap, setItemValueMap);
        },
        [itemValueMap, repository],
    );

    return (
        <>
            <h2>Wasted experience list</h2>
            <p>
                <output>{totalTime()}</output>
            </p>
            {itemValueMap.size > 0 && (
                <ItemTable itemValueMap={itemValueMap} onDeleteItem={deleteItem} onBlurInputForm={onBlurInputForm} />
            )}
            <button onClick={addItem}>+</button>
        </>
    );
};

function saveItemValueMap(
    repository: ItemRepository,
    itemValueMap: Map<string, ItemValue>,
    callback: (itemValueMap: Map<string, ItemValue>) => void,
): void {
    const valueMap = new Map(itemValueMap);
    callback(valueMap);
    repository.setMap(STORAGE_KEY, valueMap);
}

const rootElement = document.querySelector('#wasted-experience-list');
if (rootElement !== null) {
    const storage = createStorageWrapper();
    const repository = createItemRepository(storage);
    render(<ContentScripts repository={repository} />, rootElement);
}
