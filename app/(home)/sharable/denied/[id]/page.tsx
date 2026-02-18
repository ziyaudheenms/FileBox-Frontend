'use client'
import Navbar from '@/components/navbar'
import NoAccess from '@/components/NoAccess'
import React from 'react'
import { useParams } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
function page() {
    const params = useParams();
    const searchParams = useSearchParams()
    const previousPath = searchParams.get('from')
    return (
        <div className='w-full h-full bg-black'>
            <Navbar />
            <div className=' w-full '>
                {
                    params.id == 'no-access' ? (
                        <NoAccess previousURL={previousPath || ''}/>

                    ) : (
                        <div></div>
                    )
                }
            </div>
        </div>
    )
}

export default page