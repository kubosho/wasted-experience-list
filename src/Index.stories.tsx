import { h } from 'preact';
import { Index } from './Index';

export default {
    title: 'Index',
    component: Index,
};

const Template = (): JSX.Element => <Index />;

export const IndexComponent = Template.bind(this);
