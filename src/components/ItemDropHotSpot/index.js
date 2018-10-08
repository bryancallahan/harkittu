import deepmerge from 'deepmerge';
import { Component } from 'preact';
import style from './style.less';

const initialState = { item: {}, offsetHeight: 0 };

export default class ItemDropHotSpot extends Component {

  // This is a global state used by this component to maintain
  //  information about the item being dragged around (we can't
  //  use e.dataTransfer because we need info in enter/leave
  //  events). Additionally we can't use simple state here
  //  because this information needs to travel outside of
  //  components. We can only drag n' drop one item at a time
  //  with this component.
  static _dangerousGlobalState = deepmerge({}, initialState);

  static defaultProps = {
    emphasized: false,
    children: [],
    onDrop: droppedItem => { },
  };

  static onInsertionHotSpotDragEnter(e) {
    e.preventDefault(); // Required for onDrop handler
    e.target.style.height = `${ItemDropHotSpot._dangerousGlobalState.offsetHeight}px`;

    // TODO - Work on the UX here. We should probably move the item on-hover for 
    //  better feedback. Additionally user needs some sort of visual cue or "grabber"
    //  to know item can be Dragon Dropped™ in the first place. Not part of MVP
    //  unfortunately. :(
  }

  static onInsertionHotSpotDragLeave(e) {
    e.target.style.height = style.insertionHotSpotColdHeight;
  }

  static onPreventDefault = e => e.preventDefault();

  static onStartDrag(e, item, offsetHeight) {
    ItemDropHotSpot._dangerousGlobalState = { item, offsetHeight };
  }

  static onEndDrag(e) {
    ItemDropHotSpot._dangerousGlobalState = deepmerge({}, initialState);
  }

  constructor(props) {
    super(props);
    this.onInsertionHotSpotDrop = this.onInsertionHotSpotDrop.bind(this);
  }

  onInsertionHotSpotDrop(e) {
    e.target.style.height = style.insertionHotSpotColdHeight;
    this.props.onDrop(ItemDropHotSpot._dangerousGlobalState.item);
  }

  render({ emphasized }) {
    return (
      <div
        className={[
          style.insertionHotSpot,
          emphasized ? style.emphasized : null,
        ].filter(c => !!c).join(' ')}
        onDragEnter={ItemDropHotSpot.onInsertionHotSpotDragEnter}
        onDragLeave={ItemDropHotSpot.onInsertionHotSpotDragLeave}
        onDragOver={ItemDropHotSpot.onPreventDefault}  // Required for onDrop handler
        onDrop={this.onInsertionHotSpotDrop}
      >{this.props.children}</div>
    );
  }
}