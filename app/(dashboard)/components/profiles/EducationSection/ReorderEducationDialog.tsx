'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { reorderProfileEducation } from '@/lib/data/profiles/actions';
import { DEGREE_LABELS, Education } from '@/lib/data/education/educationTypes';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  Modifier,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars2Icon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

const educationCredential = (education: Education) =>
  [DEGREE_LABELS[education.degree], education.fieldOfStudy].filter(Boolean).join(' · ');

// Flat single-line label for screen reader announcements.
const educationLabel = (education: Education) =>
  [education.school, educationCredential(education)].filter(Boolean).join(', ');

const MOVE_UP_LABEL = 'Move up';
const MOVE_DOWN_LABEL = 'Move down';
const DRAG_LABEL = 'Drag to reorder';

// The list is vertical-only — zero out horizontal movement so a dragged row
// can't extend past the dialog edge and open up horizontal scroll.
const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

interface SortableEducationRowProps {
  education: Education;
  position: number;
  total: number;
  onMove: (educationId: string, direction: -1 | 1) => void;
}

const SortableEducationRow = ({
  education,
  position,
  total,
  onMove,
}: SortableEducationRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: education.id });

  const isFirst = position === 0;
  const isLast = position === total - 1;
  const credential = educationCredential(education);

  return (
    <li
      ref={setNodeRef}
      // Translate only — the full Transform includes scaleY compensation that
      // stretches/squishes rows of different heights while dragging.
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className='flex items-center justify-between gap-2 rounded-md px-1 py-1.5'
    >
      <div>
        <p className='font-medium text-black'>{education.school || credential}</p>
        {education.school && <p className='text-sm text-gray-600'>{credential}</p>}
      </div>

      <div className='flex shrink-0 items-center gap-1'>
        <Button
          variant='ghost'
          size='icon-sm'
          className='text-gray-400 hover:text-gray-600'
          onClick={() => onMove(education.id, -1)}
          disabled={isFirst}
          aria-label={MOVE_UP_LABEL}
          title={MOVE_UP_LABEL}
        >
          <ChevronUpIcon className='size-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon-sm'
          className='text-gray-400 hover:text-gray-600'
          onClick={() => onMove(education.id, 1)}
          disabled={isLast}
          aria-label={MOVE_DOWN_LABEL}
          title={MOVE_DOWN_LABEL}
        >
          <ChevronDownIcon className='size-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon-sm'
          className='cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing'
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={DRAG_LABEL}
          title={DRAG_LABEL}
        >
          <Bars2Icon className='size-4' />
        </Button>
      </div>
    </li>
  );
};

interface ReorderEducationDialogProps {
  profileId: string;
  education: Education[];
  onClose: () => void;
}

export const ReorderEducationDialog = ({
  profileId,
  education,
  onClose,
}: ReorderEducationDialogProps) => {
  const [orderedIds, setOrderedIds] = useState<string[]>(() =>
    education.map((edu) => edu.id),
  );
  const [announcement, setAnnouncement] = useState('');
  const [isSaving, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const labelById = new Map(education.map((edu) => [edu.id, educationLabel(edu)]));
  const educationById = new Map(education.map((edu) => [edu.id, edu]));

  // Reads the next order (not the stale render closure) so the screen reader
  // announcement matches what the user just did.
  const applyMove = (updater: (current: string[]) => string[], movedId: string) => {
    setOrderedIds((current) => {
      const next = updater(current);
      const position = next.indexOf(movedId) + 1;
      setAnnouncement(
        `Moved ${labelById.get(movedId)} to position ${position} of ${next.length}`,
      );
      return next;
    });
  };

  const move = (educationId: string, direction: -1 | 1) => {
    applyMove((current) => {
      const from = current.indexOf(educationId);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= current.length) {
        return current;
      }
      return arrayMove(current, from, to);
    }, educationId);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    applyMove(
      (current) =>
        arrayMove(
          current,
          current.indexOf(String(active.id)),
          current.indexOf(String(over.id)),
        ),
      String(active.id),
    );
  };

  const save = () => {
    startTransition(async () => {
      const result = await reorderProfileEducation(profileId, orderedIds);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      onClose();
      toast.success('Education order saved');
    });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Reorder education</DialogTitle>
          <DialogDescription>
            Drag the handles, or use the arrow buttons, to change the order.
          </DialogDescription>
        </DialogHeader>

        <p aria-live='polite' className='sr-only'>
          {announcement}
        </p>

        <ul className='max-h-[50vh] overflow-y-auto'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
              {orderedIds.map((id, index) => (
                <SortableEducationRow
                  key={id}
                  education={educationById.get(id)!}
                  position={index}
                  total={orderedIds.length}
                  onMove={move}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>

          <Button onClick={save} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
