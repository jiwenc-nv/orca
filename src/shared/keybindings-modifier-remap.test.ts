import { describe, expect, it } from 'vitest'
import { formatKeybinding, formatKeybindingList } from './keybindings'

describe('formatKeybinding with the Ctrl/Cmd remap', () => {
  it('shows the physical key, inverting the glyphs bindings are stored against', () => {
    // Mod resolves to Cmd on darwin, but with the swap the user physically presses Ctrl.
    expect(formatKeybinding('Mod+P', 'darwin', { swapCtrlCmd: true })).toEqual(['⌃', 'P'])
    expect(formatKeybinding('Cmd+P', 'darwin', { swapCtrlCmd: true })).toEqual(['⌃', 'P'])
    expect(formatKeybinding('Ctrl+Tab', 'darwin', { swapCtrlCmd: true })).toEqual(['⌘', 'Tab'])
  })

  it('leaves labels alone when the remap is off', () => {
    expect(formatKeybinding('Mod+P', 'darwin')).toEqual(['⌘', 'P'])
    expect(formatKeybinding('Mod+P', 'darwin', { swapCtrlCmd: false })).toEqual(['⌘', 'P'])
    expect(formatKeybinding('Ctrl+Tab', 'darwin')).toEqual(['⌃', 'Tab'])
  })

  it('ignores the remap off darwin, where the swap never applies', () => {
    expect(formatKeybinding('Mod+P', 'linux', { swapCtrlCmd: true })).toEqual(['Ctrl', 'P'])
    expect(formatKeybinding('Cmd+P', 'win32', { swapCtrlCmd: true })).toEqual(['Cmd', 'P'])
  })

  it('does not disturb Alt and Shift', () => {
    expect(formatKeybinding('Mod+Alt+Shift+A', 'darwin', { swapCtrlCmd: true })).toEqual([
      '⌃',
      '⌥',
      '⇧',
      'A'
    ])
  })

  it('inverts double-tap glyphs too', () => {
    expect(formatKeybinding('DoubleTap+Mod', 'darwin', { swapCtrlCmd: true })).toEqual(['⌃', '⌃'])
    expect(formatKeybinding('DoubleTap+Ctrl', 'darwin', { swapCtrlCmd: true })).toEqual(['⌘', '⌘'])
  })

  it('threads the option through formatKeybindingList', () => {
    expect(formatKeybindingList(['Mod+P'], 'darwin', { swapCtrlCmd: true })).toBe('⌃P')
    expect(formatKeybindingList(['Mod+P'], 'darwin')).toBe('⌘P')
  })
})
