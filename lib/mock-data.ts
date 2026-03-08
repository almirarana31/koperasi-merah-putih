// Mock Data for KOPERASI MERAH PUTIH
// Comprehensive dataset for members, products, transactions, inventory, and operations

export interface Member {
  id: string
  memberNumber: string
  name: string
  email: string
  phone: string
  village: string
  district: string
  province: string
  role: "produsen" | "buyer" | "both"
  joinDate: string
  status: "active" | "inactive" | "pending"
  ktp: string
  verified: boolean
  group: string
  position: "ketua" | "anggota" | "pengurus"
  landArea: number // hectares
  mainCommodity: string
  production: {
    monthly: number // kg
    annual: number // kg
  }
  financial: {
    savings: number // IDR
    loans: number // IDR
    shu: number // IDR (Sisa Hasil Usaha)
    transactions: number
  }
  rating: number // 1-5
  lastActive: string
}

export interface Product {
  id: string
  sku: string
  name: string
  category: "sayuran" | "buah" | "biji-bijian" | "ternak" | "perikanan" | "olahan"
  subcategory: string
  description: string
  producer: {
    id: string
    name: string
    village: string
  }
  quality: "A" | "B" | "C"
  certification: string[]
  price: {
    farm: number // IDR/kg (harga petani)
    wholesale: number // IDR/kg (harga grosir)
    retail: number // IDR/kg (harga eceran)
  }
  stock: {
    available: number // kg
    reserved: number // kg
    warehouse: string
    location: string
  }
  harvest: {
    date: string
    nextHarvest: string
    season: "musim_hujan" | "musim_kemarau" | "sepanjang_tahun"
  }
  images: string[]
  tags: string[]
  status: "available" | "low_stock" | "out_of_stock" | "pre_order"
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  invoiceNumber: string
  type: "purchase" | "sale" | "loan" | "savings" | "shu"
  date: string
  member: {
    id: string
    name: string
  }
  items?: {
    productId: string
    productName: string
    quantity: number // kg
    price: number // IDR/kg
    subtotal: number // IDR
  }[]
  amount: number // IDR
  payment: {
    method: "cash" | "transfer" | "credit" | "installment"
    status: "pending" | "paid" | "partial" | "overdue"
    dueDate?: string
    paidDate?: string
  }
  shipping?: {
    method: "pickup" | "delivery" | "courier"
    address: string
    cost: number
    status: "pending" | "in_transit" | "delivered"
  }
  notes: string
  createdBy: string
  status: "draft" | "confirmed" | "processing" | "completed" | "cancelled"
}

export interface Inventory {
  id: string
  productId: string
  productName: string
  warehouse: string
  location: string
  batch: string
  quantity: number // kg
  quality: "A" | "B" | "C"
  harvestDate: string
  expiryDate: string
  temperature: number // °C
  humidity: number // %
  status: "fresh" | "good" | "aging" | "expired"
  movements: {
    date: string
    type: "in" | "out" | "transfer" | "adjustment"
    quantity: number
    from?: string
    to?: string
    reason: string
  }[]
}

export interface Production {
  id: string
  memberId: string
  memberName: string
  commodity: string
  stage: "panen" | "pengumpulan" | "grading" | "konsolidasi"
  harvestDate: string
  quantity: number // kg
  quality: {
    A: number // kg
    B: number // kg
    C: number // kg
  }
  location: string
  status: "in_progress" | "completed" | "quality_check" | "stored"
  assignedTo: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface MarketOrder {
  id: string
  orderNumber: string
  channel: "tokopedia" | "shopee" | "blibli" | "tiktok" | "whatsapp" | "website" | "offline"
  buyer: {
    name: string
    phone: string
    email: string
    address: string
    type: "retail" | "wholesale" | "export" | "government"
  }
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    subtotal: number
  }[]
  total: number
  shipping: {
    method: string
    cost: number
    address: string
    trackingNumber?: string
  }
  payment: {
    method: string
    status: "pending" | "paid" | "failed"
    paidAt?: string
  }
  status: "new" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface Logistics {
  id: string
  vehicleId: string
  vehicleName: string
  vehicleType: "truck" | "pickup" | "motorcycle" | "van"
  driver: {
    id: string
    name: string
    phone: string
  }
  route: {
    from: string
    to: string
    distance: number // km
    duration: number // minutes
  }
  cargo: {
    orderId: string
    productName: string
    quantity: number
    weight: number // kg
  }[]
  status: "scheduled" | "in_transit" | "delivered" | "returned"
  scheduledDate: string
  actualDate?: string
  cost: number
  notes: string
}

export interface AIAnalysis {
  id: string
  type: "price_prediction" | "demand_forecast" | "quality_grading" | "route_optimization" | "market_analysis"
  title: string
  description: string
  confidence: number // 0-100
  data: any
  recommendations: string[]
  impact: string
  createdAt: string
}

// Stock images from Unsplash for products
const productImages: Record<string, string> = {
  // Sayuran
  "Cabai": "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=300&fit=crop",
  "Tomat": "https://images.unsplash.com/photo-1546470427-227c7369a9b5?w=400&h=300&fit=crop",
  "Terong": "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop",
  "Bawang": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop",
  "Kangkung": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
  "Bayam": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop",
  // Buah
  "Pisang": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
  "Mangga": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
  "Jeruk": "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop",
  "Pepaya": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&h=300&fit=crop",
  "Durian": "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=400&h=300&fit=crop",
  "Rambutan": "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400&h=300&fit=crop",
  // Biji-bijian
  "Padi": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
  "Jagung": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
  "Kedelai": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
  "Kacang Tanah": "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400&h=300&fit=crop",
  // Ternak
  "Ayam": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
  "Bebek": "https://images.unsplash.com/photo-1459682687441-7761439a709d?w=400&h=300&fit=crop",
  "Kambing": "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&h=300&fit=crop",
  "Sapi": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400&h=300&fit=crop",
  // Perikanan
  "Lele": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
  "Nila": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
  "Gurame": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
  "Udang": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
  // Olahan
  "Keripik": "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&h=300&fit=crop",
  "Dodol": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
  "Kopi Bubuk": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop",
  "Minyak Kelapa": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
}

function getProductImage(subcategory: string): string {
  return productImages[subcategory] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
}

// Generate 100 members
export const members: Member[] = [
  {
    id: "M001",
    memberNumber: "KMP-2024-001",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "081234567890",
    village: "Sukamaju",
    district: "Garut",
    province: "Jawa Barat",
    role: "produsen",
    joinDate: "2024-01-15",
    status: "active",
    ktp: "3201012345670001",
    verified: true,
    group: "Kelompok Tani Maju Bersama",
    position: "ketua",
    landArea: 2.5,
    mainCommodity: "Padi",
    production: { monthly: 1500, annual: 18000 },
    financial: { savings: 15000000, loans: 5000000, shu: 2500000, transactions: 45 },
    rating: 4.8,
    lastActive: "2026-03-07"
  },
  {
    id: "M002",
    memberNumber: "KMP-2024-002",
    name: "Siti Aminah",
    email: "siti.aminah@email.com",
    phone: "081234567891",
    village: "Sukamaju",
    district: "Garut",
    province: "Jawa Barat",
    role: "produsen",
    joinDate: "2024-01-20",
    status: "active",
    ktp: "3201012345670002",
    verified: true,
    group: "Kelompok Tani Maju Bersama",
    position: "anggota",
    landArea: 1.8,
    mainCommodity: "Cabai",
    production: { monthly: 800, annual: 9600 },
    financial: { savings: 8000000, loans: 3000000, shu: 1200000, transactions: 32 },
    rating: 4.6,
    lastActive: "2026-03-06"
  },
  {
    id: "M003",
    memberNumber: "KMP-2024-003",
    name: "Ahmad Hidayat",
    email: "ahmad.hidayat@email.com",
    phone: "081234567892",
    village: "Cikondang",
    district: "Garut",
    province: "Jawa Barat",
    role: "produsen",
    joinDate: "2024-02-01",
    status: "active",
    ktp: "3201012345670003",
    verified: true,
    group: "Kelompok Tani Sejahtera",
    position: "pengurus",
    landArea: 3.2,
    mainCommodity: "Tomat",
    production: { monthly: 2000, annual: 24000 },
    financial: { savings: 20000000, loans: 8000000, shu: 3500000, transactions: 58 },
    rating: 4.9,
    lastActive: "2026-03-07"
  },
  ...generateAdditionalMembers(97)
]

function generateAdditionalMembers(count: number): Member[] {
  const villages = ["Sukamaju", "Cikondang", "Mekarjaya", "Sukamakmur", "Cimanggis"]
  const commodities = ["Padi", "Cabai", "Tomat", "Jagung", "Bawang", "Kopi", "Kakao"]
  const groups = ["Kelompok Tani Maju Bersama", "Kelompok Tani Sejahtera", "Kelompok Tani Makmur"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `M${String(i + 4).padStart(3, '0')}`,
    memberNumber: `KMP-2024-${String(i + 4).padStart(3, '0')}`,
    name: generateName(),
    email: `member${i + 4}@email.com`,
    phone: `0812345678${String(i + 4).padStart(2, '0')}`,
    village: villages[Math.floor(Math.random() * villages.length)],
    district: "Garut",
    province: "Jawa Barat",
    role: Math.random() > 0.8 ? "both" : "produsen",
    joinDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    status: Math.random() > 0.9 ? "inactive" : "active",
    ktp: `32010123456700${String(i + 4).padStart(2, '0')}`,
    verified: Math.random() > 0.1,
    group: groups[Math.floor(Math.random() * groups.length)],
    position: Math.random() > 0.8 ? "pengurus" : "anggota",
    landArea: Math.random() * 4 + 0.5,
    mainCommodity: commodities[Math.floor(Math.random() * commodities.length)],
    production: {
      monthly: Math.floor(Math.random() * 2000) + 500,
      annual: Math.floor(Math.random() * 24000) + 6000
    },
    financial: {
      savings: Math.floor(Math.random() * 20000000) + 5000000,
      loans: Math.floor(Math.random() * 10000000),
      shu: Math.floor(Math.random() * 5000000),
      transactions: Math.floor(Math.random() * 60) + 10
    },
    rating: Math.random() * 1.5 + 3.5,
    lastActive: "2026-03-07"
  }))
}

function generateName(): string {
  const firstNames = ["Budi", "Siti", "Ahmad", "Dewi", "Eko", "Fitri", "Hadi", "Indah", "Joko", "Kartika"]
  const lastNames = ["Santoso", "Aminah", "Hidayat", "Lestari", "Prasetyo", "Rahayu", "Wijaya", "Kusuma", "Nugroho", "Sari"]
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

// Generate 150 products
export const products: Product[] = [
  {
    id: "P001",
    sku: "PAD-001",
    name: "Beras Premium IR64",
    category: "biji-bijian",
    subcategory: "Padi",
    description: "Beras premium kualitas A dari varietas IR64, bulir panjang dan pulen",
    producer: { id: "M001", name: "Budi Santoso", village: "Sukamaju" },
    quality: "A",
    certification: ["Organik", "SNI"],
    price: { farm: 8000, wholesale: 10000, retail: 12000 },
    stock: { available: 5000, reserved: 500, warehouse: "WH-001", location: "Rak A1" },
    harvest: { date: "2026-02-15", nextHarvest: "2026-05-15", season: "musim_hujan" },
    images: [getProductImage("Padi")],
    tags: ["premium", "organik", "lokal"],
    status: "available",
    createdAt: "2026-02-20",
    updatedAt: "2026-03-07"
  },
  {
    id: "P002",
    sku: "CAB-001",
    name: "Cabai Merah Keriting",
    category: "sayuran",
    subcategory: "Cabai",
    description: "Cabai merah keriting segar, tingkat kepedasan tinggi",
    producer: { id: "M002", name: "Siti Aminah", village: "Sukamaju" },
    quality: "A",
    certification: ["GAP"],
    price: { farm: 35000, wholesale: 42000, retail: 50000 },
    stock: { available: 800, reserved: 100, warehouse: "WH-002", location: "Cold Storage B2" },
    harvest: { date: "2026-03-05", nextHarvest: "2026-04-05", season: "sepanjang_tahun" },
    images: [getProductImage("Cabai")],
    tags: ["segar", "pedas", "lokal"],
    status: "available",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-07"
  },
  {
    id: "P003",
    sku: "TOM-001",
    name: "Tomat Sayur",
    category: "sayuran",
    subcategory: "Tomat",
    description: "Tomat sayur segar untuk masakan, ukuran sedang-besar",
    producer: { id: "M003", name: "Ahmad Hidayat", village: "Cikondang" },
    quality: "A",
    certification: ["GAP"],
    price: { farm: 12000, wholesale: 15000, retail: 18000 },
    stock: { available: 1200, reserved: 200, warehouse: "WH-002", location: "Cold Storage B3" },
    harvest: { date: "2026-03-03", nextHarvest: "2026-04-03", season: "sepanjang_tahun" },
    images: [getProductImage("Tomat")],
    tags: ["segar", "organik", "lokal"],
    status: "available",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-07"
  },
  ...generateAdditionalProducts(147)
]

function generateAdditionalProducts(count: number): Product[] {
  const categories: Product["category"][] = ["sayuran", "buah", "biji-bijian", "ternak", "perikanan", "olahan"]
  const commodities = {
    sayuran: ["Cabai", "Tomat", "Terong", "Bawang", "Kangkung", "Bayam"],
    buah: ["Pisang", "Mangga", "Jeruk", "Pepaya", "Durian", "Rambutan"],
    "biji-bijian": ["Padi", "Jagung", "Kedelai", "Kacang Tanah"],
    ternak: ["Ayam", "Bebek", "Kambing", "Sapi"],
    perikanan: ["Lele", "Nila", "Gurame", "Udang"],
    olahan: ["Keripik", "Dodol", "Kopi Bubuk", "Minyak Kelapa"]
  }
  
  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const subcategory = commodities[category][Math.floor(Math.random() * commodities[category].length)]
    const quality: Product["quality"] = ["A", "B", "C"][Math.floor(Math.random() * 3)] as any
    const farmPrice = Math.floor(Math.random() * 50000) + 5000
    
    return {
      id: `P${String(i + 4).padStart(3, '0')}`,
      sku: `${subcategory.substring(0, 3).toUpperCase()}-${String(i + 4).padStart(3, '0')}`,
      name: `${subcategory} ${quality === "A" ? "Premium" : quality === "B" ? "Standar" : "Ekonomis"}`,
      category,
      subcategory,
      description: `${subcategory} kualitas ${quality} dari petani lokal`,
      producer: {
        id: members[Math.floor(Math.random() * Math.min(members.length, 20))].id,
        name: members[Math.floor(Math.random() * Math.min(members.length, 20))].name,
        village: "Sukamaju"
      },
      quality,
      certification: Math.random() > 0.5 ? ["GAP"] : [],
      price: {
        farm: farmPrice,
        wholesale: Math.floor(farmPrice * 1.25),
        retail: Math.floor(farmPrice * 1.5)
      },
      stock: {
        available: Math.floor(Math.random() * 2000) + 100,
        reserved: Math.floor(Math.random() * 200),
        warehouse: `WH-00${Math.floor(Math.random() * 3) + 1}`,
        location: `Rak ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 10) + 1}`
      },
      harvest: {
        date: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        nextHarvest: `2026-0${Math.floor(Math.random() * 3) + 4}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        season: ["musim_hujan", "musim_kemarau", "sepanjang_tahun"][Math.floor(Math.random() * 3)] as any
      },
      images: [`/products/${subcategory.toLowerCase()}.jpg`],
      tags: ["segar", "lokal"],
      status: Math.random() > 0.8 ? "low_stock" : "available",
      createdAt: "2026-02-01",
      updatedAt: "2026-03-07"
    }
  })
}

// Generate 300 transactions
export const transactions: Transaction[] = Array.from({ length: 300 }, (_, i) => {
  const type: Transaction["type"] = ["purchase", "sale", "loan", "savings", "shu"][Math.floor(Math.random() * 5)] as any
  const member = members[Math.floor(Math.random() * Math.min(members.length, 50))]
  const amount = Math.floor(Math.random() * 10000000) + 500000
  
  return {
    id: `T${String(i + 1).padStart(4, '0')}`,
    invoiceNumber: `INV-2026-${String(i + 1).padStart(4, '0')}`,
    type,
    date: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    member: { id: member.id, name: member.name },
    items: type === "purchase" || type === "sale" ? [
      {
        productId: products[Math.floor(Math.random() * Math.min(products.length, 20))].id,
        productName: products[Math.floor(Math.random() * Math.min(products.length, 20))].name,
        quantity: Math.floor(Math.random() * 500) + 50,
        price: Math.floor(Math.random() * 30000) + 5000,
        subtotal: amount
      }
    ] : undefined,
    amount,
    payment: {
      method: ["cash", "transfer", "credit"][Math.floor(Math.random() * 3)] as any,
      status: ["paid", "pending", "partial"][Math.floor(Math.random() * 3)] as any,
      dueDate: `2026-0${Math.floor(Math.random() * 3) + 2}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      paidDate: Math.random() > 0.3 ? `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : undefined
    },
    shipping: type === "sale" ? {
      method: ["pickup", "delivery", "courier"][Math.floor(Math.random() * 3)] as any,
      address: `${member.village}, ${member.district}`,
      cost: Math.floor(Math.random() * 50000) + 10000,
      status: ["delivered", "in_transit", "pending"][Math.floor(Math.random() * 3)] as any
    } : undefined,
    notes: "Transaksi normal",
    createdBy: "Admin",
    status: ["completed", "processing", "confirmed"][Math.floor(Math.random() * 3)] as any
  }
})

// Generate 200 inventory records
export const inventory: Inventory[] = products.slice(0, 50).flatMap((product, i) =>
  Array.from({ length: 4 }, (_, j) => ({
    id: `INV${String(i * 4 + j + 1).padStart(4, '0')}`,
    productId: product.id,
    productName: product.name,
    warehouse: product.stock.warehouse,
    location: product.stock.location,
    batch: `BATCH-${String(i + 1).padStart(3, '0')}-${j + 1}`,
    quantity: Math.floor(Math.random() * 500) + 100,
    quality: ["A", "B", "C"][Math.floor(Math.random() * 3)] as any,
    harvestDate: product.harvest.date,
    expiryDate: `2026-0${Math.floor(Math.random() * 6) + 4}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    temperature: Math.floor(Math.random() * 10) + 15,
    humidity: Math.floor(Math.random() * 30) + 60,
    status: ["fresh", "good", "aging"][Math.floor(Math.random() * 3)] as any,
    movements: [
      {
        date: product.harvest.date,
        type: "in",
        quantity: Math.floor(Math.random() * 500) + 100,
        from: product.producer.name,
        reason: "Penerimaan hasil panen"
      }
    ]
  }))
)

// Generate 100 production records
export const production: Production[] = Array.from({ length: 100 }, (_, i) => {
  const member = members[Math.floor(Math.random() * Math.min(members.length, 30))]
  const quantity = Math.floor(Math.random() * 1000) + 200
  
  return {
    id: `PROD${String(i + 1).padStart(4, '0')}`,
    memberId: member.id,
    memberName: member.name,
    commodity: member.mainCommodity,
    stage: ["panen", "pengumpulan", "grading", "konsolidasi"][Math.floor(Math.random() * 4)] as any,
    harvestDate: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    quantity,
    quality: {
      A: Math.floor(quantity * 0.6),
      B: Math.floor(quantity * 0.3),
      C: Math.floor(quantity * 0.1)
    },
    location: member.village,
    status: ["completed", "in_progress", "quality_check"][Math.floor(Math.random() * 3)] as any,
    assignedTo: "Tim Grading",
    notes: "Proses berjalan normal",
    createdAt: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    updatedAt: "2026-03-07"
  }
})

// Generate 150 market orders
export const marketOrders: MarketOrder[] = Array.from({ length: 150 }, (_, i) => {
  const channel: MarketOrder["channel"] = ["tokopedia", "shopee", "blibli", "tiktok", "whatsapp", "website", "offline"][Math.floor(Math.random() * 7)] as any
  const product = products[Math.floor(Math.random() * Math.min(products.length, 30))]
  const quantity = Math.floor(Math.random() * 200) + 10
  const subtotal = quantity * product.price.retail
  
  return {
    id: `ORD${String(i + 1).padStart(4, '0')}`,
    orderNumber: `${channel.toUpperCase()}-2026-${String(i + 1).padStart(4, '0')}`,
    channel,
    buyer: {
      name: generateName(),
      phone: `0812345678${String(i).padStart(2, '0')}`,
      email: `buyer${i + 1}@email.com`,
      address: `Jl. Raya No. ${i + 1}, Jakarta`,
      type: ["retail", "wholesale", "export", "government"][Math.floor(Math.random() * 4)] as any
    },
    items: [{
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price.retail,
      subtotal
    }],
    total: subtotal + 50000,
    shipping: {
      method: "JNE Regular",
      cost: 50000,
      address: `Jl. Raya No. ${i + 1}, Jakarta`,
      trackingNumber: Math.random() > 0.5 ? `JNE${String(i + 1).padStart(10, '0')}` : undefined
    },
    payment: {
      method: ["transfer", "cod", "credit"][Math.floor(Math.random() * 3)],
      status: ["paid", "pending"][Math.floor(Math.random() * 2)] as any,
      paidAt: Math.random() > 0.5 ? `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : undefined
    },
    status: ["delivered", "shipped", "confirmed", "new"][Math.floor(Math.random() * 4)] as any,
    createdAt: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    updatedAt: "2026-03-07"
  }
})

// Generate 50 logistics records
export const logistics: Logistics[] = Array.from({ length: 50 }, (_, i) => ({
  id: `LOG${String(i + 1).padStart(4, '0')}`,
  vehicleId: `VH-00${Math.floor(Math.random() * 10) + 1}`,
  vehicleName: `Truck ${Math.floor(Math.random() * 10) + 1}`,
  vehicleType: ["truck", "pickup", "van"][Math.floor(Math.random() * 3)] as any,
  driver: {
    id: `DRV${String(i + 1).padStart(3, '0')}`,
    name: generateName(),
    phone: `0812345678${String(i).padStart(2, '0')}`
  },
  route: {
    from: "Garut",
    to: ["Jakarta", "Bandung", "Surabaya", "Semarang"][Math.floor(Math.random() * 4)],
    distance: Math.floor(Math.random() * 500) + 50,
    duration: Math.floor(Math.random() * 480) + 60
  },
  cargo: [{
    orderId: marketOrders[Math.floor(Math.random() * Math.min(marketOrders.length, 30))].id,
    productName: products[Math.floor(Math.random() * Math.min(products.length, 20))].name,
    quantity: Math.floor(Math.random() * 200) + 50,
    weight: Math.floor(Math.random() * 500) + 100
  }],
  status: ["delivered", "in_transit", "scheduled"][Math.floor(Math.random() * 3)] as any,
  scheduledDate: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  actualDate: Math.random() > 0.5 ? `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : undefined,
  cost: Math.floor(Math.random() * 2000000) + 500000,
  notes: "Pengiriman normal"
}))

// Generate 30 AI analyses
export const aiAnalyses: AIAnalysis[] = [
  {
    id: "AI001",
    type: "price_prediction",
    title: "Prediksi Harga Cabai Merah - Maret 2026",
    description: "Harga cabai merah diprediksi naik 15% dalam 2 minggu ke depan",
    confidence: 87,
    data: {
      currentPrice: 42000,
      predictedPrice: 48300,
      change: 15,
      factors: ["Musim Kemarau", "Permintaan Tinggi", "Stok Menurun"]
    },
    recommendations: [
      "Tunda penjualan 1-2 minggu untuk harga optimal",
      "Tingkatkan stok di cold storage",
      "Siapkan kontrak dengan buyer besar"
    ],
    impact: "Potensi peningkatan revenue 15% atau Rp 6.300/kg",
    createdAt: "2026-03-07"
  },
  {
    id: "AI002",
    type: "demand_forecast",
    title: "Forecast Permintaan Beras - Q2 2026",
    description: "Permintaan beras diprediksi meningkat 25% menjelang Ramadan",
    confidence: 92,
    data: {
      currentDemand: 5000,
      predictedDemand: 6250,
      increase: 25,
      peakPeriod: "Minggu ke-2 Maret"
    },
    recommendations: [
      "Tingkatkan produksi 30% mulai sekarang",
      "Koordinasi dengan 15 petani tambahan",
      "Siapkan warehouse capacity tambahan 2000 kg"
    ],
    impact: "Potensi revenue tambahan Rp 125 juta",
    createdAt: "2026-03-06"
  },
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `AI${String(i + 3).padStart(3, '0')}`,
    type: ["price_prediction", "demand_forecast", "quality_grading", "route_optimization", "market_analysis"][Math.floor(Math.random() * 5)] as any,
    title: `Analisis AI ${i + 3}`,
    description: `Deskripsi analisis AI ${i + 3}`,
    confidence: Math.floor(Math.random() * 30) + 70,
    data: {},
    recommendations: ["Rekomendasi 1", "Rekomendasi 2"],
    impact: `Potensi peningkatan ${Math.floor(Math.random() * 30) + 10}%`,
    createdAt: "2026-03-07"
  }))
]

// Helper functions
export function getMemberById(id: string) {
  return members.find(m => m.id === id)
}

export function getProductById(id: string) {
  return products.find(p => p.id === id)
}

export function getActiveMembers() {
  return members.filter(m => m.status === "active")
}

export function getLowStockProducts() {
  return products.filter(p => p.status === "low_stock" || p.stock.available < 100)
}

export function getPendingOrders() {
  return marketOrders.filter(o => o.status === "new" || o.status === "confirmed")
}

export function getStats() {
  return {
    members: {
      total: members.length,
      active: members.filter(m => m.status === "active").length,
      verified: members.filter(m => m.verified).length
    },
    products: {
      total: products.length,
      available: products.filter(p => p.status === "available").length,
      lowStock: products.filter(p => p.status === "low_stock").length
    },
    transactions: {
      total: transactions.length,
      completed: transactions.filter(t => t.status === "completed").length,
      totalValue: transactions.reduce((sum, t) => sum + t.amount, 0)
    },
    orders: {
      total: marketOrders.length,
      pending: marketOrders.filter(o => o.status === "new" || o.status === "confirmed").length,
      delivered: marketOrders.filter(o => o.status === "delivered").length,
      totalValue: marketOrders.reduce((sum, o) => sum + o.total, 0)
    }
  }
}
