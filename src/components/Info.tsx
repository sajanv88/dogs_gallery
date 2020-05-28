import React from 'react';
interface InfoProps {
  msg: string;
}

const Info = ({ msg }: InfoProps): React.ReactElement => (
  <div className="text-white font-bold flex justify-center items-center h-screen">
    <span className="block text-center">{msg}</span>
  </div>
);
export default Info;
