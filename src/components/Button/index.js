import { Component, h } from 'preact';
import s from './style.less';

export default class Button extends Component {

  static defaultProps = {
    className: null,
    style: {},
    scheme: null,
    onClick: (e) => { },
  };

  render({ className, style, scheme, onClick }) {
    return <button
      className={
        [
          s.btn,
          scheme === 'light' ? s.light : null,
          scheme === 'primary-a' ? s.primaryA : null,
          scheme === 'primary-b' ? s.primaryB : null,
          scheme === 'primary-c' ? s.primaryC : null,
          scheme === 'primary-d' ? s.primaryD : null,
          scheme === 'primary-e' ? s.primaryE : null,
          className,
        ].filter(c => !!c).join(' ')
      }
      style={style}
      onClick={onClick}
    >
      {this.props.children.map(elem => {
        if (typeof elem === 'string') {
          return h('span', null, elem);
        }
        return elem;
      })}
    </button>;
  }
}