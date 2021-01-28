import { createRef, h } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { ItemValue } from '../itemValue';
import { convertMsToTime } from '../time/millisecondsToTimeConverter';
import { ItemTableFormName } from './itemTableFormName';

export interface ItemTableProps {
    itemValueMap: Map<string, ItemValue>;
    onBlurInputForm: (event: Event, id: string) => void;
    onDeleteItem: (key: string) => void;
}

export const ItemTable = ({ itemValueMap, onBlurInputForm, onDeleteItem }: ItemTableProps): JSX.Element => {
    const itemValueMapEntries = useMemo(() => Array.from(itemValueMap.entries()), [itemValueMap]);
    const itemNameRef = createRef<HTMLInputElement>();

    useEffect(() => {
        itemNameRef?.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <table>
            {itemValueMapEntries.map(([key, value], i) => (
                <tr key={`${key}_${i}`}>
                    <td>
                        <input type="hidden" id={ItemTableFormName.Id} name={ItemTableFormName.Id} value={key} />
                        <label>
                            Name:
                            <input
                                ref={itemNameRef}
                                type="text"
                                name={ItemTableFormName.Name}
                                id={ItemTableFormName.Name}
                                value={value.name}
                                onBlur={(event) => onBlurInputForm(event, key)}
                            />
                        </label>
                    </td>
                    <td>
                        <label>
                            URL:
                            <input
                                type="url"
                                name={ItemTableFormName.Url}
                                id={ItemTableFormName.Url}
                                value={value.url}
                                onBlur={(event) => onBlurInputForm(event, key)}
                            />
                        </label>
                    </td>
                    <td>{convertMsToTime(value.time)}</td>
                    <td>
                        <button onClick={() => onDeleteItem(key)}>-</button>
                    </td>
                </tr>
            ))}
        </table>
    );
};
