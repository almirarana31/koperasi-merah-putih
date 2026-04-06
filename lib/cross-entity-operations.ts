import { KEMENTERIAN_DASHBOARD_DATA, type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import type { User } from '@/lib/rbac/types'

type ScopeRecord = {
  provinceId: string
  regionId: string
  villageId: string
  cooperativeId: string
  commodityId?: string
}

export type CommodityDefinition = {
  id: string
  label: string
  category: 'Pangan' | 'Hortikultura'
  unit: string
  basePrice: number
  storageType: 'regular' | 'cold'
  shelfLifeDays: number
}

export type WarehouseRecord = {
  id: string
  cooperativeId: string
  cooperativeName: string
  provinceId: string
  provinceName: string
  regionId: string
  regionName: string
  villageId: string
  villageName: string
  type: 'regular' | 'cold'
  name: string
  capacityKg: number
}

export type InventoryRecord = ScopeRecord & {
  commodityId: string
  id: string
  warehouseId: string
  warehouseName: string
  warehouseType: 'regular' | 'cold'
  cooperativeName: string
  provinceName: string
  regionName: string
  villageName: string
  commodityName: string
  category: string
  batchCode: string
  quantityKg: number
  quality: 'A' | 'B' | 'C'
  status: 'fresh' | 'good' | 'aging'
  harvestDate: string
  expiryDate: string
  temperature: number
  humidity: number
  unitPrice: number
}

export type MarketplaceListingRecord = ScopeRecord & {
  commodityId: string
  id: string
  cooperativeName: string
  provinceName: string
  regionName: string
  villageName: string
  commodityName: string
  category: string
  unit: string
  price: number
  stockKg: number
  reservedKg: number
  quality: 'A' | 'B' | 'C'
  organic: boolean
  featured: boolean
  rating: number
  reviews: number
  tags: string[]
  warehouseId: string
  warehouseName: string
}

export type MarketPriceRecord = ScopeRecord & {
  commodityId: string
  id: string
  cooperativeName: string
  provinceName: string
  regionName: string
  villageName: string
  commodityName: string
  currentPrice: number
  previousPrice: number
  weeklyAverage: number
  monthlyAverage: number
  volumeKg: number
}

export type BuyerDirectoryRecord = {
  id: string
  name: string
  type: 'hotel' | 'retail' | 'restoran' | 'fmcg' | 'eksportir'
  email: string
  phone: string
  provinceName: string
  regionName: string
  address: string
}

export type MarketOrderRecord = ScopeRecord & {
  commodityId: string
  id: string
  orderNumber: string
  buyerId: string
  buyerName: string
  cooperativeName: string
  provinceName: string
  regionName: string
  villageName: string
  commodityName: string
  quantityKg: number
  totalValue: number
  status: 'pending' | 'diproses' | 'dikirim' | 'selesai'
  channel: 'B2B' | 'Marketplace' | 'Retail' | 'Government'
  createdAt: string
  destinationProvince: string
  destinationRegion: string
}

export type ShipmentRecord = ScopeRecord & {
  commodityId: string
  id: string
  orderId: string
  orderNumber: string
  cooperativeName: string
  provinceName: string
  regionName: string
  villageName: string
  commodityName: string
  buyerName: string
  vehicle: string
  driver: string
  driverPhone: string
  routeFrom: string
  routeTo: string
  distanceKm: number
  volumeKg: number
  cost: number
  status: 'dijadwalkan' | 'pickup' | 'transit' | 'delivered'
  departureDate: string
  arrivalDate?: string
  onTime: boolean
}

export type ProducerDirectoryRecord = ScopeRecord & {
  commodityId: string
  id: string
  name: string
  type: 'petani' | 'nelayan'
  provinceName: string
  regionName: string
  villageName: string
  cooperativeName: string
  commodityName: string
  phone: string
  landArea: number
  status: 'aktif' | 'binaan' | 'prioritas'
  productivityKg: number
}

export type ProfileDirectoryRecord = ScopeRecord & {
  id: string
  name: string
  role: string
  email: string
  phone: string
  provinceName: string
  regionName: string
  villageName: string
  cooperativeName: string
  status: 'aktif' | 'review' | 'audit'
  joinedAt: string
  lastActivity: string
}

export const OPERATIONAL_COMMODITIES: CommodityDefinition[] = [
  { id: 'beras', label: 'Beras Premium', category: 'Pangan', unit: 'kg', basePrice: 14000, storageType: 'regular', shelfLifeDays: 45 },
  { id: 'jagung', label: 'Jagung Pipil', category: 'Pangan', unit: 'kg', basePrice: 7200, storageType: 'regular', shelfLifeDays: 35 },
  { id: 'cabai', label: 'Cabai Merah', category: 'Hortikultura', unit: 'kg', basePrice: 46000, storageType: 'cold', shelfLifeDays: 9 },
  { id: 'bawang', label: 'Bawang Merah', category: 'Hortikultura', unit: 'kg', basePrice: 33000, storageType: 'cold', shelfLifeDays: 18 },
]

const MONTH_LABELS = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026']
const buyerTypes: BuyerDirectoryRecord['type'][] = ['hotel', 'retail', 'restoran', 'fmcg', 'eksportir']

function normalizeText(value: string | undefined) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function deriveNumber(seed: number, min: number, max: number) {
  return min + (seed % (max - min + 1))
}

function createIsoDate(month: number, day: number) {
  return `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function matchesScope(filters: ScopeFilters, record: ScopeRecord) {
  const matchesProvince = filters.provinceId === 'all' || record.provinceId === filters.provinceId
  const matchesRegion = filters.regionId === 'all' || record.regionId === filters.regionId
  const matchesVillage = filters.villageId === 'all' || record.villageId === filters.villageId
  const matchesCooperative = filters.cooperativeId === 'all' || record.cooperativeId === filters.cooperativeId
  const matchesCommodity = filters.commodityId === 'all' || record.commodityId === filters.commodityId
  return matchesProvince && matchesRegion && matchesVillage && matchesCooperative && matchesCommodity
}

function findScopeMatch(value: string | undefined, type: 'province' | 'region' | 'village' | 'cooperative') {
  if (!value) return undefined

  const source =
    type === 'province'
      ? KEMENTERIAN_DASHBOARD_DATA.provinceOptions
      : type === 'region'
        ? KEMENTERIAN_DASHBOARD_DATA.regionOptions
        : type === 'village'
          ? KEMENTERIAN_DASHBOARD_DATA.villageOptions
          : KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions

  const target = normalizeText(value)
  return source.find((item) => normalizeText(item.label).includes(target) || target.includes(normalizeText(item.label)))
}

export function resolveOperationalFilters(user: User | null | undefined, filters: ScopeFilters): ScopeFilters {
  if (!user || user.role === 'kementerian' || user.role === 'sysadmin') {
    return filters
  }

  let resolved = { ...filters }

  const provinceMatch = findScopeMatch(user.provinceName, 'province')
  if (provinceMatch) {
    resolved = { ...resolved, provinceId: provinceMatch.id }
  }

  const regionMatch = findScopeMatch(user.districtName, 'region')
  if (regionMatch) {
    resolved = { ...resolved, provinceId: regionMatch.provinceId ?? resolved.provinceId, regionId: regionMatch.id }
  }

  const cooperativeMatch = findScopeMatch(user.koperasiName, 'cooperative')
  if (cooperativeMatch) {
    resolved = {
      ...resolved,
      provinceId: cooperativeMatch.provinceId ?? resolved.provinceId,
      regionId: cooperativeMatch.regionId ?? resolved.regionId,
      villageId: cooperativeMatch.villageId ?? resolved.villageId,
      cooperativeId: cooperativeMatch.id,
    }
    return resolved
  }

  const villageMatch = findScopeMatch(user.koperasiName, 'village')
  if (villageMatch) {
    resolved = {
      ...resolved,
      provinceId: villageMatch.provinceId ?? resolved.provinceId,
      regionId: villageMatch.regionId ?? resolved.regionId,
      villageId: villageMatch.id,
    }
  }

  return resolved
}

export function getScopeCaption(filters: ScopeFilters) {
  const cooperativeLabel = KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions.find((item) => item.id === filters.cooperativeId)?.label
  if (cooperativeLabel) return cooperativeLabel

  const villageLabel = KEMENTERIAN_DASHBOARD_DATA.villageOptions.find((item) => item.id === filters.villageId)?.label
  if (villageLabel) return `Desa ${villageLabel}`

  const regionLabel = KEMENTERIAN_DASHBOARD_DATA.regionOptions.find((item) => item.id === filters.regionId)?.label
  if (regionLabel) return regionLabel

  const provinceLabel = KEMENTERIAN_DASHBOARD_DATA.provinceOptions.find((item) => item.id === filters.provinceId)?.label
  if (provinceLabel) return `Provinsi ${provinceLabel}`

  return 'Seluruh Indonesia'
}

const WAREHOUSES: WarehouseRecord[] = KEMENTERIAN_DASHBOARD_DATA.cooperatives.flatMap((cooperative, coopIndex) => {
  const regularCapacity = 6400 + (coopIndex % 5) * 700
  const coldCapacity = 2200 + (coopIndex % 4) * 260

  return [
    {
      id: `${cooperative.id}-WH-REG`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      provinceId: cooperative.provinceId,
      provinceName: cooperative.province,
      regionId: cooperative.regionId,
      regionName: cooperative.region,
      villageId: cooperative.villageId,
      villageName: cooperative.village,
      type: 'regular',
      name: `Gudang Inti ${cooperative.village}`,
      capacityKg: regularCapacity,
    },
    {
      id: `${cooperative.id}-WH-COLD`,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      provinceId: cooperative.provinceId,
      provinceName: cooperative.province,
      regionId: cooperative.regionId,
      regionName: cooperative.region,
      villageId: cooperative.villageId,
      villageName: cooperative.village,
      type: 'cold',
      name: `Cold Storage ${cooperative.village}`,
      capacityKg: coldCapacity,
    },
  ]
})

export const OPERATIONAL_LISTINGS: MarketplaceListingRecord[] = KEMENTERIAN_DASHBOARD_DATA.cooperatives.flatMap((cooperative, coopIndex) =>
  OPERATIONAL_COMMODITIES.map((commodity, commodityIndex) => {
    const seed = coopIndex * 91 + commodityIndex * 37 + 19
    const warehouse = WAREHOUSES.find(
      (item) => item.cooperativeId === cooperative.id && item.type === commodity.storageType,
    )!
    const stockKg = deriveNumber(seed * 3, commodity.storageType === 'cold' ? 220 : 900, commodity.storageType === 'cold' ? 980 : 4200)
    const reservedKg = Math.round(stockKg * ((seed % 18) + 10) / 100)
    const priceMultiplier = 0.9 + ((seed % 9) * 0.03)

    return {
      id: `${cooperative.id}-${commodity.id}`,
      provinceId: cooperative.provinceId,
      provinceName: cooperative.province,
      regionId: cooperative.regionId,
      regionName: cooperative.region,
      villageId: cooperative.villageId,
      villageName: cooperative.village,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      commodityId: commodity.id,
      commodityName: commodity.label,
      category: commodity.category,
      unit: commodity.unit,
      price: Math.round(commodity.basePrice * priceMultiplier),
      stockKg,
      reservedKg,
      quality: (['A', 'A', 'B', 'C'] as const)[seed % 4],
      organic: seed % 3 !== 0,
      featured: seed % 4 === 0,
      rating: Number((4.1 + (seed % 8) * 0.1).toFixed(1)),
      reviews: deriveNumber(seed * 5, 14, 210),
      tags: commodity.category === 'Pangan' ? ['pasokan-stabil', 'lintas-desa'] : ['rantai-dingin', 'permintaan-tinggi'],
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
    }
  }),
)

export const OPERATIONAL_INVENTORY: InventoryRecord[] = OPERATIONAL_LISTINGS.flatMap((listing, listingIndex) =>
  [0, 1].map((batchIndex) => {
    const seed = listingIndex * 13 + batchIndex * 17 + 5
    const quantityKg = Math.round((listing.stockKg - listing.reservedKg) * (batchIndex === 0 ? 0.58 : 0.42))
    const harvestMonth = 2 + (seed % 3)
    const harvestDay = 3 + (seed % 18)
    const shelfLife = OPERATIONAL_COMMODITIES.find((item) => item.id === listing.commodityId)?.shelfLifeDays ?? 14
    const expiryMonth = Math.min(4, harvestMonth + Math.floor((harvestDay + shelfLife) / 28))
    const expiryDay = ((harvestDay + shelfLife) % 28) + 1

    return {
      id: `${listing.id}-BATCH-${batchIndex + 1}`,
      provinceId: listing.provinceId,
      provinceName: listing.provinceName,
      regionId: listing.regionId,
      regionName: listing.regionName,
      villageId: listing.villageId,
      villageName: listing.villageName,
      cooperativeId: listing.cooperativeId,
      cooperativeName: listing.cooperativeName,
      commodityId: listing.commodityId,
      commodityName: listing.commodityName,
      category: listing.category,
      warehouseId: listing.warehouseId,
      warehouseName: listing.warehouseName,
      warehouseType: listing.warehouseName.toLowerCase().includes('cold') ? 'cold' : 'regular',
      batchCode: `${listing.commodityId.toUpperCase()}-${String(listingIndex + 1).padStart(3, '0')}-${batchIndex + 1}`,
      quantityKg,
      quality: batchIndex === 0 ? listing.quality : listing.quality === 'A' ? 'B' : listing.quality,
      status: (['fresh', 'good', 'aging'] as const)[seed % 3],
      harvestDate: createIsoDate(harvestMonth, harvestDay),
      expiryDate: createIsoDate(expiryMonth, expiryDay),
      temperature: listing.category === 'Hortikultura' ? 4 + (seed % 5) : 18 + (seed % 4),
      humidity: 63 + (seed % 18),
      unitPrice: listing.price,
    }
  }),
)

export const OPERATIONAL_PRICES: MarketPriceRecord[] = OPERATIONAL_LISTINGS.map((listing, index) => {
  const seed = index * 29 + 11
  const currentPrice = listing.price
  const previousPrice = Math.round(currentPrice * (0.94 + (seed % 7) * 0.02))
  const weeklyAverage = Math.round((currentPrice + previousPrice) / 2)
  const monthlyAverage = Math.round(currentPrice * (0.91 + (seed % 5) * 0.03))

  return {
    id: `${listing.id}-PRICE`,
    provinceId: listing.provinceId,
    provinceName: listing.provinceName,
    regionId: listing.regionId,
    regionName: listing.regionName,
    villageId: listing.villageId,
    villageName: listing.villageName,
    cooperativeId: listing.cooperativeId,
    cooperativeName: listing.cooperativeName,
    commodityId: listing.commodityId,
    commodityName: listing.commodityName,
    currentPrice,
    previousPrice,
    weeklyAverage,
    monthlyAverage,
    volumeKg: Math.round(listing.stockKg * 0.72),
  }
})

export const OPERATIONAL_BUYERS: BuyerDirectoryRecord[] = KEMENTERIAN_DASHBOARD_DATA.regionOptions.flatMap((region, index) => {
  const provinceName = KEMENTERIAN_DASHBOARD_DATA.provinceOptions.find((item) => item.id === region.provinceId)?.label ?? 'Indonesia'

  return [0, 1].map((slot) => {
    const buyerIndex = index * 2 + slot
    const type = buyerTypes[buyerIndex % buyerTypes.length]
    const baseName =
      type === 'hotel'
        ? 'Hotel Pangan Nusantara'
        : type === 'retail'
          ? 'Jaringan Retail Desa'
          : type === 'restoran'
            ? 'Kuliner Mitra Rasa'
            : type === 'fmcg'
              ? 'PT Distribusi Segar'
              : 'CV Ekspor Sembada'

    return {
      id: `BUY-${region.id}-${slot + 1}`,
      name: `${baseName} ${region.label.replace('Kab. ', '')}`,
      type,
      email: `mitra${buyerIndex + 1}@koperasi.id`,
      phone: `08${String(1110000000 + buyerIndex * 173).slice(0, 10)}`,
      provinceName,
      regionName: region.label,
      address: `${region.label}, ${provinceName}`,
    }
  })
})

export const OPERATIONAL_ORDERS: MarketOrderRecord[] = KEMENTERIAN_DASHBOARD_DATA.cooperatives.flatMap((cooperative, coopIndex) => {
  const listings = OPERATIONAL_LISTINGS.filter((item) => item.cooperativeId === cooperative.id)

  return [0, 1, 2].map((orderIndex) => {
    const seed = coopIndex * 41 + orderIndex * 13 + 7
    const listing = listings[orderIndex % listings.length]
    const buyer = OPERATIONAL_BUYERS[(coopIndex + orderIndex * 3) % OPERATIONAL_BUYERS.length]
    const quantityKg = deriveNumber(seed * 5, 120, 1180)
    const createdMonth = 1 + (seed % 4)
    const createdDay = 4 + (seed % 20)
    const status = (['pending', 'diproses', 'dikirim', 'selesai'] as const)[seed % 4]
    const channel = (['B2B', 'Marketplace', 'Retail', 'Government'] as const)[seed % 4]

    return {
      id: `ORD-${cooperative.id}-${orderIndex + 1}`,
      orderNumber: `PO-${String(coopIndex + 1).padStart(3, '0')}-${orderIndex + 1}`,
      provinceId: cooperative.provinceId,
      provinceName: cooperative.province,
      regionId: cooperative.regionId,
      regionName: cooperative.region,
      villageId: cooperative.villageId,
      villageName: cooperative.village,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      commodityId: listing.commodityId,
      commodityName: listing.commodityName,
      buyerId: buyer.id,
      buyerName: buyer.name,
      quantityKg,
      totalValue: quantityKg * listing.price,
      status,
      channel,
      createdAt: createIsoDate(createdMonth, createdDay),
      destinationProvince: buyer.provinceName,
      destinationRegion: buyer.regionName,
    }
  })
})

export const OPERATIONAL_SHIPMENTS: ShipmentRecord[] = OPERATIONAL_ORDERS.map((order, index) => {
  const seed = index * 23 + 9
  const departureMonth = Number(order.createdAt.slice(5, 7))
  const departureDay = Number(order.createdAt.slice(8, 10)) + 1
  const status =
    order.status === 'pending'
      ? 'dijadwalkan'
      : order.status === 'diproses'
        ? 'pickup'
        : order.status === 'dikirim'
          ? 'transit'
          : 'delivered'

  return {
    id: `SHIP-${index + 1}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    provinceId: order.provinceId,
    provinceName: order.provinceName,
    regionId: order.regionId,
    regionName: order.regionName,
    villageId: order.villageId,
    villageName: order.villageName,
    cooperativeId: order.cooperativeId,
    cooperativeName: order.cooperativeName,
    commodityId: order.commodityId,
    commodityName: order.commodityName,
    buyerName: order.buyerName,
    vehicle: (['Truk Box', 'Pickup Reefer', 'Van Distribusi'] as const)[seed % 3],
    driver: `Driver ${String.fromCharCode(65 + (seed % 20))}`,
    driverPhone: `08${String(2110000000 + seed * 27).slice(0, 10)}`,
    routeFrom: `${order.villageName} Hub`,
    routeTo: order.destinationRegion,
    distanceKm: deriveNumber(seed * 2, 44, 620),
    volumeKg: order.quantityKg,
    cost: deriveNumber(seed * 31, 650000, 4850000),
    status,
    departureDate: createIsoDate(Math.min(4, departureMonth), Math.min(28, departureDay)),
    arrivalDate: status === 'delivered' ? createIsoDate(Math.min(4, departureMonth), Math.min(28, departureDay + 2 + (seed % 3))) : undefined,
    onTime: seed % 5 !== 0,
  }
})

export const OPERATIONAL_PRODUCERS: ProducerDirectoryRecord[] = KEMENTERIAN_DASHBOARD_DATA.cooperatives.flatMap((cooperative, coopIndex) =>
  cooperative.memberRecords.slice(0, 6).map((member, memberIndex) => {
    const commodity = OPERATIONAL_COMMODITIES[(coopIndex + memberIndex) % OPERATIONAL_COMMODITIES.length]
    const type = member.occupation === 'Nelayan' ? 'nelayan' : 'petani'
    const seed = coopIndex * 17 + memberIndex * 7

    return {
      id: member.id,
      provinceId: cooperative.provinceId,
      provinceName: cooperative.province,
      regionId: cooperative.regionId,
      regionName: cooperative.region,
      villageId: cooperative.villageId,
      villageName: cooperative.village,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      commodityId: commodity.id,
      commodityName: commodity.label,
      name: member.name,
      type,
      phone: `08${String(3110000000 + seed * 41).slice(0, 10)}`,
      landArea: Number((0.8 + (seed % 8) * 0.45).toFixed(1)),
      status: (['aktif', 'binaan', 'prioritas'] as const)[seed % 3],
      productivityKg: deriveNumber(seed * 19, 480, 4600),
    }
  }),
)

export const OPERATIONAL_PROFILES: ProfileDirectoryRecord[] = KEMENTERIAN_DASHBOARD_DATA.cooperatives.flatMap((cooperative, coopIndex) =>
  [
    { role: 'Ketua Koperasi', suffix: 'KET', status: 'aktif' as const },
    { role: 'Manajer Operasional', suffix: 'MGR', status: 'aktif' as const },
    { role: 'Koordinator Logistik', suffix: 'LOG', status: coopIndex % 4 === 0 ? ('audit' as const) : ('review' as const) },
  ].map((profile, profileIndex) => {
    const seed = coopIndex * 13 + profileIndex * 11
    return {
      id: `${cooperative.id}-${profile.suffix}`,
      provinceId: cooperative.provinceId,
      provinceName: cooperative.province,
      regionId: cooperative.regionId,
      regionName: cooperative.region,
      villageId: cooperative.villageId,
      villageName: cooperative.village,
      cooperativeId: cooperative.id,
      cooperativeName: cooperative.name,
      name: `${profile.role} ${cooperative.village}`,
      role: profile.role,
      email: `${profile.suffix.toLowerCase()}.${normalizeText(cooperative.village)}@koperasi.id`,
      phone: `08${String(4110000000 + seed * 29).slice(0, 10)}`,
      status: profile.status,
      joinedAt: createIsoDate(1 + (seed % 4), 4 + (seed % 20)),
      lastActivity: createIsoDate(4, 6 + (seed % 18)),
    }
  }),
)

export function filterListingsByScope(filters: ScopeFilters) {
  return OPERATIONAL_LISTINGS.filter((record) => matchesScope(filters, record))
}

export function filterInventoryByScope(filters: ScopeFilters) {
  return OPERATIONAL_INVENTORY.filter((record) => matchesScope(filters, record))
}

export function filterPricesByScope(filters: ScopeFilters) {
  return OPERATIONAL_PRICES.filter((record) => matchesScope(filters, record))
}

export function filterOrdersByScope(filters: ScopeFilters) {
  return OPERATIONAL_ORDERS.filter((record) => matchesScope(filters, record))
}

export function filterShipmentsByScope(filters: ScopeFilters) {
  return OPERATIONAL_SHIPMENTS.filter((record) => matchesScope(filters, record))
}

export function filterProducersByScope(filters: ScopeFilters) {
  return OPERATIONAL_PRODUCERS.filter((record) => matchesScope(filters, record))
}

export function filterProfilesByScope(filters: ScopeFilters) {
  return OPERATIONAL_PROFILES.filter((record) => matchesScope(filters, record))
}

export function getWarehousesForInventory(inventory: InventoryRecord[]) {
  const scopedWarehouseIds = new Set(inventory.map((item) => item.warehouseId))

  return WAREHOUSES.filter((warehouse) => scopedWarehouseIds.has(warehouse.id)).map((warehouse) => {
    const warehouseInventory = inventory.filter((item) => item.warehouseId === warehouse.id)
    const occupancyKg = warehouseInventory.reduce((total, item) => total + item.quantityKg, 0)
    const utilizationPct = warehouse.capacityKg === 0 ? 0 : Math.round((occupancyKg / warehouse.capacityKg) * 100)
    const avgTemperature =
      warehouseInventory.length === 0
        ? 0
        : warehouseInventory.reduce((total, item) => total + item.temperature, 0) / warehouseInventory.length
    const avgHumidity =
      warehouseInventory.length === 0
        ? 0
        : warehouseInventory.reduce((total, item) => total + item.humidity, 0) / warehouseInventory.length

    return {
      ...warehouse,
      occupancyKg,
      utilizationPct,
      batchCount: warehouseInventory.length,
      avgTemperature,
      avgHumidity,
      stockValue: warehouseInventory.reduce((total, item) => total + item.quantityKg * item.unitPrice, 0),
    }
  })
}

export function getBuyersFromOrders(orders: MarketOrderRecord[]) {
  const transactionSummary = new Map<
    string,
    {
      totalTransactions: number
      totalValue: number
      activeOrders: number
      cooperativeCount: number
      volumeKg: number
    }
  >()

  for (const order of orders) {
    const current = transactionSummary.get(order.buyerId) ?? {
      totalTransactions: 0,
      totalValue: 0,
      activeOrders: 0,
      cooperativeCount: 0,
      volumeKg: 0,
    }

    current.totalTransactions += 1
    current.totalValue += order.totalValue
    current.activeOrders += order.status === 'selesai' ? 0 : 1
    current.volumeKg += order.quantityKg
    transactionSummary.set(order.buyerId, current)
  }

  return OPERATIONAL_BUYERS.filter((buyer) => transactionSummary.has(buyer.id)).map((buyer) => ({
    ...buyer,
    ...transactionSummary.get(buyer.id)!,
    cooperativeCount: new Set(orders.filter((order) => order.buyerId === buyer.id).map((order) => order.cooperativeId)).size,
  }))
}

export function getMonthlyOrderSeries(orders: MarketOrderRecord[]) {
  return MONTH_LABELS.map((monthLabel, index) => {
    const monthNumber = index + 1
    const rows = orders.filter((order) => Number(order.createdAt.slice(5, 7)) === monthNumber)
    return {
      month: monthLabel,
      revenue: rows.reduce((total, order) => total + order.totalValue, 0),
      volumeKg: rows.reduce((total, order) => total + order.quantityKg, 0),
      orders: rows.length,
    }
  })
}

export function getPriceComparisonByRegion(priceRows: MarketPriceRecord[]) {
  const grouped = new Map<string, { region: string; value: number; volume: number }>()

  for (const row of priceRows) {
    const current = grouped.get(row.regionId) ?? { region: row.regionName, value: 0, volume: 0 }
    current.value += row.currentPrice * row.volumeKg
    current.volume += row.volumeKg
    grouped.set(row.regionId, current)
  }

  return [...grouped.values()]
    .map((row) => ({
      region: row.region,
      avgPrice: row.volume === 0 ? 0 : Math.round(row.value / row.volume),
    }))
    .sort((left, right) => right.avgPrice - left.avgPrice)
}

export function getInventoryByCommodity(inventory: InventoryRecord[]) {
  const grouped = new Map<string, { commodity: string; quantityKg: number; value: number }>()

  for (const row of inventory) {
    const current = grouped.get(row.commodityId) ?? { commodity: row.commodityName, quantityKg: 0, value: 0 }
    current.quantityKg += row.quantityKg
    current.value += row.quantityKg * row.unitPrice
    grouped.set(row.commodityId, current)
  }

  return [...grouped.values()].sort((left, right) => right.quantityKg - left.quantityKg)
}

export function getShipmentPerformanceByRegion(shipments: ShipmentRecord[]) {
  const grouped = new Map<string, { region: string; delivered: number; active: number; onTime: number }>()

  for (const shipment of shipments) {
    const current = grouped.get(shipment.regionId) ?? {
      region: shipment.regionName,
      delivered: 0,
      active: 0,
      onTime: 0,
    }
    current.active += shipment.status === 'delivered' ? 0 : 1
    current.delivered += shipment.status === 'delivered' ? 1 : 0
    current.onTime += shipment.onTime ? 1 : 0
    grouped.set(shipment.regionId, current)
  }

  return [...grouped.values()].map((row) => ({
    ...row,
    onTimeRate: shipments.length === 0 ? 0 : Math.round((row.onTime / Math.max(row.delivered + row.active, 1)) * 100),
  }))
}

export function getCatalogAggregation(listings: MarketplaceListingRecord[]) {
  const grouped = new Map<
    string,
    {
      commodityId: string
      commodityName: string
      category: string
      unit: string
      price: number
      stockKg: number
      supplierCount: Set<string>
      regionCount: Set<string>
      avgRating: number[]
    }
  >()

  for (const listing of listings) {
    const current = grouped.get(listing.commodityId) ?? {
      commodityId: listing.commodityId,
      commodityName: listing.commodityName,
      category: listing.category,
      unit: listing.unit,
      price: 0,
      stockKg: 0,
      supplierCount: new Set<string>(),
      regionCount: new Set<string>(),
      avgRating: [],
    }
    current.price += listing.price
    current.stockKg += listing.stockKg
    current.supplierCount.add(listing.cooperativeId)
    current.regionCount.add(listing.regionId)
    current.avgRating.push(listing.rating)
    grouped.set(listing.commodityId, current)
  }

  return [...grouped.values()].map((item) => ({
    commodityId: item.commodityId,
    commodityName: item.commodityName,
    category: item.category,
    unit: item.unit,
    avgPrice: Math.round(item.price / item.avgRating.length),
    stockKg: item.stockKg,
    supplierCount: item.supplierCount.size,
    regionCount: item.regionCount.size,
    rating: Number((item.avgRating.reduce((total, value) => total + value, 0) / item.avgRating.length).toFixed(1)),
  }))
}
