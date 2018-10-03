export default {
  '@global': {
    '.searchBar': {
      border: '1px solid #ddd',
      position: 'relative',
      zIndex: '50'
    },
    '.searchBar input': {
      display: 'block',
      width: '100%',
      padding: 10,
      border: 'none'
    },
    '.searchBarSuggest > div > div': {
      display: 'flex',
      flexDirection: 'row',
      borderBottom: '1px solid #e5ebed'
    },
    '.searchBarSuggest > div > div.disabled': {
      backgroundColor: '#eee',
      color: '#8091a5',
      fontWeight: 'bold'
    },
    '.searchBarSuggest > div > div.disabled > div': {
      padding: '12px 18px'
    },
    '.searchBarSuggest > div > div > div': {
      flex: '1 0 50%',
      padding: 18
    },
    '.searchBarSuggest > div > div .fieldName': {
      background: '#e2e7ea',
      padding: 5,
      color: '#8091a5',
      border: '1px solid #91a3b8',
      fontWeight: 'bold'
    },
    '.searchBarSuggest > div > div .fieldValue': {
      fontWeight: 'bold'
    },
    '.searchBarSuggest > div > div .fieldDescription': {
      color: '#7e878c'
    },
    '.suggestMenu': {
      position: 'absolute',
      borderRadius: 3,
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
      border: '1px solid #ddd',
      background: 'white',
      padding: '2px 0',
      fontSize: '90%',
      overflow: 'auto',
      maxHeight: '60vh',
      width: '100%',
      zIndex: '998'
    },
    '.suggestMenu > div': {
      padding: '5px 10px'
    },
    '.suggestMenu > div > div:first-of-type': {
      fontWeight: 'bold'
    }
  }
};
