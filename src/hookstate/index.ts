/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { hookstate, State } from "@hookstate/core";

type StoreMeta = {
  [index: string]: StoreListMeta;
};

type StoreListMeta = { itemAdded: number; itemUpdated: number };

export class Model {
  change = 0;
  percentage = 0;
  symbol = "";
  description = "";
  exchange = "";
  lastTradePrice = 0;
}

export class StoreList {
  list: State<Model, object>[] = [];
  meta: State<StoreListMeta>;

  constructor(listMeta: State<StoreListMeta>) {
    this.meta = listMeta;
  }
}

export class Store {
  static metaState = hookstate<StoreMeta>({});
  state = hookstate({} as { [index: string]: Model });
  groupMap = new Map<string, StoreList>();

  getGroup(groupKey: string) {
    const hasGroup = this.groupMap.has(groupKey);

    if (!hasGroup) {
      Store.metaState
        .nested(groupKey)
        .set({ itemAdded: Date.now(), itemUpdated: Date.now() });
      const groupMeta = Store.metaState.nested(groupKey);
      this.groupMap.set(groupKey, new StoreList(groupMeta));
    }

    return this.groupMap.get(groupKey)!;
  }

  addItem(groupKey: string, uniqueKey: string, value: any) {
    this.state.nested(uniqueKey).set(value);
    const storeItem = this.getGroup(groupKey);

    // Add the item to store item array
    storeItem.list = [...(storeItem.list ?? []), this.getItem(uniqueKey)];

    // Update the last updated timestamp
    storeItem.meta.itemAdded.set(Date.now());

    // Update the data
    setInterval(() => {
      this.updateItemPath(
        uniqueKey,
        "change",
        (item: any) => item + 1,
        groupKey
      );
    }, 1000);
  }

  addItemToGroup(groupKey: string, value: State<Model, object>) {
    const group = this.getGroup(groupKey);
    group.list.push(value);
    group.meta.itemAdded.set(Date.now());
  }

  getItem(uniqueKey: string) {
    return this.state.nested(uniqueKey);
  }

  updateItemPath(
    uniqueKey: string,
    path: string,
    value: any,
    groupKey: string
  ) {
    const item = this.getItem(uniqueKey);
    path
      .split(".")
      .reduce((acc: any, key: string, index: number, arr: string[]) => {
        if (index === arr.length - 1) {
          acc[key].set(value);
        }
        return acc[key];
      }, item);

    this.getGroup(groupKey).meta.itemUpdated.set(Date.now());
  }

  updateItem(uniqueKey: string, value: any) {
    this.state.nested(uniqueKey).set(value);
    this.getGroup(uniqueKey).meta.itemUpdated.set(Date.now());
  }
}
