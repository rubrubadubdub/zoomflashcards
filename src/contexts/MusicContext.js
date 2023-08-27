import React from 'react';

const MusicContext = React.createContext({
  playMusic: () => {},
  stopMusic: () => {},
});

export default MusicContext;