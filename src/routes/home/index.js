import { h } from 'preact';
import style from './style';
import jjj from '../../assets/jjj.png';

const Home = () => (
  <div class={style.home}>
    <h1>Home</h1>
    <p>This is the Home component.</p>
    <p>Documented flow of how to test blogger in staging with screen shots (to
    hopefully help Johnathan -- https://localhost:3000/testapp/index2.html</p>
    <img src={jjj} />
  </div>
);

export default Home;
