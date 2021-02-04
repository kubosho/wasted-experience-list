import { h } from 'preact';

import { ItemTable, ItemTableProps } from '../ItemTable';

export default {
    title: 'Components',
    component: ItemTable,
    argTypes: {
        onBlurInputForm: { action: 'inputed' },
        onDeleteItem: { action: 'clicked' },
    },
};

const Template = (props: ItemTableProps): JSX.Element => <ItemTable {...props} />;

const itemValueMap = new Map();

itemValueMap.set('hash1', { name: 'Twitter', url: 'https://twitter.com/', time: 60 * 60 * 4 * 1000 });
itemValueMap.set('hash2', { name: 'Facebook', url: 'https://www.facebook.com/', time: 60 * 60 * 3 * 1000 });
itemValueMap.set('hash3', { name: 'Hatena', url: 'https://b.hatena.ne.jp/', time: 60 * 60 * 2 * 1000 });

export const ItemTableComponent = Template.bind(this, {
    itemValueMap,
    onBlurInputForm: () => {
        return;
    },
    onDeleteItem: () => {
        return;
    },
});
