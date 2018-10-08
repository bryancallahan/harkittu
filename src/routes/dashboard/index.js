import { Link } from 'preact-router/match';
import Celebration from '../../components/Celebration';
import Button from '../../components/Button';
import { FaEllipsisV, FaCaretDown } from 'react-icons/fa';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <Link href="/workspace">Workspace</Link>
    <span style={{ display: 'inline-block', border: '1px solid red', width: '200px', height: '200px' }}>
      <Celebration defaultPartyOn /></span>
    <span style={{ display: 'inline-block', border: '1px solid red', width: '200px', height: '200px' }}>
      <Celebration defaultPartyOn /></span>
    <span style={{ display: 'inline-block', border: '1px solid red', width: '400px', height: '200px' }}>
      <Celebration defaultPartyOn /></span>
    <div style={{ display: 'inline-block', border: '1px solid red', width: '100%', height: '80px' }}>
      <Celebration defaultPartyOn /></div>


    <Button scheme="light">Other Option</Button>
    <Button scheme="primary-a">Other Option</Button>
    <Button scheme="primary-b">Other Option</Button>
    <Button>More<FaCaretDown /></Button>
    <Button scheme="primary-c">Other Option</Button>
    <Button scheme="primary-d">Other Option</Button>
    <Button scheme="primary-e">Other Option</Button>
  </div>
);

export default Dashboard;
