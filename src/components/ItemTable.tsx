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
        <table className="spectrum-Table">
            <tbody className="spectrum-Table-body">
                {itemValueList.map((value, index) => (
                    <tr className="spectrum-Table-row" key={`${value.id}_${index}`}>
                        <td className="spectrum-Table-cell">
                            <input
                                type="hidden"
                                id={ItemTableFormName.Id}
                                name={ItemTableFormName.Id}
                                value={value.id}
                            />
                            <label>
                                Name:
                                <input
                                    ref={itemNameRef}
                                    type="text"
                                    name={ItemTableFormName.Name}
                                    id={ItemTableFormName.Name}
                                    value={value.name}
                                    onBlur={(event) => onBlurInputForm(event, index)}
                                    onKeyUp={(event) => onKeyupInputForm(event, index)}
                                />
                            </label>
                        </td>
                        <td className="spectrum-Table-cell">
                            <label>
                                URL:
                                <input
                                    type="url"
                                    name={ItemTableFormName.Url}
                                    id={ItemTableFormName.Url}
                                    value={value.url}
                                    onBlur={(event) => onBlurInputForm(event, index)}
                                    onKeyUp={(event) => onKeyupInputForm(event, index)}
                                />
                            </label>
                        </td>
                        <td className="spectrum-Table-cell">{convertMsToTime(value.time)}</td>
                        <td className="spectrum-Table-cell">
                            <button
                                className="spectrum-Button spectrum-Button--warning spectrum-Button--sizeS"
                                onClick={() => onDeleteItem(index)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="spectrum-Icon spectrum-Icon--sizeS"
                                    focusable="false"
                                    aria-hidden="true"
                                    aria-label="Delete"
                                >
                                    <path d="M15.75,3H12V2a1,1,0,0,0-1-1H6A1,1,0,0,0,5,2V3H1.25A.25.25,0,0,0,1,3.25v.5A.25.25,0,0,0,1.25,4h1L3.4565,16.55a.5.5,0,0,0,.5.45H13.046a.5.5,0,0,0,.5-.45L14.75,4h1A.25.25,0,0,0,16,3.75v-.5A.25.25,0,0,0,15.75,3ZM5.5325,14.5a.5.5,0,0,1-.53245-.46529L5,14.034l-.5355-8a.50112.50112,0,0,1,1-.067l.5355,8a.5.5,0,0,1-.46486.53283ZM9,14a.5.5,0,0,1-1,0V6A.5.5,0,0,1,9,6ZM11,3H6V2h5Zm1,11.034a.50112.50112,0,0,1-1-.067l.5355-8a.50112.50112,0,1,1,1,.067Z" />
                                </svg>
                                <span className="spectrum-Button-label">Delete</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
