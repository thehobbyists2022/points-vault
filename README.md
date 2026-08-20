# 💳 PointsVault - 美国信用卡、飞行里程、酒店与租车全景管理终端 (MVP)

> **全景式常旅客与美卡生态管理平台** — 整合美国主流信用卡、航空公司飞行里程、酒店集团及租车公司会员体系，提供“开卡护栏 -> 福利报销打卡 -> 消费智能匹配 -> 点数转汇兑换 -> 飞行里程与伴飞券 -> 租车会籍匹配”一站式管理方案。

---

## 🌟 核心功能特色 (MVP Highlights)

1. **📊 智能总览控制台 (Dashboard Overview)**
   * 全家点数与里程总估值 ($ / Points)
   * 待打卡报销福利 (Unclaimed Perks) 实时统筹
   * 开卡消费进度条 (MSR Spend Tracker) 快速记账
   * 伴飞券 (Companion Pass) 与酒店 FNC 免房券过期预警

2. **💳 信用卡钱包与报销打卡 (Credit Cards & Perks)**
   * 包含 500+ 美卡数据模型（Amex Plat/Gold, Chase CSR/CFF, CapOne Venture X, Hyatt, Bilt 等）
   * 年度/月度/季度高额福利一键标记已报销 (Hotel Credit, Uber Cash, Resy等)
   * 支持新增消费额度、卡片年费支出与核心倍率 (Multipliers) 显示

3. **✈️ 飞行里程与伴飞券 (Airline Miles & Companion Pass)**
   * **真实官方公认估值 (CPP)**：美联航 (1.35¢)、达美 (1.15¢)、美航 (1.45¢)、美西南 (1.30¢)、阿拉斯加 (1.55¢)、加航 (1.50¢)
   * **伴飞券 (Companion Pass) 进度雷达**：Southwest 135,000 分买一送一伴飞卡进度条、Delta/Alaska $99 伴飞券到期提醒
   * **里程过期风险防范**：自动识别 AA / Aeroplan 24个月/18个月过期风险

4. **🏨 酒店常旅客与 FNC 免房券 (Hotels & FNC)**
   * 监控 Hyatt Globalist, Marriott Platinum, Hilton Diamond 尊贵会籍房晚进度
   * 酒店 FNC (Cat 1-4, Cat 1-7, 85k Points 券) 到期日集中监控与预估价值

5. **🚗 租车会籍与 CDW 车险助手 (Car Rental & Match)**
   * Hertz President's Circle, National Executive Elite, Avis President's Club 会籍卡
   * **Status Match 一键匹配路线图**：官方直达匹配链接与资格卡片引导
   * **Primary CDW (主险) 车险判定器**：标注 Chase Sapphire Reserve / CapOne Venture X 主险保障

6. **🛒 刷卡神器 (Which Card to Use)**
   * 选择餐饮、超市、机票、酒店、租金、加油或打车消费类别与预估金额
   * 系统实时计算您卡包中收益最高（返点% + 点数估值$）的 #1 推荐卡片

7. **✈️ 转点伙伴矩阵 (Transfer Bonus Matrix)**
   * Chase UR, Amex MR, CapOne, Bilt 转接 15+ 航空/酒店伙伴的汇率与到账速度
   * **Transfer Bonus 限时加赠提醒**（如 Amex 转 Virgin Atlantic +30% 加赠）
   * 互动转点计算器：输入银行点数实时换算目标里程

8. **🛡️ 5/24 规则与银行护栏 (Chase 5/24 & Bank Rules)**
   * 可视化 5/24 动态仪表盘（绿灯安全可申卡 / 红灯受限提示）
   * 记录近 24 个月内新卡开立与滴水解禁时间 (Drop-off date)
   * 集成 Amex Lifetime 规则、Citi 8/65 规则、CapOne 1/6 规则避坑知识库

9. **👥 原生 P1 / P2 家庭多玩家架构 (Household Multi-Player)**
   * 一键切换 P1 (主持卡人)、P2 (配偶/副持卡人) 或家庭联合总览模式

---

## 🛠️ 技术栈 (Tech Stack)

* **Core Framework**: React 19 + TypeScript + Vite 8
* **Styling**: Tailwind CSS v4 + Vanilla Glassmorphism Aesthetics
* **Icons**: Lucide React Icons
* **Local State**: Flexible Data Models & Zero-Trust Local Storage Architecture

---

## 🚀 启动与构建指南 (Commands)

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地开发服务器
```bash
npm run dev
```
打开浏览器访问 `http://localhost:5173/`

### 3. 生产环境打包构建
```bash
npm run build
```

---

## 📁 目录结构 (Project Layout)

```
Points Mile/
├── src/
│   ├── data/
│   │   └── mockData.ts         # 包含信用卡、飞行里程、酒店、租车及转点真实数据
│   ├── components/
│   │   ├── Header.tsx          # 顶部导航与 P1/P2 家庭视角切换
│   │   ├── Sidebar.tsx         # 左侧 8 大功能菜单栏
│   │   ├── DashboardTab.tsx    # 总览控制台与 KPI 挂件
│   │   ├── CardsTab.tsx        # 信用卡钱包与报销清单
│   │   ├── AirlinesTab.tsx     # 飞行里程与 Companion Pass
│   │   ├── HotelsTab.tsx       # 酒店会籍与 FNC 免房券
│   │   ├── CarRentalTab.tsx    # 租车 Match 路线与 CDW 主险
│   │   ├── MerchantFinderTab.tsx # 刷卡神器逻辑计算器
│   │   ├── TransferMatrixTab.tsx # 转点伙伴与 Bonus 矩阵
│   │   └── Chase524Tab.tsx     # 5/24 规则与银行护栏
│   ├── App.tsx                 # 主入口与全局数据状态联结
│   ├── main.tsx
│   └── index.css               # 深色奢华玻璃态 CSS 系统
├── vite.config.ts
├── package.json
└── README.md
```
