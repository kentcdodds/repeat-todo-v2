import 'milligram'
import React from 'react'
import {render} from 'react-dom'
import glamorous from 'glamorous'
import {Motion, spring} from 'react-motion'
import firebase from './firebase'
import {
  Row,
  CenteredRow,
  CenteredBox,
  Button,
  IconButton,
  SuccessButton,
  DangerButton,
} from './components'

function Lists({
  lists,
  selectedListId,
  onCreateItem,
  onCreateList,
  onDeleteItem,
  onDeleteList,
  onCompleteItem,
  onListChange,
}) {
  const selectedList = lists[selectedListId]
  return (
    <div style={{width: '100%'}}>
      <CenteredRow>
        {Object.keys(lists).length ? (
          <select
            value={selectedListId || undefined}
            onChange={e => onListChange(e.target.value)}
            style={{flex: 1}}
          >
            {Object.entries(lists).map(([id, {name}]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        ) : null}
        <SuccessButton
          css={{marginLeft: 20}}
          onClick={() => {
            const result = prompt(
              'Hi friend! 👋 So, what is the name of your new list?',
            )
            if (result) {
              onCreateList(result)
            }
          }}
        >
          Create List
        </SuccessButton>
      </CenteredRow>
      {selectedList ? (
        <React.Fragment>
          <hr style={{width: '100%'}} />
          <div style={{width: '100%'}}>
            <CenteredRow css={{justifyContent: 'flex-start'}}>
              <h2 style={{flex: 1}}>{selectedList.name}</h2>
              <DangerButton
                onClick={() => {
                  if (
                    confirm(
                      '🔥 Uh oh... Are you sure you want to delete this list? 🔥',
                    )
                  ) {
                    onDeleteList(selectedListId)
                  }
                }}
              >
                Delete List
              </DangerButton>
            </CenteredRow>
            <form
              onSubmit={e => {
                e.preventDefault()
                const input = e.target.elements.value
                onCreateItem(input.value)
                input.value = ''
              }}
            >
              <CenteredRow>
                <input type="text" name="value" style={{flex: 1}} />
                <Button type="submit" css={{marginLeft: 20}}>
                  Add
                </Button>
              </CenteredRow>
            </form>
            <div style={{position: 'relative'}}>
              {selectedList && selectedList.items ? (
                Object.entries(selectedList.items)
                  .sort(([, a], [, b]) => (a.order > b.order ? 1 : -1))
                  .map(([id, {value}], index) => (
                    <Motion key={id} style={{top: spring(index * 45)}}>
                      {val => (
                        <div
                          style={{
                            ...val,
                            position: 'absolute',
                            left: 0,
                            right: 0,
                          }}
                        >
                          <hr style={{margin: 8}} />
                          <Row
                            gap={30}
                            css={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            {/* TODO: <IconButton>✋</IconButton>*/}
                            <div style={{flex: 1}}>{value}</div>
                            <IconButton
                              onClick={e => {
                                e.target.blur()
                                onCompleteItem(id)
                              }}
                            >
                              ✅
                            </IconButton>
                            <IconButton
                              onClick={e => {
                                e.target.blur()
                                if (
                                  confirm(
                                    '🚨 Hey! Are you sure you wanna delete that TODO? 🚨',
                                  )
                                ) {
                                  onDeleteItem(id)
                                }
                              }}
                            >
                              ❌
                            </IconButton>
                          </Row>
                        </div>
                      )}
                    </Motion>
                  ))
              ) : null}
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  )
}

class Login extends React.Component {
  state = {user: null, error: null}
  auth = firebase.auth()
  login = ({email, password}) => {
    this.auth.signInWithEmailAndPassword(email, password).catch(error => {
      this.setState({error: error.message})
    })
  }
  signup = ({email, password}) => {
    this.auth.createUserWithEmailAndPassword(email, password).catch(error => {
      this.setState({error: error.message})
    })
  }
  logout = () => {
    this.auth.signOut()
  }
  componentDidMount() {
    this.unsubscribe = this.auth.onAuthStateChanged(user => {
      this.setState({user, error: null})
    })
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  render() {
    return this.props.render({
      ...this.state,
      login: this.login,
      signup: this.signup,
      logout: this.logout,
    })
  }
}

class LoginForm extends React.Component {
  handleSignup = () => {
    this.props.signup({
      email: this.form.elements.email.value,
      password: this.form.elements.password.value,
    })
  }
  handleLogin = () => {
    this.props.login({
      email: this.form.elements.email.value,
      password: this.form.elements.password.value,
    })
  }
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault()
          this.handleLogin()
        }}
        ref={n => (this.form = n)}
      >
        <CenteredRow gap={20}>
          <label>
            Email: <input type="email" name="email" />
          </label>
          <label>
            Password: <input type="password" name="password" />
          </label>
        </CenteredRow>
        <CenteredRow css={{justifyContent: 'space-between'}}>
          <Button type="submit">Sign In</Button>
          <SuccessButton onClick={this.handleSignup}>Sign Up</SuccessButton>
        </CenteredRow>
      </form>
    )
  }
}

class FirebaseData extends React.Component {
  database = firebase.database()
  state = {
    lists: {},
    selectedListId: null,
  }
  getRef(path = '') {
    return this.database.ref(`lists/${this.props.user.uid}${path}`)
  }
  componentDidMount() {
    this.unsubscribe = this.getRef().on('value', snapshot => {
      if (!snapshot) {
        return
      }
      const lists = snapshot.val()
      if (!lists) {
        return
      }
      const firstItemId = Object.keys(lists)[0]
      this.setState(({selectedListId}) => ({
        lists,
        selectedListId: lists[selectedListId] ? selectedListId : firstItemId,
      }))
    })
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  handleCreateList = name => {
    this.getRef()
      .push()
      .set({
        name,
        list: {},
      })
  }
  handleDeleteList = listId => {
    this.getRef(`/${listId}`).remove()
  }
  handleCreateItem = value => {
    const {items} = this.state.lists[this.state.selectedListId]
    const {key} = this.getRef(`/${this.state.selectedListId}/items`).push()
    const newItem = {value, order: -2}
    const newItems = reorderItems({...items, [key]: newItem}, newItem, -2)
    this.getRef(`/${this.state.selectedListId}/items`).set(newItems)
  }
  handleDeleteItem = itemId => {
    const {items} = this.state.lists[this.state.selectedListId]
    const itemToRemove = items[itemId]
    const newItems = reorderItems(items, itemToRemove)
    this.getRef(`/${this.state.selectedListId}/items`).set(newItems)
  }
  handleCompleteItem = itemId => {
    const {items} = this.state.lists[this.state.selectedListId]
    const completeItem = items[itemId]
    const newItems = reorderItems(
      items,
      completeItem,
      Object.keys(items).length - 1,
    )
    this.getRef(`/${this.state.selectedListId}/items`).set(newItems)
  }
  handleListChange = listId => {
    this.setState({selectedListId: listId})
  }
  render() {
    return this.props.render({
      ...this.state,
      onCreateList: this.handleCreateList,
      onDeleteList: this.handleDeleteList,
      onCreateItem: this.handleCreateItem,
      onDeleteItem: this.handleDeleteItem,
      onListChange: this.handleListChange,
      onCompleteItem: this.handleCompleteItem,
    })
  }
}

function reorderItems(items, itemToMove, locationToMove) {
  return Object.entries(items)
    .reduce((all, [id, item]) => {
      const order =
        item === itemToMove
          ? locationToMove
          : itemToMove.order > item.order ? item.order : item.order - 1
      if (order === undefined) {
        // we're removing it
        return all
      }
      all.push([
        id,
        {
          ...item,
          order,
        },
      ])
      return all
    }, [])
    .sort(([, a], [, b]) => (a.order > b.order ? 1 : -1))
    .reduce((all, [id, item], order) => {
      all[id] = {
        ...item,
        order,
      }
      console.log({all})
      return all
    }, {})
}

function App() {
  return (
    <Login
      render={({user, login, signup, error, logout}) => (
        <div>
          <CenteredRow
            gap={10}
            css={{
              textAlign: 'center',
              marginTop: 30,
              marginBottom: 30,
              alignItems: 'center',
            }}
          >
            <h1 style={{marginBottom: 0}}>Repeat todo</h1>
            {user ? (
              <div>
                <div style={{fontSize: '0.8em'}}>{user.email}</div>
                <div>
                  <IconButton onClick={logout}>🚪</IconButton>
                </div>
              </div>
            ) : null}
          </CenteredRow>
          <CenteredBox
            css={{width: 400, marginLeft: 'auto', marginRight: 'auto'}}
          >
            {error ? <div>Error: {error}</div> : null}
            {user ? (
              <FirebaseData
                user={user}
                render={firebaseData => <Lists {...firebaseData} />}
              />
            ) : (
              <LoginForm login={login} signup={signup} />
            )}
          </CenteredBox>
        </div>
      )}
    />
  )
}

render(<App />, document.getElementById('root'))
/* eslint no-restricted-globals: "off" */
