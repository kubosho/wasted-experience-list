import { h } from 'preact';

import { Index } from '../Index';
import { createItemRepository } from '../itemRepository';
import { createStorageWrapper } from '../storage';

export default {
    title: 'Index',
    component: Index,
};

const storage = createStorageWrapper();
const repository = createItemRepository(storage);
const Template = (): JSX.Element => <Index repository={repository} />;

export const IndexComponent = Template.bind(this);
