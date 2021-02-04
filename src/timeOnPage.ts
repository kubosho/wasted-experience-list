import { DOMStorageLike } from './domStorageLike';
import { SECONDS } from './time';
import { STORAGE_KEY, createStorageWrapper } from './storage';
import { ItemRepository, createItemRepository } from './itemRepository';
import { ItemValue, createItemValue } from './itemValue';
import { getTabData } from './tabData';

export class TimeOnPage {
    private _repository: ItemRepository;
    private _itemValueMap: Map<string, ItemValue> | null;
    private _intervalId: number | null;

    constructor(repository: ItemRepository) {
        this._repository = repository;
        this._itemValueMap = this._repository?.getMap<ItemValue>(STORAGE_KEY);
        this._intervalId = null;
    }

    async track(tabId: number): Promise<void> {
        const tab = await getTabData(tabId);
        const pageUrl = tab.url;

        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
            return;
        }

        if (this._intervalId === null && pageUrl !== undefined) {
            this._intervalId = window.setInterval(() => {
                this._saveToRepository(pageUrl);
            }, SECONDS);
        }
    }

    private _saveToRepository(pageUrl: string): void {
        const itemValue =
            this._itemValueMap &&
            Array.from(this._itemValueMap.values()).find((itemValue) => itemValue.url === pageUrl);

        if (!(this._itemValueMap && itemValue)) {
            return;
        }

        this._itemValueMap.set(itemValue.id, createItemValue({ ...itemValue, time: (itemValue.time += SECONDS) }));

        const newMap = new Map(this._itemValueMap);
        this._repository.setMap(STORAGE_KEY, newMap);
    }
}

export function createTimeOnPage(storage?: DOMStorageLike, repository?: ItemRepository): TimeOnPage {
    const s = storage ?? createStorageWrapper();
    const r = repository ?? createItemRepository(s);

    return new TimeOnPage(r);
}
