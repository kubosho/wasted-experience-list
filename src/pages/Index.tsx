import { h } from 'preact';

import { ItemTable } from '../components/ItemTable';
import { ItemValue } from '../wasted_experience_item/itemValue';

import '@spectrum-css/vars/dist/spectrum-global.css';
import '@spectrum-css/vars/dist/spectrum-medium.css';
import '@spectrum-css/vars/dist/spectrum-large.css';
import '@spectrum-css/vars/dist/spectrum-light.css';
import '@spectrum-css/vars/dist/spectrum-dark.css';
import '@spectrum-css/page/dist/index-vars.css';
import '@spectrum-css/typography/dist/index-vars.css';
import '@spectrum-css/icon/dist/index-vars.css';
import '@spectrum-css/button/dist/index-vars.css';
import '@spectrum-css/table/dist/index-vars.css';

type Props = {
    totalTime: string;
    itemValueList: ItemValue[];
    onDeleteItem: (index: number) => void;
    onBlurInputForm: (event: Event, index: number) => void;
    onClickAddItem: () => void;
};

export const IndexPage = ({
    totalTime,
    itemValueList,
    onDeleteItem,
    onBlurInputForm,
    onClickAddItem,
}: Props): JSX.Element => {
    return (
        <main className="spectrum-Body spectrum-Body--sizeM">
            <h1 className="spectrum-Heading spectrum-Heading--sizeL">Wasted experience list</h1>
            <p>
                <output>{totalTime}</output>
            </p>
            {itemValueList.length > 0 && (
                <ItemTable
                    itemValueList={itemValueList}
                    onDeleteItem={onDeleteItem}
                    onBlurInputForm={onBlurInputForm}
                />
            )}
            <button
                className="spectrum-Button spectrum-Button--primary spectrum-Button--sizeS"
                onClick={onClickAddItem}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18"
                    viewBox="0 0 18 18"
                    width="18"
                    className="spectrum-Icon spectrum-Icon--sizeS"
                    focusable="false"
                    aria-hidden="true"
                    aria-label="Delete"
                >
                    <path d="M14.5,8H10V3.5A.5.5,0,0,0,9.5,3h-1a.5.5,0,0,0-.5.5V8H3.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H8v4.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V10h4.5a.5.5,0,0,0,.5-.5v-1A.5.5,0,0,0,14.5,8Z" />
                </svg>
                <span className="spectrum-Button-label">Add</span>
            </button>
        </main>
    );
};
