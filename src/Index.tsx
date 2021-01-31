import { h, render } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { v4 as uuid } from 'uuid';
import { ItemTable } from './components/ItemTable';
import { createItemValue, ItemValue } from './itemValue';
import { calcTotalTime } from './time/totalTimeCalculator';
import { convertMsToTime } from './time/millisecondsToTimeConverter';
import { ItemTableFormName } from './components/itemTableFormName';
import { createItemRepository, ItemRepository } from './itemRepository';

interface Props {
    repository: ItemRepository;
}

const ITEM_INITIAL_VALUE = {
    name: '',
    url: '',
    time: 0,
};

const STORAGE_KEY = 'wasted_experience_list';

export const Index = ({ repository }: Props): JSX.Element => {
    const initialValue = repository.getMap<ItemValue>(STORAGE_KEY);
    const [itemValueMap, setItemValueMap] = useState<Map<string, ItemValue>>(initialValue ?? new Map());
    const intervalId = useRef<number | null>(null);

    const addItem = useCallback((): void => {
        const id = uuid();
        itemValueMap.set(id, createItemValue({ id, ...ITEM_INITIAL_VALUE }));

        const result = new Map(itemValueMap);
        setItemValueMap(result);
        repository.setMap(STORAGE_KEY, result);
    }, [itemValueMap, repository]);

    const deleteItem = useCallback(
        (key: string): void => {
            if (intervalId.current !== null) {
                clearInterval(intervalId.current);
            }

            itemValueMap.delete(key);

            const result = new Map(itemValueMap);
            setItemValueMap(result);
            repository.setMap(STORAGE_KEY, result);
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

            const result = new Map(itemValueMap);
            setItemValueMap(result);
            repository.setMap(STORAGE_KEY, result);
        },
        [itemValueMap, repository],
    );

    const handleVisibilityChange = useCallback(() => {
        const pageUrl = location.href;
        const itemValue = Array.from(itemValueMap.values()).find((itemValue) => itemValue.url === pageUrl);

        if (itemValue === undefined) {
            return;
        }

        if (document.visibilityState === 'visible') {
            intervalId.current = window.setInterval(() => {
                itemValueMap.set(itemValue.id, createItemValue({ ...itemValue, time: (itemValue.time += 1000) }));

                const result = new Map(itemValueMap);
                setItemValueMap(result);
                repository.setMap(STORAGE_KEY, result);
            }, 1000);
        }

        if (document.visibilityState === 'hidden') {
            intervalId.current !== null && clearInterval(intervalId.current);
        }
    }, [itemValueMap, repository]);

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [handleVisibilityChange]);

    return (
        <>
            <p>
                <output>{totalTime}</output>
            </p>
            <h2>Wasted experience list</h2>
            {itemValueMap.size > 0 && (
                <ItemTable itemValueMap={itemValueMap} onDeleteItem={deleteItem} onBlurInputForm={onBlurInputForm} />
            )}
            <button onClick={addItem}>+</button>
        </>
    );
};

const rootElement = document.querySelector('#wasted-experience-list');
if (rootElement !== null) {
    const storage = window.localStorage;
    const repository = createItemRepository(storage);
    render(<Index repository={repository} />, rootElement);
}
