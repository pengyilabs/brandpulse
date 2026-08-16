import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

export interface StoredBrandKit {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  headingFont: string
  bodyFont: string
  source: 'audit' | 'manual'
  createdAt: string
  tagline: string
  voiceToneDescriptors: string[]
}

export interface StoredWriterProfile {
  id: string
  name: string
  tone: string
  level: string
  description: string
  audiencePersona: string
  writingStyles: string[]
  source: 'audit' | 'manual'
  createdAt: string
}

interface AuditAssetContextType {
  brandKits: StoredBrandKit[]
  writerProfiles: StoredWriterProfile[]
  addBrandKit: (kit: Omit<StoredBrandKit, 'id' | 'createdAt' | 'source'>) => StoredBrandKit
  addWriterProfile: (profile: Omit<StoredWriterProfile, 'id' | 'createdAt' | 'source'>) => StoredWriterProfile
  removeBrandKit: (id: string) => void
  removeWriterProfile: (id: string) => void
}

const AuditAssetContext = createContext<AuditAssetContextType | null>(null)

const STORAGE_KEY_BRAND_KITS = 'brandpulse.audit.brandKits'
const STORAGE_KEY_WRITER_PROFILES = 'brandpulse.audit.writerProfiles'

function loadFromStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return []
}

function saveToStorage<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function AuditAssetProvider({ children }: { children: ReactNode }) {
  const [brandKits, setBrandKits] = useState<StoredBrandKit[]>(() =>
    loadFromStorage<StoredBrandKit>(STORAGE_KEY_BRAND_KITS)
  )
  const [writerProfiles, setWriterProfiles] = useState<StoredWriterProfile[]>(() =>
    loadFromStorage<StoredWriterProfile>(STORAGE_KEY_WRITER_PROFILES)
  )

  useEffect(() => {
    saveToStorage(STORAGE_KEY_BRAND_KITS, brandKits)
  }, [brandKits])

  useEffect(() => {
    saveToStorage(STORAGE_KEY_WRITER_PROFILES, writerProfiles)
  }, [writerProfiles])

  const addBrandKit = useCallback((kit: Omit<StoredBrandKit, 'id' | 'createdAt' | 'source'>) => {
    const newKit: StoredBrandKit = {
      ...kit,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: 'audit',
    }
    setBrandKits((prev) => [newKit, ...prev])
    return newKit
  }, [])

  const addWriterProfile = useCallback((profile: Omit<StoredWriterProfile, 'id' | 'createdAt' | 'source'>) => {
    const newProfile: StoredWriterProfile = {
      ...profile,
      id: `wp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: 'audit',
    }
    setWriterProfiles((prev) => [newProfile, ...prev])
    return newProfile
  }, [])

  const removeBrandKit = useCallback((id: string) => {
    setBrandKits((prev) => prev.filter((k) => k.id !== id))
  }, [])

  const removeWriterProfile = useCallback((id: string) => {
    setWriterProfiles((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <AuditAssetContext.Provider
      value={{ brandKits, writerProfiles, addBrandKit, addWriterProfile, removeBrandKit, removeWriterProfile }}
    >
      {children}
    </AuditAssetContext.Provider>
  )
}

export function useAuditAssets() {
  const ctx = useContext(AuditAssetContext)
  if (!ctx) throw new Error('useAuditAssets must be used within AuditAssetProvider')
  return ctx
}
