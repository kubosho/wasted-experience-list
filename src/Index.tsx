import { h, render } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { v4 as uuid } from 'uuid';
import { ItemTable } from './components/ItemTable';
import { createItemValue, ItemValue } from './itemValue';
import { calcTotalTime } from './time/totalTimeCalculator';
import { convertMsToTime } from './time/millisecondsToTimeConverter';
import { ItemTableFormName } from './components/itemTableFormName';

const ITEM_INITIAL_VALUE = {
    name: '',
    url: '',
    time: 0,
};

export const Index = (): JSX.Element => {
    const [itemValueMap, setItemValueMap] = useState<Map<string, ItemValue>>(new Map());
    const intervalId = useRef<number | null>(null);

    const addItem = useCallback((): void => {
        const id = uuid();
        itemValueMap.set(id, createItemValue({ id, ...ITEM_INITIAL_VALUE }));
        setItemValueMap(new Map(itemValueMap));
    }, [itemValueMap]);

    const deleteItem = useCallback(
        (key: string): void => {
            if (intervalId.current !== null) {
                clearInterval(intervalId.current);
            }

            itemValueMap.delete(key);
            setItemValueMap(new Map(itemValueMap));
        },
        [itemValueMap],
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

            setItemValueMap(new Map(itemValueMap));
        },
        [itemValueMap],
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
                setItemValueMap(new Map(itemValueMap));
            }, 1000);
        }

        if (document.visibilityState === 'hidden') {
            intervalId.current !== null && clearInterval(intervalId.current);
        }
    }, [itemValueMap]);

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
    render(<Index />, rootElement);
}
