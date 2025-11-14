'use client';

import { MagnifyingGlass } from '@/components/ui/icons/MagnifyingGlass';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ChangeEvent } from 'react';

export const Search = () => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('Search query:', e.target.value);
  };

  return (
    <InputGroup className='shadow-none w-full max-w-[500px]'>
      <InputGroupInput placeholder='Type to search' onChange={handleChange} />

      <InputGroupAddon>
        <MagnifyingGlass className='size-4' />
      </InputGroupAddon>
    </InputGroup>
  );
};
