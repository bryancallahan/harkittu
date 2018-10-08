import deepmerge from 'deepmerge';
import { Component } from 'preact';
import Animator from './animator';
import Confetti from './confetti';
import style from './style.less';

const intialState = {
  partyOn: false,
};

export default class Celebration extends Component {

  static defaultProps = {
    defaultPartyOn: false,
    onClick: () => { },
  };

  constructor(props) {
    super(props);
    this.state = deepmerge.all([{}, intialState, { partyOn: props.defaultPartyOn }]);
    this.onClick = this.onClick.bind(this);
  }

  onStart() {
    this.animator = new Animator(this.canvas, Confetti,
      () => ([this.celebration.offsetWidth, this.celebration.offsetHeight]));
    this.animator.start();
  }

  onStop() {
    if (this.animator) {
      this.animator.stop();
      this.animator = null;
    }
  }

  componentDidMount() {
    if (this.state.partyOn) {
      this.onStart();
    }
  }

  componentDidUpdate({ }, previousState) {

    // If we're turning off the party...
    if (previousState.partyOn && !this.state.partyOn) {
      this.onStop();
    }

    // If we're turning on the party...
    if (!previousState.partyOn && this.state.partyOn) {
      this.onStart();
    }
  }

  componentWillUnmount() {
    this.onStop();
  }

  onClick() {
    this.setState({ partyOn: false });
    this.props.onClick();
  }

  render({ className }, { partyOn }) {
    return (
      <div
        ref={celebration => this.celebration = celebration}
        className={[
          style.celebration,
          partyOn ? style.animating : '',
          className,
        ].filter(c => !!c).join(' ')}
        onClick={this.onClick}
      >
        <canvas ref={canvas => this.canvas = canvas} className={style.canvas} />
      </div>
    );
  }
}