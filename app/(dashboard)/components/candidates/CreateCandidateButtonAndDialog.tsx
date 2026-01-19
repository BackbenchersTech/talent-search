import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusIcon } from '@heroicons/react/24/outline';

export const CreateCandidateButtonAndDialog = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className='cursor-pointer'>
            <PlusIcon className='size-4' />
            <span>Add candidate</span>
          </Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add candidate</DialogTitle>
            <DialogDescription>
              Add a new candidate here. Click &quot;Create&quot; when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='name-1'>Name</Label>
              <Input id='name-1' name='name' placeholder='Tim Apple' />
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='email-1'>Email address</Label>
              <Input id='email-1' name='email' placeholder='tapple@gmail.com' />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' className='cursor-pointer'>
                Cancel
              </Button>
            </DialogClose>

            <Button type='submit' className='cursor-pointer'>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
