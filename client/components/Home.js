import React, { useState } from 'react'
import {connect} from 'react-redux'

/**
 * COMPONENT
 */
export const Home = props => {
  const {auth, username, users, messages, sendMessage} = props
  const [toId, setToId] = useState('');
  const [text, setText] = useState('');


  return (
    <div>
      <h3>Welcome, {username}</h3>
      <div id='chat'>
        <div>
          <form className='message-form' onSubmit={ async(ev)=> { 
            ev.preventDefault();
            await sendMessage({ text, toId });
            setToId('');
            setText('');
          }}>
            <select value={ toId } onChange={ ev => setToId(ev.target.value)}>
              <option value=''>-- to --</option>
              {
                users.map( user => {
                  return (
                    <option value={ user.id } key={ user.id }>{ user.username }</option>
                  );
                })
              }
            </select>
            <input value={ text } onChange={ev => setText(ev.target.value)} />
            <button disabled={ !toId }>Chat</button>
          </form>
        </div>
        <div>
          <h2>Messages ({ messages.length })</h2>
          <ul className='messages'>
              {
                messages.map( message => {
                  return (
                    <li key={ message.id }>
                      <div>{ message.text } from <span>{ message.fromId === auth.id ? 'me' : message.from.username }</span> to <span>{ message.toId === auth.id ? 'me' : message.to.username }</span></div>
                    </li>
                  );
                })
              }

          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    username: state.auth.username,
    users: state.users.filter( user => user.id !== state.auth.id),
    messages: state.messages,
    auth: state.auth
  }
}

const mapDispatch = dispatch => {
  return {
    sendMessage: async({ text, toId})=> {
      const response = await fetch('/api/messages', {
        body: JSON.stringify({ text, toId }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: window.localStorage.getItem('token')
        }
      });
      dispatch({ type: 'ADD_MESSAGE', message: await response.json()});
    }
  }
}

export default connect(mapState, mapDispatch)(Home)
