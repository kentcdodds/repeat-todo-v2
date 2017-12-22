import 'milligram'
import React from 'react'
import {render} from 'react-dom'
import glamorous from 'glamorous'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd'

const Button = glamorous.button({
  transition: 'all .1s',
  ':hover': {
    transition: 'all .2s',
    backgroundColor: '#606c76',
    borderColor: '#606c76',
    color: '#fff',
    outline: 0,
  },
})

const SuccessButton = glamorous(Button)({
  backgroundColor: '#3BB272',
  borderColor: '#3BB272',
})

const DangerButton = glamorous(Button)({
  backgroundColor: '#FFD07B',
  borderColor: '#FFD07B',
})

const IconButton = glamorous.button({
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '1.5em',
  height: 'initial',
  margin: 6,
  padding: 0,
  transition: 'all .1s',
  lineHeight: 1,
  position: 'relative',
  '::before': {
    height: 0,
    width: 0,
    top: 0,
    left: '50%',
    transform: 'translate(-3px, 11px)',
    zIndex: -1,
    position: 'absolute',
    content: '""',
    opacity: 0,
    transition: 'all .2s',
    backgroundColor: '#aaa',
    boxShadow: '0px 0px 20px 12px #aaa',
  },
  '&:hover, &:active, &:focus': {
    backgroundColor: 'transparent',
    transform: 'scale(1.1)',
    '::before': {
      opacity: 1,
    },
  },
  ':active': {
    transform: 'scale(0.9)',
  },
})

const gappable = ({gap}) =>
  gap
    ? {
        '& > *:not(:first-child)': {
          marginLeft: gap / 2,
        },
        '& > *:not(:last-child)': {
          marginRight: gap / 2,
        },
      }
    : null
const Box = glamorous.div({display: 'flex', flexDirection: 'column'}, gappable)
const Row = glamorous.div({display: 'flex', flexDirection: 'row'}, gappable)
const center = ({maxWidth}) =>
  maxWidth
    ? {
        maxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
      }
    : {width: '100%'}
const CenteredBox = glamorous(Box)(
  {
    justifyContent: 'center',
    alignItems: 'center',
  },
  center,
)
const CenteredRow = glamorous(Row)({justifyContent: 'center'}, center)

function App({
  lists,
  selectedList,
  onCreateItem,
  onCreateList,
  onDeleteItem,
  onDeleteList,
  onCompleteItem,
  onListChange,
}) {
  return (
    <div>
      <div style={{textAlign: 'center', marginTop: 30}}>
        <h1>Repeat todo</h1>
      </div>
      <CenteredBox maxWidth={400}>
        <CenteredRow>
          <select
            value={selectedList.id}
            onChange={e => onListChange(e.target.value)}
            style={{flex: 1}}
          >
            {lists.map(l => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
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
        <hr style={{width: '100%'}} />
        <div style={{width: '100%'}}>
          <CenteredRow css={{justifyContent: 'flex-start'}}>
            <h2 style={{flex: 1}}>Fun List</h2>
            <DangerButton
              onClick={() => {
                if (
                  confirm(
                    '🔥 Uh oh... Are you sure you want to delete this list? 🔥',
                  )
                ) {
                  onDeleteList(selectedList)
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
          <div>
            {selectedList.list.map(li => (
              <Row
                gap={30}
                key={li.id}
                css={{
                  marginBottom: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton>✋</IconButton>
                <div style={{flex: 1}}>{li.value}</div>
                <IconButton onClick={() => onCompleteItem(li)}>✅</IconButton>
                <IconButton onClick={() => onDeleteItem(li)}>❌</IconButton>
              </Row>
            ))}
          </div>
        </div>
      </CenteredBox>
    </div>
  )
}

const lists = [
  {
    id: 'blah',
    name: 'Fun list',
    list: [{id: 'a', value: 'thing 1'}, {id: 'b', value: 'thing 2'}],
  },
  {
    id: 'blah2',
    name: 'Fun list 2',
    list: [
      {id: 'c', value: 'fun 1'},
      {id: 'd', value: 'fun 2'},
      {id: 'e', value: 'fun 3'},
    ],
  },
]

class AppState extends React.Component {
  state = {
    lists,
    selectedList: lists[0],
  }
  handleCreateList = name => {
    this.setState(({lists}) => {
      const newList = {
        id: name.toLowerCase(),
        name,
        list: [],
      }
      return {
        lists: [...lists, newList],
        selectedList: newList,
      }
    })
  }
  handleDeleteList = list => {
    this.setState(({lists}) => {
      const newLists = lists.filter(l => l.id !== list.id)
      return {
        lists: newLists,
        selectedList: newLists[0],
      }
    })
  }
  handleCreateItem = value => {
    this.setState(({selectedList}) => ({
      selectedList: {
        ...selectedList,
        list: [...selectedList.list, {id: value.toLowerCase(), value}],
      },
    }))
  }
  handleDeleteItem = item => {
    this.setState(({selectedList}) => ({
      selectedList: {
        ...selectedList,
        list: selectedList.list.filter(i => i.id !== item.id),
      },
    }))
  }
  handleCompleteItem = item => {
    this.setState(({selectedList}) => ({
      selectedList: {
        ...selectedList,
        list: [...selectedList.list.filter(i => i.id !== item.id), item],
      },
    }))
  }
  handleListChange = listId => {
    this.setState(({lists}) => ({
      selectedList: lists.find(l => l.id === listId),
    }))
  }
  render() {
    return (
      <App
        {...this.state}
        onCreateList={this.handleCreateList}
        onDeleteList={this.handleDeleteList}
        onCreateItem={this.handleCreateItem}
        onDeleteItem={this.handleDeleteItem}
        onCompleteItem={this.handleCompleteItem}
        onListChange={this.handleListChange}
      />
    )
  }
}

render(
  <AppState lists={lists} selectedList={lists[0]} />,
  document.getElementById('root'),
)
