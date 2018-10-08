import deepmerge from 'deepmerge';
import { Component, h } from 'preact';
import { FaArrowDown, FaArrowUp, FaPencilAlt, FaTrash } from 'react-icons/fa';
import urlParse from 'url-parse';
import Button from '../Button';
import Celebration from '../Celebration';
import Checkbox from '../Checkbox';
import ItemDropHotSpot from '../ItemDropHotSpot';
import style from './style.less';

const intialState = {
  editing: false,
  partyOn: false,
  visible: true,
  item: {},
};

// Note: Minimum data model assumed by Item items: `{ uuid: '', rank: 0, detail: '' }`.
export default class Item extends Component {

  static defaultProps = {
    defaultItem: {},
    draggable: true,
    celebrates: false,
    showMove: true,
    showMoveUp: true,
    showMoveDown: true,
    onSelectedItem: selectedItem => { },
    onUpdateItem: (previousItem, updatedItem) => { },
    onMoveItemAbove: (droppedItem, aboveItem) => { },
    onMoveItemBelow: (droppedItem, belowItem) => { },
  };

  constructor(props) {
    super(props);
    this.state = deepmerge.all([{}, intialState, { item: props.defaultItem }]);
    this.onItemStartDrag = this.onItemStartDrag.bind(this);
    this.onItemEndDrag = this.onItemEndDrag.bind(this);
    this.onSelectedItem = this.onSelectedItem.bind(this);
    this.onMoveItemAbove = this.onMoveItemAbove.bind(this);
    this.onMoveItemBelow = this.onMoveItemBelow.bind(this);
    this.onMoveItemUp = this.onMoveItemUp.bind(this);
    this.onMoveItemDown = this.onMoveItemDown.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onEditItemCancel = this.onEditItemCancel.bind(this);
    this.onSaveItem = this.onSaveItem.bind(this);
  }

  componentDidUpdate() {
    if (this.state.editing && this.textarea) {
      this.textarea.focus();
    }
  }

  onItemStartDrag(e) {
    ItemDropHotSpot.onStartDrag(e, deepmerge({}, this.state.item), e.target.offsetHeight);
  }

  onItemEndDrag(e) {
    ItemDropHotSpot.onEndDrag(e);
  }

  onSelectedItem() {
    const updatedItem = deepmerge({}, this.state.item);
    updatedItem.selected = !updatedItem.selected;
    this.setState({ item: updatedItem });
    this.props.onSelectedItem(updatedItem);
  }

  onMoveItemAbove(droppedItem) {
    this.props.onMoveItemAbove(droppedItem, deepmerge({}, this.state.item));
  }

  onMoveItemBelow(droppedItem) {
    this.props.onMoveItemBelow(droppedItem, deepmerge({}, this.state.item));
  }

  onMoveItemUp(e) {
    this.props.onMoveItemAbove(deepmerge({}, this.state.item), {});
  }

  onMoveItemDown(e) {
    this.props.onMoveItemBelow(deepmerge({}, this.state.item), {});
  }

  onEditItem(e) {
    this.setState({ editing: true });
  }

  onEditItemCancel(e) {
    this.setState({ editing: false });
  }

  onSaveItem(e) {
    const previousItem = deepmerge({}, this.state.item);

    const updatedItem = deepmerge({}, this.state.item);
    const itemEl = e.target.closest(`.${style.item}`);
    updatedItem.detail = itemEl.querySelector('textarea').value.replace(/(\r\n\t|\n|\r\t)/gm, '');
    updatedItem.completed_on = null;

    this.setState({ editing: false, item: updatedItem });
    this.props.onUpdateItem(previousItem, updatedItem);
  }

  render({ draggable, celebrates, showMove, showMoveUp, showMoveDown }, { editing, visible, item }) {

    // Enhance the plain-text description with embedded URLs...
    // TODO - Mix in some parallelism to get through the description enhancement faster.
    const enhancedDescription = item.detail.split(' ').map(word => {
      const url = urlParse(word, {});
      if (url.origin !== 'null') {
        return [h('a', { href: url.href, target: '_blank' }, word), ' '];
      }
      return `${word} `;
    });

    return (
      <div className={[
        style.item,
        editing ? style.editing : null,
        celebrates && !!item.party_on ? style.partyOn : null,
        visible ? style.visible : null,
      ].filter(c => !!c).join(' ')} data-uuid={item.uuid}>

        {draggable && <ItemDropHotSpot onDrop={this.onMoveItemAbove} />}

        <Checkbox
          className={style.checkbox}
          onClick={this.onSelectedItem}
          onDragStart={this.onItemStartDrag}
          onDragEnd={this.onItemEndDrag}
          checked={!!item.selected}
          draggable={draggable && !editing}
        >

          <textarea
            ref={textarea => { this.textarea = textarea; }}
            placeholder="Edit..."
          >{item.detail}</textarea>

          <div className={style.actions}>
            <Button className={style.saveButton} onClick={this.onSaveItem} scheme="primary-a">Save</Button>
            <Button className={style.cancelButton} onClick={this.onEditItemCancel} scheme="light">Cancel</Button>
          </div>

          <div className={style.description} onDblClick={this.onEditItem}>

            <div className={style.inlineActions}>
              {showMove && <span>
                {draggable && <Button onClick={this.onMoveItemUp} scheme="light" style={{ display: showMoveUp ? 'inline-block' : 'none' }}><FaArrowUp /></Button>}
                {draggable && <Button onClick={this.onMoveItemDown} scheme="light" style={{ display: showMoveDown ? 'inline-block' : 'none' }}><FaArrowDown /></Button>}
              </span>}
              <Button onClick={() => { this.props.onUpdateItem(item, null) }} scheme="primary-b"><FaTrash /></Button>
              <Button onClick={this.onEditItem} scheme="primary-e"><FaPencilAlt />Edit</Button>
            </div>

            {enhancedDescription}

          </div>

          {celebrates && <Celebration
            key={`celebration-${!!item.party_on}`}
            className={style.celebration}
            onClick={() => { this.props.onUpdateItem(item, deepmerge.all([{}, item, { party_on: false }])); console.log('cele click'); }}
            defaultPartyOn={!!item.party_on} />}

        </Checkbox>

        {draggable && <ItemDropHotSpot onDrop={this.onMoveItemBelow} />}

      </div>
    );
  }
}