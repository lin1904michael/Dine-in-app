const dict = {
  reward: { en: '🎁 Unlock Free Reward', zh: '🎁 解鎖免費獎勵' },
  claimReward: { en: '💳 Claim Your Free Reward', zh: '💳 領取免費獎勵' },
  water: { en: 'Water', zh: '水' },
  napkins: { en: 'Napkins', zh: '紙巾' },
  condiments: { en: 'Condiments', zh: '調味料' },
  utensils: { en: 'Utensils', zh: '餐具' },
  togo: { en: 'To-Go Box', zh: '外帶盒' },
  check: { en: 'Request Check', zh: '結帳' },
  issue: { en: 'Report an Issue', zh: '反應用餐問題' },
  send: { en: 'Send Request', zh: '發送請求' },
  orderMore: { en: 'Order More', zh: '加點餐點' },

  // Sub-items: Water
  iceWater: { en: 'Ice Water', zh: '冰水' },
  roomWater: { en: 'Room Temp Water', zh: '常溫水' },

  // Sub-items: Condiments
  soySauce: { en: 'Soy Sauce', zh: '醬油' },
  chiliOil: { en: 'Chili Oil', zh: '辣椒油' },
  vinegar: { en: 'Vinegar', zh: '醋' },

  // Sub-items: Utensils
  forks: { en: 'Forks', zh: '叉子' },
  spoons: { en: 'Spoons', zh: '湯匙' },
  chopsticks: { en: 'Chopsticks', zh: '筷子' },
  kidsSetup: { en: 'Kids Setup', zh: '兒童餐具' },

  // Sub-items: To-Go Box
  smallBox: { en: 'Small Box', zh: '小外帶盒' },
  largeBox: { en: 'Large Box', zh: '大外帶盒' },
  soupContainer: { en: 'Soup Container', zh: '湯碗' },
  bags: { en: 'Bags', zh: '袋子' },

  // Report Issue categories
  foodQuality: { en: 'Food Quality', zh: '餐點品質' },
  service: { en: 'Service', zh: '服務' },
  other: { en: 'Other', zh: '其他' },

  // Custom note
  customNote: { en: 'Other (Please Specify)', zh: '其他 - 請說明' },

  // Gallery & Taste Matcher
  gallery: { en: 'Exclusive Gallery', zh: '獨家圖庫' },
  decide: { en: 'Let FoodservAI Decide', zh: '讓 FoodservAI 為您推薦' },
  match: { en: 'Generate Perfect Match', zh: '生成完美搭配' },

  // Connect & Explore
  storeInfo: { en: 'Store Info & Hours', zh: '店家資訊與營業時間' },
  story: { en: 'Watch Our Story', zh: '觀看我們的故事' },

  // QSR Add-ons
  chickenBites: { en: 'Chicken Bites ($9.00)', zh: '雞塊 ($9.00)' },
  extraSauce: { en: 'Extra Sauce', zh: '額外醬料' },
  fountainDrink: { en: 'Fountain Drink', zh: '飲料' },
  sideFries: { en: 'Side Fries ($3.00)', zh: '薯條 ($3.00)' },

  // QSR Sub-items
  coke: { en: 'Coke', zh: '可樂' },
  sprite: { en: 'Sprite', zh: '雪碧' },
  houseSauce: { en: 'House Sauce', zh: '招牌醬' },
  spicyMayo: { en: 'Spicy Mayo', zh: '辣美乃滋' },

  // Rate
  rateMeal: { en: '⭐ Rate Your Meal', zh: '⭐ 為您的餐點評分' },

  // Digital Wallet
  viewWallet: { en: '💳 View My Rewards Wallet', zh: '💳 查看我的獎勵錢包' },
  walletTitle: { en: 'Your Rewards', zh: '您的獎勵' },
  pointsBalance: { en: 'Points Balance', zh: '點數餘額' },
  redeemReward: { en: 'Redeem', zh: '兌換' },
  freeDrink: { en: 'Free Fountain Drink', zh: '免費飲料' },
  freeAppetizer: { en: 'Free Appetizer', zh: '免費前菜' },
  discoverRewards: { en: '🌍 Discover More Rewards Near Me', zh: '🌍 探索附近更多獎勵' },

  // Order More sub-items
  drinks: { en: 'Drinks', zh: '飲品' },
  appetizers: { en: 'Appetizers', zh: '開胃菜' },
  icedTea: { en: 'Iced Tea', zh: '冰茶' },
  lemonade: { en: 'Lemonade', zh: '檸檬水' },
  springRolls: { en: 'Spring Rolls', zh: '春捲' },
  edamame: { en: 'Edamame', zh: '毛豆' },
  sendOrder: { en: 'Send Order', zh: '送出訂單' },

  // Live Tracker & Discovery
  vipLane: { en: 'VIP Fast Lane: Forgot something? Skip the line and order right from your phone.', zh: 'VIP 快速通道：忘記點什麼了嗎？免排隊直接用手機加點。' },
  orderTicket: { en: 'Pickup Ticket #', zh: '取餐號碼 #' },
  groupOrder: { en: 'Group Orders & Bulk', zh: '團購與大量預訂' },
  pending: { en: 'Pending', zh: '處理中' },
  back: { en: 'Back to Dashboard', zh: '返回主頁' },
  activeRequests: { en: 'Active Requests', zh: '進行中的請求' },

  // Premium Wallet
  premiumRewards: { en: 'FoodservAI Premium Rewards', zh: 'FoodservAI 尊享獎勵' },
  addToWallet: { en: '📲 Add to Apple Wallet', zh: '📲 加入 Apple 錢包' },

  // Reward Tiers
  tier50: { en: 'Free Fountain Drink', zh: '免費飲料' },
  tier150: { en: '10% Off Next Group Order', zh: '團購九折優惠' },
  tier300: { en: 'Free Frozen Signature Dumplings', zh: '免費冷凍手工水餃' },

  // Group Order Marketing
  communityGroupOrders: { en: '🥡 Community Group Orders / Catering', zh: '🥡 社區團購 / 到會' },
  communityGroupOrdersZh: { en: '(團購 / 到會)', zh: '（團購 / 到會）' },
  groupOrderDesc: {
    en: 'Pre-order our signature frozen items for weekend pickups in Irvine, Arcadia, or Chino Hills.',
    zh: '預訂我們的招牌冷凍食品，週末於爾灣、阿卡迪亞或奇諾崗取餐。',
  },
  browseGroupBuys: { en: 'Browse Group Buys', zh: '瀏覽團購' },

  // Checkout Modal
  checkout: { en: 'Checkout', zh: '結帳' },
  orderSummary: { en: 'Order Summary', zh: '訂單摘要' },
  payApple: { en: ' Pay', zh: ' Pay' },
  payCard: { en: '💳 Pay with Card', zh: '💳 信用卡付款' },
  payZelle: { en: '📱 Pay with Zelle', zh: '📱 Zelle 付款' },
  zelleConfirm: { en: 'Confirm Zelle Payment', zh: '確認 Zelle 付款' },
  paymentSuccess: { en: 'Payment Confirmed!', zh: '付款已確認！' },
}

export function t(key, lang) {
  return dict[key]?.[lang] || dict[key]?.en || key
}

export default dict
