import { Component } from 'preact';
import { Router } from 'preact-router';
// Code-splitting is automated for routes
// import Home from '../routes/home';
// import Profile from '../routes/profile';
// import Header from './header';
import Dashboard from '../routes/dashboard';
import Workspace from '../routes/workspace';


export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  // render() {
  //   return (
  //     <div>
  //       <Header />
  //       <Router onChange={this.handleRoute}>
  //         <Home path="/" />
  //         <Profile path="/profile/" user="me" />
  //         <Profile path="/profile/:user" />
  //       </Router>
  //     </div>
  //   );
  // }

  render() {
    return (
      <Router onChange={this.handleRoute}>
        <Dashboard path="/" />
        <Workspace path="/workspace" />
      </Router>
    );
  }
}
