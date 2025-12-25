/**
 * Tests for usePersistentState hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersistentState, clearPersistedState } from './usePersistentState';

// Mock localStorage
const mockStorage = {};
const localStorageMock = {
  getItem: vi.fn((key) => mockStorage[key] ?? null),
  setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: vi.fn((key) => { delete mockStorage[key]; }),
  clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('usePersistentState', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      usePersistentState('test_key', ['default'])
    );

    expect(result.current[0]).toEqual(['default']);
  });

  it('reads existing value from localStorage', () => {
    mockStorage['test_key'] = JSON.stringify(['stored', 'value']);

    const { result } = renderHook(() =>
      usePersistentState('test_key', ['default'])
    );

    expect(result.current[0]).toEqual(['stored', 'value']);
  });

  it('writes to localStorage when state changes', () => {
    const { result } = renderHook(() =>
      usePersistentState('test_key', [])
    );

    act(() => {
      result.current[1](['new', 'value']);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test_key',
      JSON.stringify(['new', 'value'])
    );
    expect(result.current[0]).toEqual(['new', 'value']);
  });

  it('supports functional updates', () => {
    const { result } = renderHook(() =>
      usePersistentState('test_key', [1, 2])
    );

    act(() => {
      result.current[1](prev => [...prev, 3]);
    });

    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    mockStorage['test_key'] = 'not valid json';
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      usePersistentState('test_key', ['fallback'])
    );

    expect(result.current[0]).toEqual(['fallback']);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('handles objects correctly', () => {
    const { result } = renderHook(() =>
      usePersistentState('test_key', { count: 0 })
    );

    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });
    expect(mockStorage['test_key']).toBe(JSON.stringify({ count: 5 }));
  });

  it('handles primitive values', () => {
    const { result } = renderHook(() =>
      usePersistentState('test_key', 0)
    );

    act(() => {
      result.current[1](42);
    });

    expect(result.current[0]).toBe(42);
    expect(mockStorage['test_key']).toBe('42');
  });

  it('handles boolean values', () => {
    const { result } = renderHook(() =>
      usePersistentState('test_key', false)
    );

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(mockStorage['test_key']).toBe('true');
  });
});

describe('clearPersistedState', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('removes key from localStorage', () => {
    mockStorage['test_key'] = 'some value';

    clearPersistedState('test_key');

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test_key');
  });
});
