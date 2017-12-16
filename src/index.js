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
    transform: 'translate(-50%, 10px)',
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

function App({lists, selectedList}) {
  return (
    <div>
      <div style={{textAlign: 'center', marginTop: 30}}>
        <h1>Repeat todo</h1>
      </div>
      <CenteredBox maxWidth={400}>
        <CenteredRow>
          <select value={selectedList.id} style={{flex: 1}}>
            {lists.map(l => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <SuccessButton css={{marginLeft: 20}}>Create List</SuccessButton>
        </CenteredRow>
        <hr style={{width: '100%'}} />
        <div style={{width: '100%'}}>
          <CenteredRow css={{justifyContent: 'flex-start'}}>
            <h2 style={{flex: 1}}>Fun List</h2>
            <DangerButton>Delete List</DangerButton>
          </CenteredRow>
          <CenteredRow>
            <input type="text" style={{flex: 1}} />
            <Button css={{marginLeft: 20}}>Add</Button>
          </CenteredRow>
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
                <IconButton>✅</IconButton>
                <IconButton>❌</IconButton>
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

render(
  <App lists={lists} selectedList={lists[0]} />,
  document.getElementById('root'),
)
