export default {
  '@global': {
    '.qtip': {
      display: 'inline-block',
      position: 'relative',
      cursor: 'pointer',
      color: '#3bb4e5',
      borderBottom: '0.05em dotted #3bb4e5',
      boxSizing: 'border-box',
      fontStyle: 'normal',
      transition: 'all .25s ease-in-out'
    },
    '.qtip:hover': {
      color: '#069',
      borderBottom: '0.05em dotted #069'
    },
    '.qtip:before': {
      content: 'attr(data-tip)',
      fontSize: 14,
      position: 'absolute',
      background: 'rgba(10, 20, 30, 0.85)',
      color: '#fff',
      lineHeight: '1.2em',
      padding: '0.5em',
      fontStyle: 'normal',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
      minWidth: 120,
      textAlign: 'center',
      opacity: '0',
      visibility: 'hidden',
      transition: 'all .3s ease-in-out',
      textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
      fontFamily: 'sans-serif',
      letterSpacing: '0',
      fontWeight: '600'
    },
    '.qtip:after': {
      width: '0',
      height: '0',
      borderStyle: 'solid',
      content: '\'\'',
      position: 'absolute',
      opacity: '0',
      visibility: 'hidden',
      transition: 'all .3s ease-in-out'
    },
    '.qtip:hover:before, .qtip:hover:after': {
      visibility: 'visible',
      opacity: '1'
    },
    '.qtip.tip-top:before': {
      top: '0',
      left: '50%',
      transform: 'translate(-50%, calc(-100% - 8px))',
      boxSizing: 'border-box',
      borderRadius: 3
    },
    '.qtip.tip-top:after': {
      borderWidth: '8px 8px 0 8px',
      borderColor: 'rgba(10, 20, 30, 0.85) transparent transparent transparent',
      top: -8,
      left: '50%',
      transform: 'translate(-50%, 0)'
    },
    '.qtip.tip-bottom:before': {
      bottom: '0',
      left: '50%',
      transform: 'translate(-50%, calc(100% + 8px))',
      boxSizing: 'border-box',
      borderRadius: 3
    },
    '.qtip.tip-bottom:after': {
      borderWidth: '0 8px 8px 8px',
      borderColor: 'transparent transparent rgba(10, 20, 30, 0.85) transparent',
      bottom: -8,
      left: '50%',
      transform: 'translate(-50%, 0)'
    },
    '.qtip.tip-left:before': {
      left: '0',
      top: '50%',
      transform: 'translate(calc(-100% - 8px), -50%)',
      boxSizing: 'border-box',
      borderRadius: 3
    },
    '.qtip.tip-left:after': {
      borderWidth: '8px 0 8px 8px',
      borderColor: 'transparent transparent transparent rgba(10, 20, 30, 0.85)',
      left: -8,
      top: '50%',
      transform: 'translate(0, -50%)'
    },
    '.qtip.tip-right:before': {
      right: '0',
      top: '50%',
      transform: 'translate(calc(100% + 8px), -50%)',
      boxSizing: 'border-box',
      borderRadius: 3
    },
    '.qtip.tip-right:after': {
      borderWidth: '8px 8px 8px 0',
      borderColor: 'transparent rgba(10, 20, 30, 0.85) transparent transparent',
      right: -8,
      top: '50%',
      transform: 'translate(0, -50%)'
    }
  }
};
