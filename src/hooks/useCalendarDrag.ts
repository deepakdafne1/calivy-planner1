import { useState, useCallback, useRef } from 'react';
import type { CalendarTask } from '@/types';

export type DragMode = 'move' | 'resize' | 'create' | null;

interface DragState {
  mode: DragMode;
  taskId: string | null;
  originDate: string;
  originStartHour: number;
  originStartMinute: number;
  originEndHour: number;
  originEndMinute: number;
  // Current ghost position
  currentDate: string;
  currentStartHour: number;
  currentStartMinute: number;
  currentEndHour: number;
  currentEndMinute: number;
  // For create mode
  anchorHour: number;
}

interface UseCalendarDragOptions {
  hourHeight: number;
  tasks: CalendarTask[];
  onMoveTask: (taskId: string, newDate: string, newStartHour: number, newStartMinute: number, newEndHour: number, newEndMinute: number) => void;
  onResizeTask: (taskId: string, newEndHour: number, newEndMinute: number) => void;
  onCreateRange: (date: string, startHour: number, endHour: number) => void;
}

const SNAP_MINUTES = 15;

function snapToGrid(rawMinutes: number): number {
  return Math.round(rawMinutes / SNAP_MINUTES) * SNAP_MINUTES;
}

function clampHour(h: number, m: number): [number, number] {
  if (h < 0) return [0, 0];
  if (h >= 24) return [23, 45];
  return [h, Math.max(0, Math.min(45, m))];
}

export function useCalendarDrag({
  hourHeight,
  tasks,
  onMoveTask,
  onResizeTask,
  onCreateRange,
}: UseCalendarDragOptions) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const startY = useRef(0);
  const startX = useRef(0);
  const columnsRef = useRef<HTMLDivElement[]>([]);
  const dateMapRef = useRef<string[]>([]);

  const setColumnRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) columnsRef.current[index] = el;
  }, []);

  const setDateMap = useCallback((dates: string[]) => {
    dateMapRef.current = dates;
  }, []);

  const getDateFromX = useCallback((clientX: number): string | null => {
    for (let i = 0; i < columnsRef.current.length; i++) {
      const col = columnsRef.current[i];
      if (!col) continue;
      const rect = col.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) {
        return dateMapRef.current[i] || null;
      }
    }
    return null;
  }, []);

  const getTimeFromY = useCallback((clientY: number, containerTop: number): [number, number] => {
    const relY = clientY - containerTop;
    const totalMinutes = (relY / hourHeight) * 60;
    const snapped = snapToGrid(totalMinutes);
    const h = Math.floor(snapped / 60);
    const m = snapped % 60;
    return clampHour(h, m);
  }, [hourHeight]);

  const handleTaskMouseDown = useCallback((e: React.MouseEvent, task: CalendarTask, containerTop: number) => {
    e.stopPropagation();
    e.preventDefault();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isResizeHandle = e.clientY > rect.bottom - 8;
    const mode: DragMode = isResizeHandle ? 'resize' : 'move';

    const state: DragState = {
      mode,
      taskId: task.id,
      originDate: task.date,
      originStartHour: task.startHour,
      originStartMinute: task.startMinute,
      originEndHour: task.endHour,
      originEndMinute: task.endMinute,
      currentDate: task.date,
      currentStartHour: task.startHour,
      currentStartMinute: task.startMinute,
      currentEndHour: task.endHour,
      currentEndMinute: task.endMinute,
      anchorHour: 0,
    };

    startY.current = e.clientY;
    startX.current = e.clientX;
    dragRef.current = state;
    setDragState(state);

    const handleMouseMove = (ev: MouseEvent) => {
      const current = dragRef.current;
      if (!current) return;

      if (current.mode === 'move') {
        const deltaMinutes = ((ev.clientY - startY.current) / hourHeight) * 60;
        const snappedDelta = snapToGrid(deltaMinutes);
        const origStartTotal = current.originStartHour * 60 + current.originStartMinute;
        const origEndTotal = current.originEndHour * 60 + current.originEndMinute;
        const duration = origEndTotal - origStartTotal;

        let newStartTotal = origStartTotal + snappedDelta;
        newStartTotal = Math.max(0, Math.min(24 * 60 - duration, newStartTotal));
        const newEndTotal = newStartTotal + duration;

        const newDate = getDateFromX(ev.clientX) || current.originDate;

        const updated: DragState = {
          ...current,
          currentDate: newDate,
          currentStartHour: Math.floor(newStartTotal / 60),
          currentStartMinute: newStartTotal % 60,
          currentEndHour: Math.floor(newEndTotal / 60),
          currentEndMinute: newEndTotal % 60,
        };
        dragRef.current = updated;
        setDragState(updated);
      } else if (current.mode === 'resize') {
        const deltaMinutes = ((ev.clientY - startY.current) / hourHeight) * 60;
        const snappedDelta = snapToGrid(deltaMinutes);
        const origEndTotal = current.originEndHour * 60 + current.originEndMinute;
        const origStartTotal = current.originStartHour * 60 + current.originStartMinute;

        let newEndTotal = origEndTotal + snappedDelta;
        newEndTotal = Math.max(origStartTotal + 15, Math.min(24 * 60, newEndTotal));

        const updated: DragState = {
          ...current,
          currentEndHour: Math.floor(newEndTotal / 60),
          currentEndMinute: newEndTotal % 60,
        };
        dragRef.current = updated;
        setDragState(updated);
      }
    };

    const handleMouseUp = () => {
      const final = dragRef.current;
      if (final && final.taskId) {
        if (final.mode === 'move') {
          const changed =
            final.currentDate !== final.originDate ||
            final.currentStartHour !== final.originStartHour ||
            final.currentStartMinute !== final.originStartMinute;
          if (changed) {
            onMoveTask(
              final.taskId,
              final.currentDate,
              final.currentStartHour,
              final.currentStartMinute,
              final.currentEndHour,
              final.currentEndMinute
            );
          }
        } else if (final.mode === 'resize') {
          const changed =
            final.currentEndHour !== final.originEndHour ||
            final.currentEndMinute !== final.originEndMinute;
          if (changed) {
            onResizeTask(final.taskId, final.currentEndHour, final.currentEndMinute);
          }
        }
      }

      dragRef.current = null;
      setDragState(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [hourHeight, getDateFromX, onMoveTask, onResizeTask]);

  const handleCellMouseDown = useCallback((e: React.MouseEvent, date: string, containerTop: number) => {
    const [h] = getTimeFromY(e.clientY, containerTop);

    const state: DragState = {
      mode: 'create',
      taskId: null,
      originDate: date,
      originStartHour: h,
      originStartMinute: 0,
      originEndHour: Math.min(h + 1, 24),
      originEndMinute: 0,
      currentDate: date,
      currentStartHour: h,
      currentStartMinute: 0,
      currentEndHour: Math.min(h + 1, 24),
      currentEndMinute: 0,
      anchorHour: h,
    };

    startY.current = e.clientY;
    dragRef.current = state;
    setDragState(state);

    const handleMouseMove = (ev: MouseEvent) => {
      const current = dragRef.current;
      if (!current || current.mode !== 'create') return;

      const [newH] = getTimeFromY(ev.clientY, containerTop);
      const anchor = current.anchorHour;

      const updated: DragState = {
        ...current,
        currentStartHour: Math.min(anchor, newH),
        currentStartMinute: 0,
        currentEndHour: Math.max(anchor + 1, newH + 1),
        currentEndMinute: 0,
      };
      dragRef.current = updated;
      setDragState(updated);
    };

    const handleMouseUp = () => {
      const final = dragRef.current;
      if (final && final.mode === 'create') {
        onCreateRange(final.currentDate, final.currentStartHour, final.currentEndHour);
      }
      dragRef.current = null;
      setDragState(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [hourHeight, getTimeFromY, onCreateRange]);

  return {
    dragState,
    isDragging: dragState !== null,
    handleTaskMouseDown,
    handleCellMouseDown,
    setColumnRef,
    setDateMap,
  };
}
