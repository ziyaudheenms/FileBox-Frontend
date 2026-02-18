import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { IconFolderQuestion, IconGitPullRequest } from '@tabler/icons-react';



function NoAccess({previousURL}:{previousURL:string}) {
  return (
    <div className='w-full h-full flex items-center flex-col justify-center'>
      <div>
        <Image src={'/NoAccess.gif'} alt='You Have No Access' className='h-96 w-96' height={500} width={500} />
      </div>
      <div className='pb-4'>
        <motion.div
          animate={{
            y: [0, -15, 0], // Moves up 15px and back to start
          }}
          transition={{
            duration: 3,      // Time for one full loop
            repeat: Infinity, // Loop forever
            ease: "easeInOut" // Smooth acceleration/deceleration
          }}
        >
          <h3 className='text-3xl text-center font-bold font-sans text-neutral-100'>You Have No Access !!</h3>


        </motion.div>
        <h3 className='text-neutral-400 text-center font-figtree font-light text-lg'>Owner of the file <span className='text-blue-500'>{previousURL}</span> doesnt provided you with the access to it</h3>
      </div>
        <Button className='py-2 '><IconFolderQuestion stroke={2} className='h-20'/> Request Access</Button>
    </div>

  )
}

export default NoAccess