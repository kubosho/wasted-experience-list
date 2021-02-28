import { createRef, h } from 'preact';
import { useEffect } from 'preact/hooks';

import { ItemValue } from '../wasted_experience_item/itemValue';
import { convertMsToTime } from '../time/millisecondsToTimeConverter';

import { ItemTableFormName } from './itemTableFormName';

export interface ItemTableProps {
    itemValueList: ItemValue[];
    onBlurInputForm: (event: Event, index: number) => void;
    onKeyupInputForm: (event: KeyboardEvent, index: number) => void;
    onDeleteItem: (index: number) => void;
}

export const ItemTable = ({
    itemValueList,
    onBlurInputForm,
    onKeyupInputForm,
    onDeleteItem,
}: ItemTableProps): JSX.Element => {
    const itemNameRef = createRef<HTMLInputElement>();

    useEffect(() => {
        itemNameRef?.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <table>
            <tbody>
                {itemValueList.map((value, index) => (
                    <tr key={`${value.id}_${index}`}>
                        <td>
                            <input
                                type="hidden"
                                id={ItemTableFormName.Id}
                                name={ItemTableFormName.Id}
                                value={value.id}
                            />
                        </td>
                        <td>
                            <label>
                                URL:
                                <input
                                    type="url"
                                    name={ItemTableFormName.Url}
                                    id={ItemTableFormName.Url}
                                    className="border"
                                    value={value.url}
                                    onBlur={(event) => onBlurInputForm(event, index)}
                                    onKeyUp={(event) => onKeyupInputForm(event, index)}
                                />
                            </label>
                        </td>
                        <td>{convertMsToTime(value.time)}</td>
                        <td>
                            <button onClick={() => onDeleteItem(index)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
