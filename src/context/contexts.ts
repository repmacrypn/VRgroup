import React from 'react'

export const FilterContext = React.createContext<number | null>(null)
export const UserNameContext = React.createContext<((e: React.MouseEvent<HTMLElement>, userId: string) => void) | null>(null)