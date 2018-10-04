export default {
  '@global': {
    '.u-ellipsis': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    '.u-upperCase': {
      textTransform: 'uppercase'
    },
    '.u-secondaryTextColor': {
      color: '#636d72'
    },
    '.u-small': {
      fontSize: 10,
      lineHeight: 14
    },
    '.u-medium': {
      fontSize: 12,
      lineHeight: 16
    },
    '.u-semibold': {
      fontWeight: '600'
    },
    '.u-actionTextColor': {
      color: '#1785fb'
    },
    '.filter': {
      background: 'white',
      marginBottom: 6,
      borderRadius: 3
    },
    '.filter .material-icons': {
      fontSize: 18
    },
    '.filter__content': {
      padding: '24px 0'
    },
    '.filter__header, .filter__info': {
      marginRight: 24,
      marginLeft: 24,
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    '.filter__header h3': {
      color: '#2e3c43',
      fontSize: 16,
      margin: '0',
      lineHeight: 22,
      fontWeight: '500'
    },
    '.filter__info dd': {
      marginRight: 24
    },
    '.filter__info dt': {
      marginRight: 5
    },
    '.filter__search': {
      marginTop: 24,
      border: '1px solid #eee',
      borderWidth: '1px 0',
      position: 'relative'
    },
    '.filter__search i': {
      position: 'absolute',
      right: 24,
      top: 14
    },
    '.filter__search input': {
      border: '1px solid transparent',
      display: 'block',
      width: '100%',
      padding: '12px 60px 12px 24px',
      fontSize: 14,
      fallbacks: [
        {
          border: 'none'
        }
      ],
      borderWidth: '1px 0'
    },
    '.filter__search input:focus': {
      outline: 'none',
      background: '#fbfbfb',
      borderBottomColor: 'deepskyblue'
    },
    '.filter__actions': {
      margin: '0px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    '.filter__actions p, .filter__actions a': {
      display: 'inline-block'
    },
    '.filter__options ul': {
      listStyle: 'none',
      margin: '0',
      padding: '0'
    },
    '.filter__options input[type="checkbox"]': {
      display: 'inline-block',
      width: '0',
      height: '0',
      margin: '0',
      padding: '0',
      position: 'absolute',
      visibility: 'hidden'
    },
    '.filter__facet': {
      marginRight: 24,
      marginLeft: 24,
      padding: '6px 0'
    },
    '.filter__facet__title': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6
    },
    '.disabled .filter__facet__title': {
      color: '#cbced0'
    },
    '.disabled .percentageBar > div': {
      background: '#dedede'
    },
    '.percentageBar': {
      borderRadius: 2,
      height: 4,
      background: '#eee'
    },
    '.percentageBar > div': {
      height: 4,
      borderRadius: 2,
      width: '50%',
      background: '#9de0ad',
      transition: 'width 0.4s linear'
    }
  }
};
