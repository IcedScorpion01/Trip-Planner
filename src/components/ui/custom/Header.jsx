import React from 'react';
import { Button } from '../button';

function Header() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
        <div className='flex items-center space-x-3'>
        <img src='/logo.svg'/>
        <h1 className='font-bold items-start'>Fixizl</h1>
        </div> 
      <div>
        <Button>Sign In</Button>
      </div>
    </div>
  );
}

export default Header;
