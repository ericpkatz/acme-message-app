import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'

const users = (state = [], action)=> {
  if(action.type === 'SET_USERS'){
    return action.users;
  }
  return state;
};

const messages = (state = [], action)=> {
  if(action.type === 'SET_MESSAGES'){
    return action.messages;
  }
  if(action.type === 'ADD_MESSAGE'){
    return [action.message, ...state];
  }
  return state;
};

const reducer = combineReducers({ auth, users, messages })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
