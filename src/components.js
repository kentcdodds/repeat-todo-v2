import glamorous from 'glamorous'

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

export {
  Box,
  Row,
  CenteredRow,
  CenteredBox,
  Button,
  IconButton,
  SuccessButton,
  DangerButton,
}
