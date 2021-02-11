import { createRef, h } from 'preact';
import { useEffect } from 'preact/hooks';

import { ItemValue } from '../wasted_experience_item/itemValue';
import { convertMsToTime } from '../time/millisecondsToTimeConverter';

import { ItemTableFormName } from './itemTableFormName';

export interface ItemTableProps {
    itemValueList: ItemValue[];
    onBlurInputForm: (event: Event, index: number) => void;
    onDeleteItem: (index: number) => void;
}

export const ItemTable = ({ itemValueList, onBlurInputForm, onDeleteItem }: ItemTableProps): JSX.Element => {
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
