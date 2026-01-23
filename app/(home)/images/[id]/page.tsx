'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/navbar'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { IconCopyX, IconDownload, IconHome, IconPencilCheck, IconPencilDown, IconShare, IconUser } from '@tabler/icons-react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { toast } from 'sonner'
import InfiniteLoader from '@/components/InfiniteLoader'
import ImageProcessing from '@/components/ImageProcessing'

// Custom function to get relative time based on the DATE object.
function getRelativeTime(date: Date | string | undefined): string {
    if (!date) return '';
    const now = new Date();
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (years > 0) return years === 1 ? '1 year ago' : `${years} years ago`;
    if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`;
    if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
    if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    return 'just now';
}


interface FileFolderProps {
    id: number;
    author: string;
    size: number;
    parentFolder: string | null;
    name: string;
    uploaded_at: Date;
    updated_at: Date;
    isfolder: boolean;
    is_root_folder: boolean;
    file_url: string | null;
    file_extension: string | null;
    upload_status: string;
    celery_task_ID: string | null;
    is_trash: boolean;
    is_favorite: boolean;
}


function page() {
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const [folderFileData, setFolderFileData] = useState<FileFolderProps>({} as FileFolderProps)
    const params = useParams();

    const HandleSingleImage = async () => {
        setLoading(true)
        const jwtToken = await getToken()
        axios
            .get(`http://127.0.0.1:8000/api/v1/fileFolders/Image?imageFileID=${params.id ? params.id as string : undefined}`, {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            })
            .then((res) => {
                if (res.data.status_code === 5000) {
                    toast.success('Successfully fetched the image data')
                    setFolderFileData(res.data.data)
                }
                else if (res.data.status_code === 5001) {
                    toast.error('Failed to fetch the image data')
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        HandleSingleImage()
    }, [])

    return (
        <div>
            <Navbar />
            <Link href={'/dashboard'}>
                <div className='flex  gap-1 px-4'>
                    <IconHome stroke={2} height={20} width={20} className='text-neutral-100' />
                    <h4 className='text-neutral-100 font-sans'>Home</h4>
                </div>
            </Link>
            {
                !loading ? (
                    <div className='flex w-full  h-screen overflow-y-scroll no-scrollbar py-2 px-2'>
                        {
                            folderFileData.file_url ? (
                                <div className='w-[60%] flex justify-center items-center h-full px-5 relative'>
                                    {
                                        folderFileData.upload_status == 'PENDING' || folderFileData.upload_status == 'PROCESSING' || folderFileData.upload_status == 'FAILED' ? (
                                            <ImageProcessing parent='image'/>
                                        ) : (
                                            <Image src={folderFileData?.file_url} height={500} width={500} alt='Uploaded Image in a big view' className=' w-full h-fit absolute top-0 left-0 right-0' />
                                        )
                                    }
                                </div>
                            ) :
                                <InfiniteLoader />
                        }

                        <div className='w-[40%]'>
                            <div className='w-full flex flex-col items-center justify-center gap-2 '>
                                <div className='w-[80%] h-96  flex flex-col justify-between border-2 p-4  border-neutral-800 rounded-lg'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-sans flex items-center justify-between'>
                                            <h5 className='text-neutral-400'>Name</h5>
                                            <h5 className='text-neutral-100'>{folderFileData.name}</h5>
                                        </div>
                                        <div className='font-sans flex items-center justify-between'>
                                            <h5 className='text-neutral-400'>Size</h5>
                                            <h5 className='text-neutral-100'>
                                                {(() => {
                                                    const size = folderFileData.size;
                                                    if (typeof size !== 'number' || isNaN(size)) return '';
                                                    if (size >= 1024 * 1024) {
                                                        return (size / (1024 * 1024)).toFixed(2) + ' GB';
                                                    } else if (size >= 1024) {
                                                        return (size / 1024).toFixed(2) + ' MB';
                                                    } else {
                                                        return size + ' KB';
                                                    }
                                                })()}
                                            </h5>
                                        </div>
                                        <div className='font-sans flex items-center justify-between'>
                                            <h5 className='text-neutral-400'>Uploaded At</h5>
                                            <h5 className='text-neutral-100'>{getRelativeTime(folderFileData.uploaded_at)}</h5>
                                        </div>
                                        <div className='font-sans flex items-center justify-between'>
                                            <h5 className='text-neutral-400'>Type</h5>
                                            <h5 className='text-neutral-100'>{folderFileData.file_extension}</h5>
                                        </div>
                                        {/* <div className='font-sans flex items-center justify-between'>
                                    <h5 className='text-neutral-400'>Dimensions</h5>
                                    <h5 className='text-neutral-100'>{folderFileData.dimensions}</h5>
                                </div> */}
                                    </div>

                                    <div className='w-full pb-2 pt-5 border-t-2 border-t-neutral-800'>
                                        <Button className='w-full font-figtree text-neutral-800 bg-neutral-100 font-medium text-lg hover:bg-neutral-400 hover:text-neutral-100'> <IconDownload stroke={2} height={30} width={30} className='text-lg' />Download</Button>
                                        <div className='w-full py-2 flex gap-2 font-figtree'>
                                            <Button className='w-[70%] font-figtree text-neutral-100 bg-neutral-950 font-medium border border-neutral-800 text-lg hover:bg-neutral-800 hover:text-neutral-100'> <IconShare stroke={2} />Share</Button>
                                            <Button className='w-[30%] bg-neutral-950 border border-neutral-800 hover:bg-red-600'>
                                                <IconCopyX stroke={2} className='text-red-900 ' height={30} width={30} />
                                            </Button>
                                        </div>
                                    </div>

                                </div>

                                <div className='w-[80%]  flex flex-col justify-between border-2 p-4  border-neutral-800 rounded-lg'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-sans flex flex-col gap-1'>
                                            <h5 className='text-neutral-400'>Rename</h5>
                                            <InputGroup>
                                                <InputGroupInput placeholder="Rename the file" className="text-neutral-100 w-[7000px]" />
                                                <InputGroupAddon>
                                                    <IconUser />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </div>

                                    <div className='w-full py-2'>
                                        <Button className='w-full font-figtree text-neutral-800 bg-neutral-100 font-medium text-lg hover:bg-neutral-400 hover:text-neutral-100'> <IconUser stroke={2} height={30} width={30} className='text-lg' />Rename</Button>
                                    </div>

                                </div>
                                <div className='w-[80%]  flex flex-col justify-between border-2 p-4  border-neutral-800 rounded-lg'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-sans flex flex-col gap-1'>
                                            <h5 className='text-neutral-400'>Add Description</h5>
                                            <InputGroup>
                                                <InputGroupInput placeholder="Rename the file" className="text-neutral-100 w-[7000px]" />
                                                <InputGroupAddon>
                                                    <IconPencilCheck />
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                    </div>

                                    <div className='w-full py-2'>
                                        <Button className='w-full font-figtree text-neutral-800 bg-neutral-100 font-medium text-lg hover:bg-neutral-400 hover:text-neutral-100'> <IconPencilCheck stroke={2} height={30} width={30} className='text-lg' />Rename</Button>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                ) : (
                    <InfiniteLoader />
                )
            }

        </div>
    )
}

export default page