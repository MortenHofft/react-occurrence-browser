export default {
  '@global': {
    '.modal, .modal_backdrop': {
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      transition: 'opacity 500ms ease-in'
    },
    '.modal': {
      zIndex: '1000'
    },
    '.modal_backdrop': {
      background: 'rgba(0, 0, 0, 0.5)',
      animation: 'fadein 100ms'
    },
    '.modal_contentWrapper': {
      animation: 'fadein 0.3s',
      width: 630,
      maxWidth: '100%',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    },
    '.modal_card': {
      boxShadow: '0 0 15px 10px rgba(0, 0, 0, 0.1)',
      background: 'white',
      maxHeight: 'calc(100% - 100px)',
      animation: 'slideDown 0.3s',
      transform: 'translateY(0%)'
    },
    '@keyframes fadein': {
      from: {
        opacity: '0'
      },
      to: {
        opacity: '1'
      }
    },
    '@keyframes slideDown': {
      from: {
        transform: 'translateY(-20%)'
      },
      to: {
        transform: 'translateY(0%)'
      }
    }
  }
};
