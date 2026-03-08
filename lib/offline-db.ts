import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface KopdesDB extends DBSchema {
  harvests: {
    key: string
    value: {
      id: string
      commodity: string
      quantity: number
      unit: string
      date: string
      synced: boolean
      createdAt: string
    }
  }
  members: {
    key: string
    value: {
      id: string
      name: string
      ktp: string
      phone: string
      synced: boolean
      createdAt: string
    }
  }
  inventory: {
    key: string
    value: {
      id: string
      commodity: string
      quantity: number
      warehouse: string
      synced: boolean
      updatedAt: string
    }
  }
}

let dbInstance: IDBPDatabase<KopdesDB> | null = null

export async function getDB() {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<KopdesDB>('kopdes-db', 1, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('harvests')) {
        db.createObjectStore('harvests', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('members')) {
        db.createObjectStore('members', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('inventory')) {
        db.createObjectStore('inventory', { keyPath: 'id' })
      }
    }
  })

  return dbInstance
}

// Harvest operations
export async function saveHarvestOffline(harvest: any) {
  const db = await getDB()
  await db.add('harvests', {
    ...harvest,
    synced: false,
    createdAt: new Date().toISOString()
  })
}

export async function getUnsyncedHarvests() {
  const db = await getDB()
  const harvests = await db.getAll('harvests')
  return harvests.filter(h => !h.synced)
}

export async function markHarvestSynced(id: string) {
  const db = await getDB()
  const harvest = await db.get('harvests', id)
  if (harvest) {
    await db.put('harvests', { ...harvest, synced: true })
  }
}

// Sync function
export async function syncOfflineData() {
  if (!navigator.onLine) {
    console.log('Offline - skipping sync')
    return
  }

  const harvests = await getUnsyncedHarvests()
  
  for (const harvest of harvests) {
    try {
      const response = await fetch('/api/harvests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(harvest)
      })

      if (response.ok) {
        await markHarvestSynced(harvest.id)
        console.log(`Synced harvest: ${harvest.id}`)
      }
    } catch (error) {
      console.error('Sync failed for harvest:', harvest.id, error)
    }
  }
}

// Listen for online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Back online - syncing data...')
    syncOfflineData()
  })
}
