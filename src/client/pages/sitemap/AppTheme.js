// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=26418f&secondary.color=8e99f3

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
      width: '100%',
      justifyContent: 'left',
    },
  };

  return theme;
}