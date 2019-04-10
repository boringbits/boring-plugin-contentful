

export default () => {
  const theme = {
    palette: {
      primary: {
        main: '#26418f',
      },
      secondary: {
        main: '#8e99f3',
      }
    },
    outerContainer: {
      flexGrow: 1,
      height: '100%',
      overflowY: 'auto',
      width: '100%',
      justifyContent: 'left',
      display: 'flex',
      flexWrap: 'wrap',
      boxSizing: 'border-box',
    },
  };

  return theme;
}