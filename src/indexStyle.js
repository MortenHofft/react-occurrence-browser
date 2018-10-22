export default {
  occurrenceSearch: {
    position: 'relative',
    background: '#f2f6f9',
    height: '100%',
    color: '#2e3c43',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontSmoothing: 'antialiased',
    fontFamily: 'Open sans, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
    //fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    overflow: 'hidden',
    '& ::-webkit-scrollbar': {
      width: 6,
      height: 6
    },
    '& ::-webkit-scrollbar-track': {
      background: '#ddd'
    },
    '& ::-webkit-scrollbar-thumb': {
      background: '#888'
    },
    '& *': {
      boxSizing: 'border-box'
    },
    '& [role="button"]': {
      cursor: 'pointer',
      '&:focus': {
        outline: 'tomato'
      }
    },
    '& [tooltip-text]': {
      position: 'relative',
      cursor: 'pointer'
    },
    '& [tooltip-text]:after, [tooltip-text]:before': {
      position: 'absolute',
      visibility: 'hidden',
      opacity: '0',
      transition: 'opacity .4s ease-in-out,visibility .2s ease-in-out,transform .3s ease-in',
      transform: 'translate3d(0,0,0)',
      pointerEvents: 'none',
      bottom: '100%',
      left: '50%'
    },
    '& [tooltip-text]:hover:after, [tooltip-text]:hover:before': {
      visibility: 'visible',
      opacity: '1',
      transform: 'translateY(-12px)'
    },
    '& [tooltip-text]:before': {
      content: '""',
      border: '6px solid transparent',
      background: '0 0',
      marginLeft: -6,
      marginBottom: -12,
      borderTopColor: '#2e3c43'
    },
    '& [tooltip-text]:after': {
      content: 'attr(tooltip-text)',
      padding: 8,
      width: 120,
      backgroundColor: '#2e3c43',
      textAlign: 'center',
      font: '12px/16px \'Open Sans\'',
      color: '#fff',
      borderRadius: 3,
      marginLeft: -60
    },
    '& [tooltip-position=left]:after, [tooltip-position=left]:before': {
      right: '100%',
      bottom: '50%',
      left: 'auto'
    },
    '& [tooltip-position=left]:before': {
      marginLeft: 0,
      marginRight: -12,
      marginBottom: 0,
      borderTopColor: 'transparent',
      borderLeftColor: '#2e3c43'
    },
    '& [tooltip-position=left]:hover:after, [tooltip-position=left]:hover:before': {
      transform: 'translateX(-12px)'
    },
    '& [tooltip-position=bottom]:after, [tooltip-position=bottom]:before': {
      top: '100%',
      bottom: 'auto',
      left: '50%'
    },
    '& [tooltip-position=bottom]:before': {
      marginTop: -12,
      marginBottom: '0',
      borderTopColor: 'transparent',
      borderBottomColor: '#2e3c43'
    },
    '& [tooltip-position=bottom]:hover:after, [tooltip-position=bottom]:hover:before': {
      transform: 'translateY(12px)'
    },
    '& [tooltip-position=right]:after, [tooltip-position=right]:before': {
      bottom: '50%',
      left: '100%'
    },
    '& [tooltip-position=right]:before': {
      marginBottom: '0',
      marginLeft: -12,
      borderTopColor: 'transparent',
      borderRightColor: '#2e3c43'
    },
    '& [tooltip-position=right]:hover:after, [tooltip-position=right]:hover:before': {
      transform: 'translateX(12px)'
    },
    '& [tooltip-position=left]:before, [tooltip-position=right]:before': {
      top: 10
    },
    '& [tooltip-position=left]:after, [tooltip-position=right]:after': {
      marginLeft: '0',
      marginBottom: -16
    },
    display: 'flex',
    flexDirection: 'column'
  },
  searchBar: {
    border: '1px solid #ddd',
    position: 'relative',
    zIndex: '50',
    margin: '10px',
    '& input': {
      padding: '10px',
      display: 'block',
      width: '100%',
      border: 'none'
    }
  }
};