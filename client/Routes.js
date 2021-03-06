import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import {me} from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
    window.socket.on('action', (action)=> {
      this.props.dispatch(action);
    });
  }
  componentDidUpdate(prevProps){
    if(!prevProps.isLoggedIn && this.props.isLoggedIn){
      this.props.loadUsers();
      this.props.loadMessages();
      window.socket.emit('auth', this.props.auth);
    }

  }
  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={ Login } />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
    auth: state.auth
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    },
    loadUsers: async()=> {
      const response = await fetch('/api/users');
      const users = await response.json();
      dispatch({ type: 'SET_USERS', users});
    },
    loadMessages: async()=> {
      const response = await fetch('/api/messages', {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const messages = await response.json();
      dispatch({ type: 'SET_MESSAGES', messages});
    },
    dispatch: (action)=> dispatch(action) 
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
