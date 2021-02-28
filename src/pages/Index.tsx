import { h } from 'preact';

import { ItemTable } from '../components/ItemTable';
import { ItemValue } from '../wasted_experience_item/itemValue';

type Props = {
    totalTime: string;
    itemValueList: ItemValue[];
    onDeleteItem: (index: number) => void;
    onBlurInputForm: (event: Event, index: number) => void;
    onKeyupInputForm: (event: KeyboardEvent, index: number) => void;
    onClickAddItem: () => void;
};

export const IndexPage = ({
    totalTime,
    itemValueList,
    onDeleteItem,
    onBlurInputForm,
    onKeyupInputForm,
    onClickAddItem,
}: Props): JSX.Element => {
    return (
        <main>
            <h1>Wasted experience list</h1>
            <p>
                <output>{totalTime}</output>
            </p>
            {itemValueList.length > 0 && (
                <ItemTable
                    itemValueList={itemValueList}
                    onDeleteItem={onDeleteItem}
                    onBlurInputForm={onBlurInputForm}
                    onKeyupInputForm={onKeyupInputForm}
                />
            )}
            <button onClick={onClickAddItem}>Add</button>
        </main>
    );
};
