"use client"
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { IconAdjustmentsAlt, IconClock, IconCloudComputing, IconCopyX, IconDotsVertical, IconDownload, IconFileStar, IconFileUpload, IconFolder, IconFolderOpen, IconGrid4x4, IconGridDots, IconHome, IconImageInPicture, IconLayoutGridRemove, IconList, IconPdf, IconPencil, IconPictureInPictureFilled, IconServer, IconShare, IconTextSize, IconTrash, IconUpload, IconVideo, IconProgressDown } from '@tabler/icons-react'
import { SearchIcon, Upload } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import FileUpload from '@/components/FileUpload'
import CreateFolder from '@/components/CreateFolder'
import Image from 'next/image'
import InfiniteLoader from '@/components/InfiniteLoader'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { EmptyPage } from '@/components/EmptyPage'
import ImageProcessing from '@/components/ImageProcessing'

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
  const { getToken } = useAuth() // Clerk authentication hook to get JWT token
  const [gridLayout, setgridLayout] = useState(true)
  const [folderFileData, setFolderFileData] = useState<FileFolderProps[]>([])
  const [loading, setLoading] = useState(false)
  const [getREQUEST, setGETREQUEST] = useState('http://127.0.0.1:8000/api/v1/fileFolders')
  const [hasData, setHasData] = useState(false)
  const [empty, setEmpty] = useState(false)

  const router = useRouter()

  const HandleGetAllFileFolderData = async () => {
    setHasData(false)
    setLoading(true)
    const jwtToken = await getToken()

    // GET Request that is used to fetch all the folder/file data
    axios
      .get(getREQUEST, {
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((res) => {
        console.log(res.data.status_code)
        if (res.data.status_code === 5002) {
          setEmpty(true)
        }
        else if (res.data.status_code === 5000) {
          console.log(res.data.data)
          setFolderFileData((prev) => {
            const newData = res.data.data;
            // Filter out items in newData that are already present in prev
            const uniqueNewItems = newData.filter(newItem =>
              !prev.some(prevItem => prevItem.id === newItem.id)
            );
            return [...prev, ...uniqueNewItems]
          }) // used this expression to append new data to existing state array
          // setFolderFileData(res.data.data)  // used this expression to append new data to existing state array
        }
        console.log(folderFileData)

        if (res.data.message.next_cursor != null) {
          setGETREQUEST(res.data.message.next_cursor)
          setHasData(true)
        } else {
          setHasData(false)
        }
      })
      .catch((err) => { }
      )
      .finally(() => {
        setLoading(false)
      })

  }

  useEffect(() => {
    HandleGetAllFileFolderData()
  }, [])

  return (
    <div>
      <Navbar />
      <div className='px-2 flex'>
        {/* MAIN SECTION THAT LISTS ALL THE FOLDER/FILES THAT EXISTS */}
        <div className='w-[73%] px-2 py-2 h-screen overflow-y-scroll no-scrollbar'>
          <div className='w-full flex items-center justify-between '>
            <div className='flex  gap-1'>
              <IconHome stroke={2} height={20} width={20} className='text-neutral-100' />
              <h4 className='text-neutral-100 font-sans'>Home</h4>
            </div>
            <div className='flex items-center gap-2'>
              <InputGroup>
                <InputGroupInput placeholder="Search..." className='placeholder:text-neutral-400  text-neutral-100' />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>

              {
                gridLayout ? (
                  <ButtonGroup>
                    <Button variant="outline"><IconLayoutGridRemove stroke={2} height={20} width={20} /></Button>
                    <Button onClick={() => {
                      setgridLayout(!gridLayout)
                    }}><IconList stroke={2} height={20} width={20} /></Button>
                  </ButtonGroup>
                ) : (
                  <ButtonGroup>
                    <Button onClick={() => {
                      setgridLayout(!gridLayout)
                    }}><IconLayoutGridRemove stroke={2} height={20} width={20} /></Button>
                    <Button variant="outline" ><IconList stroke={2} height={20} width={20} /></Button>
                  </ButtonGroup>
                )
              }

              <div className='border border-neutral-400 p-2 rounded-lg'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconAdjustmentsAlt stroke={2} height={20} width={20} className='text-neutral-100' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-neutral-950 text-neutral-400 border border-neutral-800" align="start">
                    <DropdownMenuLabel className='font-figtree text-neutral-100 text-lg'>Filters & Sort</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconPencil stroke={2} className='text-neutral-500' />
                        Name
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconClock stroke={2} className='text-neutral-500' />
                        Date Modified
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconTextSize stroke={2} className='text-neutral-500' />
                        File Size
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconFolder stroke={2} className='text-red-800' />
                        Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconPictureInPictureFilled stroke={2} className='text-blue-800' />
                        Images
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconPdf stroke={2} className='text-yellow-400' />
                        Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem className='text-neutral-100'>
                        <IconVideo stroke={2} className='text-green-400' />
                        Video
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className='w-full flex items-center gap-2'>
            <h3 className='font-sans text-neutral-100 text-sm'>All Items</h3>
            <span className='text-xs font-sans text-neutral-400 bg-neutral-900 px-2 py-1 rounded-lg'>{folderFileData.length}</span>
          </div>

          {/* GRID LAYOUT FOR LISTING THE FOLDER/FILES */}

          {
            gridLayout ? (
              <div className="grid grid-cols-4 gap-4 py-5 ">
                {folderFileData.map((item) => (
                  <div key={item.id} className='border border-neutral-800 rounded-lg hover:border-neutral-700 '>
                    {
                      item.isfolder ? (
                        <Link href={`/dashboard/${item.id}`}>
                          <div className='h-40 bg-zinc-900 flex items-center justify-center rounded-tl-lg rounded-tr-lg '>
                            <IconFolder stroke={2} height={90} width={90} className='text-neutral-400' />
                          </div>
                        </Link>
                      ) : (
                        <Link href={`http://localhost:3000/images/${item.id}`} >
                          <div className={`h-40 bg-zinc-900 flex items-center justify-center rounded-tl-lg rounded-tr-lg bg-[url(${item.file_url})] bg-center bg-no-repeat bg-cover`}>
                            {
                              item.upload_status == 'PENDING' || item.upload_status == 'PROCESSING' || item.upload_status == 'FAILED' ? (
                                <ImageProcessing parent='dashboard' />
                              ) : (
                                <Image src={item.file_url ? item.file_url : ''} alt={item.name} width={100} height={100} className='w-full' />

                              )
                            }
                          </div>
                        </Link>
                      )
                    }
                    <div className='flex flex-col pt-2 px-2'>
                      <div className='flex items-center justify-between pb-2'>
                        <h1 className='text-md text-neutral-100 font-figtree font-medium'>{item.name.length > 30 ? item.name.slice(0, 30) : item.name} {item.name.length > 30 ? ("...") : (" ")}</h1>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconDotsVertical stroke={2} height={20} width={20} className='text-neutral-400 hover:text-neutral-400' />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56 bg-neutral-950 text-neutral-400 border border-neutral-800" align="start">
                            <DropdownMenuLabel className='font-figtree text-neutral-100'>Details</DropdownMenuLabel>
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                Name
                                <DropdownMenuShortcut className='text-blue-600 font-bold'>Untited File</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Size
                                <DropdownMenuShortcut className='text-red-600 font-bold'>100kb</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Type
                                <DropdownMenuShortcut className='text-green-600 font-bold'>image/jpeg</DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Add To Favorite
                                <DropdownMenuShortcut>
                                  <IconFileStar stroke={2} className='text-neutral-500' />
                                </DropdownMenuShortcut>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Add To Trash
                                <DropdownMenuShortcut>
                                  <IconTrash stroke={2} className='text-neutral-500' />
                                </DropdownMenuShortcut>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>

                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 py-5">
                {folderFileData.map((item) => (
                  <div key={item.id} className='border border-neutral-800 rounded-xl hover:border-neutral-700  flex items-center w-full'>
                    {
                      item.isfolder ? (
                        <div className='w-[30%] h-44 bg-zinc-900 flex items-center justify-center rounded-tl-xl rounded-bl-xl '>
                          <Link href={`/dashboard/${item.id}`}>

                            <IconFolder stroke={2} height={90} width={90} className='text-neutral-400' />
                          </Link>

                        </div>
                      ) : (
                        <Link href={`http://localhost:3000/images/1`} className='w-[30%] h-44'>
                          <div className={`w-full h-44 bg-zinc-900 flex items-center justify-center rounded-tl-xl rounded-bl-xl bg-[url(${item?.file_url})] bg-center bg-no-repeat bg-cover`}>
                            <Image src={item.file_url ? item.file_url : ''} alt={item.name} width={100} height={100} className='w-full' />
                          </div>
                        </Link>


                      )
                    }
                    <div className='flex flex-col py-2 px-2 w-[70%]'>
                      <div className='flex items-center justify-between'>
                        <h1 className='text-lg text-neutral-100 font-figtree font-medium'>{item.name}</h1>
                        <IconDotsVertical stroke={2} height={25} width={25} className='text-neutral-400 hover:text-neutral-400' />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }

          {
            empty ? (
              <EmptyPage />
            ) : (
              <div></div>
            )
          }

          <div className='w-full flex items-center justify-center'>
            {
              hasData ? (
                <Button className='font-light' onClick={() => {
                  HandleGetAllFileFolderData()
                }}>Load More...</Button>
              ) : (
                <div></div>
              )
            }
          </div>

          {
            loading ? (
              <InfiniteLoader />
            ) : (
              <div></div>
            )
          }

        </div>



        {/* ADDITIONAL DETAILS RIGHT SECTION ALONG WITH UPLOAD OPTIONS */}
        <div className='w-[27%] px-2 py-2 flex flex-col gap-3 h-screen overflow-y-scroll no-scrollbar'>

          {/*CREATE FOLDER */}
          <CreateFolder isRoot={true} onUploadSuccess={HandleGetAllFileFolderData} />

          {/*UPLOAD OPTIONS */}
          <div className='border border-neutral-800 py-5 px-5 rounded-xl flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-neutral-800 p-2 rounded-lg '>
                <IconUpload stroke={2} height={25} width={25} className='text-neutral-400' />
              </div>
              <div>
                <h3 className='text-neutral-100 font-figtree font-bold '>Upload File</h3>
                <p className='text-neutral-400 font-sans font-light'>Drag and drop or browse</p>
              </div>
            </div>
            <div className='border-2 border-neutral-800 border-dashed rounded-xl flex flex-col justify-center items-center  p-6'>
              <div className='bg-neutral-800 p-2 rounded-full '>
                <IconFileUpload stroke={2} height={30} width={30} className='text-neutral-400' />
              </div>
              <h3 className='text-neutral-100 font-figtree font-medium'>Click to upload</h3>
              <p className='text-neutral-400 font-sans text-sm'>or drag and drop your files</p>
              <FileUpload isRoot={false} onSuccess={HandleGetAllFileFolderData} />
            </div>

          </div>


          {/* STORAGR STATUS*/}
          <div className='border border-neutral-800 py-5 px-5 rounded-xl flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-neutral-800 p-2 rounded-lg '>
                <IconServer stroke={2} height={25} width={25} className='text-neutral-400' />
              </div>
              <div>
                <h3 className='text-neutral-100 font-figtree font-bold '>Storage</h3>
                <p className='text-neutral-400 font-sans font-light'>Cloud Storage Usage</p>
              </div>

            </div>
            <div>
              <div className='border-b-2 border-neutral-800'>
                <div className='w-full h-2 bg-neutral-800 text-neutral-800 rounded-full'>
                  <div className='w-[30%] h-2 bg-neutral-100 text-neutral-800 rounded-full'></div>
                </div>
                <div className='flex items-center justify-between font-sans py-2'>
                  <h5 className='text-neutral-400'>34.5 MB used</h5>
                  <h5 className='text-neutral-100'>14.5 GB free</h5>
                </div>
              </div>

            </div>
            <div className='flex flex-wrap items-center justify-between w-full'>
              <div className='flex flex-col items-center justify-center '>
                <div className='h-2 w-2 bg-red-600 rounded-full'></div>
                <h5 className='text-neutral-400 font-sans font-light text-sm'>Images</h5>
                <h3 className='text-neutral-100 font-figtree text-lg font-bold'>1.2 GB</h3>
              </div>
              <div className='flex flex-col items-center justify-center '>
                <div className='h-2 w-2 bg-blue-600 rounded-full'></div>
                <h5 className='text-neutral-400 font-sans font-light text-sm'>Documents</h5>
                <h3 className='text-neutral-100 font-figtree text-lg font-bold'>1.2 GB</h3>
              </div>
              <div className='flex flex-col items-center justify-center '>
                <div className='h-2 w-2 bg-green-600 rounded-full'></div>
                <h5 className='text-neutral-400 font-sans font-light text-sm'>Others</h5>
                <h3 className='text-neutral-100 font-figtree text-lg font-bold'>1.2 GB</h3>
              </div>
            </div>
          </div>

          {/* RECENT UPLOADS SECTION */}
          <div className='border border-neutral-800 py-5 px-5 rounded-xl flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <div className='bg-neutral-800 p-2 rounded-lg '>
                <IconClock stroke={2} height={25} width={25} className='text-neutral-400' />
              </div>
              <div>
                <h3 className='text-neutral-100 font-figtree font-bold '>Recent Uploads</h3>
                <p className='text-neutral-400 font-sans font-light'>Last Uploaded Files</p>
              </div>
            </div>
            <div className='p-2 flex flex-col gap-2 border-t-2 border-neutral-800'>
              <div className='flex items-center gap-2'>
                <div className='bg-neutral-800 p-2 rounded-lg'>
                  <IconFileUpload stroke={2} height={20} width={20} className='text-neutral-400' />
                </div>
                <div>
                  <h3 className='text-neutral-100 font-figtree font-light'>filename</h3>
                  <p className='text-neutral-100 font-sans text-sm'>14mb <span className='text-neutral-400'>about 3 months ago</span></p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-neutral-800 p-2 rounded-lg'>
                  <IconFileUpload stroke={2} height={20} width={20} className='text-neutral-400' />
                </div>
                <div>
                  <h3 className='text-neutral-100 font-figtree font-light'>filename</h3>
                  <p className='text-neutral-100 font-sans text-sm'>14mb <span className='text-neutral-400'>about 3 months ago</span></p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-neutral-800 p-2 rounded-lg'>
                  <IconFileUpload stroke={2} height={20} width={20} className='text-neutral-400' />
                </div>
                <div>
                  <h3 className='text-neutral-100 font-figtree font-light'>filename</h3>
                  <p className='text-neutral-100 font-sans text-sm'>14mb <span className='text-neutral-400'>about 3 months ago</span></p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='bg-neutral-800 p-2 rounded-lg'>
                  <IconFileUpload stroke={2} height={20} width={20} className='text-neutral-400' />
                </div>
                <div>
                  <h3 className='text-neutral-100 font-figtree font-light'>filename</h3>
                  <p className='text-neutral-100 font-sans text-sm'>14mb <span className='text-neutral-400'>about 3 months ago</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page