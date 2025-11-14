'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChangeEvent } from 'react';

export const Search = () => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('Search query:', e.target.value);
  };

  return (
    <InputGroup className='shadow-none w-full max-w-[500px]'>
      <InputGroupInput placeholder='Type to search' onChange={handleChange} />

      <InputGroupAddon>
        <MagnifyingGlassIcon className='size-4' />
      </InputGroupAddon>
    </InputGroup>
  );
};
