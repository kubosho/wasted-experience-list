import { h } from 'preact';

import { ContentScripts } from '../ContentScripts';
import { createItemRepository } from '../../itemRepository';
import { createStorageWrapper } from '../../storage';

export default {
    title: 'ContentScripts',
    component: ContentScripts,
};

const storage = createStorageWrapper();
const repository = createItemRepository(storage);
const Template = (): JSX.Element => <ContentScripts repository={repository} />;

export const ContentScriptsComponent = Template.bind(this);
