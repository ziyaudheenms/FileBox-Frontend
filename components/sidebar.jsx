import Image from 'next/image'
import React from 'react'
import { IconFile } from '@tabler/icons-react';
function SideBar() {
  return (
    <div className='bg-amber-400 w-[15%] h-screen'>
      <div>
        <div >
          hello
          <IconFile stroke={2} />
        </div>
      </div>
    </div>
  )
}

export default SideBar