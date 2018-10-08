import deepmerge from 'deepmerge';
import moment from 'moment';
import hash from 'object-hash';
import { Component } from 'preact';
import { FaPlus } from 'react-icons/fa';
import uuidv4 from 'uuid/v4';
import Button from '../Button';
import Item from '../Item';
import ItemDropHotSpot from '../ItemDropHotSpot';
import style from './style.less';

const initialState = {
  items: {},
};

export default class ItemList extends Component {

  static defaultProps = {
    defaultItems: {},
    celebrates: false,
    draggable: true,
    showMove: true,
    showInsert: true,
    filter: item => true,
    join: item => deepmerge({}, item),
    sort: (a, b) => a.rank > b.rank,
    minRank: Number.MIN_SAFE_INTEGER,
    maxRank: Number.MAX_SAFE_INTEGER,
    onSelectedItem: selectedItem => { },
    onUpdateItem: (previousItem, updatedItem) => { },
  };

  constructor(props) {
    super(props);
    this.state = deepmerge.all([{}, initialState, { items: props.defaultItems }]);
    this.onSelectedItem = this.onSelectedItem.bind(this);
    this.onUpdateItem = this.onUpdateItem.bind(this);
    this.onMoveItemAbove = this.onMoveItemAbove.bind(this);
    this.onMoveItemBelow = this.onMoveItemBelow.bind(this);
    this.onInsertItem = this.onInsertItem.bind(this);
  }

  onSelectedItem(selectedItem) {
    console.log(`selected "${selectedItem.detail}" which is "${selectedItem.selected}"`);
    this.props.onSelectedItem(selectedItem);
  }

  onUpdateItem(previousItem, updatedItem) {
    console.log(`updating "${previousItem.detail}" to "${(updatedItem || {}).detail}"`);

    const items = deepmerge({}, this.state.items);
    delete items[previousItem.uuid];
    if (updatedItem) {
      items[updatedItem.uuid] = updatedItem;
    }

    this.setState({ items });
    this.props.onUpdateItem(previousItem, updatedItem);
  }

  onMoveItemAbove(droppedItem, aboveItem) {
    const updatedItem = this.props.filter(droppedItem) ?
      deepmerge({}, droppedItem) : this.props.join(droppedItem);
    const sortedItems = Object.values(this.state.items).sort(this.props.sort);

    // If above item is undefined, use the first item of the sorted items...
    // Note: This could happen if our item list is empty yet we're still "draggable".
    if (!aboveItem) {
      aboveItem = sortedItems[0] || {};
    }

    // Calculate rank for dropped item...
    const rankInterval = { minRank: this.props.minRank, maxRank: aboveItem.rank || this.props.maxRank };
    sortedItems.some((item, i, arr) => {

      // Special Case: If have an empty above item of {} and the dropped item
      //  is already in this list, we should move the dropped item one above.
      if (!aboveItem.uuid && item.uuid === droppedItem.uuid) {
        const beforeBeforeItem = arr[i - 2];
        if (beforeBeforeItem) {
          rankInterval.minRank = beforeBeforeItem.rank;
        }
        const beforeItem = arr[i - 1];
        if (beforeItem) {
          rankInterval.maxRank = beforeItem.rank;
        }
        return true;
      }

      if (item.uuid === aboveItem.uuid) {
        const beforeItem = arr[i - 1];
        if (beforeItem) {
          rankInterval.minRank = beforeItem.rank;
        }
        return true;
      }
    });
    updatedItem.rank = (rankInterval.maxRank - rankInterval.minRank) / 2.0 + rankInterval.minRank;

    this.onUpdateItem(droppedItem, updatedItem);
  }

  onMoveItemBelow(droppedItem, belowItem) {
    const updatedItem = this.props.filter(droppedItem) ?
      deepmerge({}, droppedItem) : this.props.join(droppedItem);

    // Calculate rank for dropped item...
    const rankInterval = { minRank: belowItem.rank, maxRank: this.props.maxRank };
    Object.values(this.state.items).sort(this.props.sort).some((item, i, arr) => {

      // Special Case: If have an empty below item of {} and the dropped item
      //  is already in this list, we should move the dropped item one below.
      if (!belowItem.uuid && item.uuid === droppedItem.uuid) {
        const afterItem = arr[i + 1];
        if (afterItem) {
          rankInterval.minRank = afterItem.rank;
        }
        const afterAfterItem = arr[i + 2];
        if (afterAfterItem) {
          rankInterval.maxRank = afterAfterItem.rank;
        }
        return true;
      }

      if (item.uuid === belowItem.uuid) {
        const afterItem = arr[i + 1];
        if (afterItem) {
          rankInterval.maxRank = afterItem.rank;
        }
        return true;
      }
    });
    updatedItem.rank = (rankInterval.maxRank - rankInterval.minRank) / 2.0 + rankInterval.minRank;

    this.onUpdateItem(droppedItem, updatedItem);
  }

  onInsertItem() {
    this.onMoveItemAbove(this.props.join({
      uuid: uuidv4(),
      detail: 'New Item',
      created_on: moment().format(),
    }), {});
  }

  render({ celebrates, draggable, showMove, showInsert, sort }, { items }) {
    const sortedItems = Object.values(items).sort(sort);
    return (
      <div>

        {draggable && sortedItems.length < 1 && <ItemDropHotSpot onDrop={this.onMoveItemAbove} emphasized>Empty...</ItemDropHotSpot>}

        {sortedItems.map((item, i) =>
          <Item
            key={`item-${hash(item)}`}
            defaultItem={item}
            onSelectedItem={this.onSelectedItem}
            onUpdateItem={this.onUpdateItem}
            onMoveItemAbove={this.onMoveItemAbove}
            onMoveItemBelow={this.onMoveItemBelow}
            celebrates={celebrates}
            draggable={draggable}
            showMove={showMove}
            showMoveUp={i !== 0}
            showMoveDown={i !== sortedItems.length - 1}
          />
        )}

        {showInsert && <Button className={style.insertButton} onClick={this.onInsertItem} scheme="primary-a"><FaPlus />Insert</Button>}

      </div>
    );
  }
}
