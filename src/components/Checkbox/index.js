import { Component } from 'preact';
import style from './style.less';

export default class Checkbox extends Component {
  render({ className, onClick, onDragStart, onDragEnd, checked, draggable }) {
    return (
      <div
        className={[style.checkbox, className].filter(i => !!i).join(' ')}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        draggable={draggable}
      >
        <label>
          <input type="checkbox" onClick={onClick} checked={checked} />
          <span className={style.checkmark}></span>
        </label>
        <div>{this.props.children}</div>
      </div>
    );
  }
}