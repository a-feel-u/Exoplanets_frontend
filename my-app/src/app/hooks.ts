import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';

import type { RootState, AppDispatch } from './store';

// Типизированный dispatch
export const useAppDispatch = () =>
  useDispatch<AppDispatch>();

// Типизированный selector
export const useAppSelector: TypedUseSelectorHook<RootState> =
  useSelector;