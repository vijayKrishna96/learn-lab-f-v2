// components/Loader/Loader.tsx

import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="spinner">
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default Loader;
