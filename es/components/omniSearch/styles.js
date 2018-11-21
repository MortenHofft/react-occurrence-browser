export default {
  searchBar: {
    border: '1px solid #ddd',
    position: 'relative',
    zIndex: '50',
    borderRadius: '3px',
    '& input': {
      display: 'block',
      width: '100%',
      padding: 10,
      border: 'none'
    }
  },
  searchBarSuggest_row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '1px solid #e5ebed',
    '& >div': {
      flex: '1 0 50%',
      padding: 18
    }
  },
  searchBarSuggest_row_disabled: {
    backgroundColor: '#eee',
    color: '#8091a5',
    fontWeight: 'bold',
    '& >div': {
      padding: '12px 18px'
    }
  },
  fieldName: {
    background: '#e2e7ea',
    padding: 5,
    color: '#8091a5',
    border: '1px solid #91a3b8',
    fontWeight: 'bold'
  },
  fieldValue: {
    fontWeight: 'bold'
  },
  fieldDescription: {
    color: '#7e878c'
  },
  suggestMenu: {
    position: 'absolute',
    borderRadius: 3,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
    border: '1px solid #ddd',
    background: 'white',
    padding: '2px 0',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '60vh',
    width: '100%',
    zIndex: '998',
    '& >div': {
      padding: '5px 10px',
      ':first-of-type': {
        fontWeight: 'bold'
      }
    }
  }
};