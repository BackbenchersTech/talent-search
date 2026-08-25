'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { CreateProfileDialog } from './CreateProfileDialog';

export const AddProfileCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    // TODO: kick off resume parsing + profile creation from the file.
    console.log('Resume file(s):', list);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        'group flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 p-4 text-center text-gray-500 transition-all',
        isDragging
          ? 'border-gray-600 bg-gray-50'
          : 'hover:border-gray-500 hover:bg-gray-50',
      )}
    >
      <input
        ref={inputRef}
        type='file'
        className='hidden'
        onChange={(event) => {
          if (event.target.files) {
            handleFiles(event.target.files);
          }
          event.target.value = '';
        }}
      />
      <span className='text-sm text-gray-600'>Upload a resume to create a profile</span>
      {!isDragging && (
        <>
          <Button
            type='button'
            onClick={() => inputRef.current?.click()}
            className='cursor-pointer'
          >
            <ArrowUpTrayIcon className='size-4' />
            Upload
          </Button>

          <CreateProfileDialog>
            <button
              type='button'
              className='cursor-pointer text-sm text-gray-600 underline-offset-2 transition-colors hover:text-gray-900 hover:underline'
            >
              or create manually
            </button>
          </CreateProfileDialog>
        </>
      )}
    </div>
  );
};
