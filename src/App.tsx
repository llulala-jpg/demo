import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  Headphones, 
  ChevronRight, 
  Wallet, 
  PieChart, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Smartphone, 
  Gift, 
  LayoutGrid,
  TrendingUp,
  Clock,
  CheckCircle2,
  Home,
  FileText,
  User,
  Send,
  X,
  MessageCircle,
  Ellipsis,
  Info,
  History,
  Shield,
  HelpCircle,
  ArrowUpRight,
  Sparkles,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { getChatResponse } from './services/geminiService';

// --- Types ---
type Page = 'home' | 'bill-analysis' | 'repayment' | 'credit-info' | 'mascot-steward';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Components ---

const Header = ({ onCreditClick, onBillClick }: { onCreditClick: () => void, onBillClick: () => void }) => (
  <div className="relative bg-gradient-to-b from-[#1677FF] to-[#4096FF] pt-12 pb-20 px-4 text-white">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <ArrowLeft size={24} />
        <span className="text-xl font-medium">花呗</span>
      </div>
      <div className="flex gap-4">
        <Headphones size={22} />
        <Settings size={22} />
      </div>
    </div>
    
    <div className="flex flex-col items-center">
      <p className="text-sm opacity-80 mb-1">4月账单累计中(元)</p>
      <div className="flex items-baseline gap-1 mb-4 cursor-pointer" onClick={onBillClick}>
        <span className="text-4xl font-semibold tracking-tight">510.63</span>
        <ChevronRight size={20} className="opacity-60" />
      </div>
      <button 
        onClick={onBillClick}
        className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm border border-white/30 flex items-center gap-1 active:scale-95 transition-transform"
      >
        查看我的账单详情 <ChevronRight size={14} />
      </button>
    </div>

    <div className="grid grid-cols-2 mt-8 px-4">
      <div className="flex flex-col cursor-pointer" onClick={onBillClick}>
        <span className="text-xs opacity-70">总计账单</span>
        <span className="text-lg font-medium">还款日每月25日</span>
      </div>
      <div className="flex flex-col items-end cursor-pointer" onClick={onCreditClick}>
        <span className="text-xs opacity-70">总计额度</span>
        <span className="text-lg font-medium">0.00可用</span>
      </div>
    </div>
  </div>
);

const ConsumptionGoalCard = ({ 
  goalType, 
  goalAmount, 
  onModify, 
  onAnalysisClick, 
  onRepayClick 
}: { 
  goalType: string, 
  goalAmount: number, 
  onModify: () => void,
  onAnalysisClick: () => void,
  onRepayClick: () => void
}) => {
  // Fixed Underlying Data
  const spent = 1280;
  const vsUsual = "+18%";
  const dueAmount = 860;
  const daysLeft = 16;
  const spentCount = 19;
  const avgSpentCount = 15;

  let status = "";
  let summary = "";
  let mainBtn = { label: "", action: () => {} };
  let subBtn = { label: "", action: () => {} };
  let coreStats: { label: string, value: string, highlight?: boolean }[] = [];
  let progress = 0;
  let goalDisplay = "";

  if (goalType === '稳还款') {
    status = "还算稳";
    summary = "这月花得比平时多一点，不过离还款日还有些时间，现在先把后半月节奏看住，还款会更从容。";
    mainBtn = { label: "怎么还更稳", action: onRepayClick };
    subBtn = { label: "看看原因", action: onAnalysisClick };
    coreStats = [
      { label: "已消费", value: `¥${spent}` },
      { label: "待还金额", value: `¥${dueAmount}` },
      { label: "比平时", value: vsUsual, highlight: true }
    ];
    progress = 60; 
    goalDisplay = "稳还款";
  } else if (goalType === '控总额') {
    const reachedPercent = Math.round((spent / goalAmount) * 100);
    status = "有点快了";
    summary = "你已经用了目标额度的七成多，整体还没超，但最近外卖和打车花得快了一点，再稳一稳会更舒服。";
    mainBtn = { label: "看看原因", action: onAnalysisClick };
    subBtn = { label: "怎么还更稳", action: onRepayClick };
    coreStats = [
      { label: "已消费", value: `¥${spent}` },
      { label: "已达目标", value: `${reachedPercent}%` },
      { label: "比平时", value: vsUsual, highlight: true }
    ];
    progress = reachedPercent;
    goalDisplay = `控总额 ¥${goalAmount}`;
  } else if (goalType === '少超支') {
    status = "要留意啦";
    summary = "这月花得快，主要不是单笔买贵了，而是消费次数比平时更密了，先把高频小额支出收一收会更稳。";
    mainBtn = { label: "看看哪里花得快", action: onAnalysisClick };
    subBtn = { label: "怎么还更稳", action: onRepayClick };
    coreStats = [
      { label: "本月消费", value: `${spentCount}次` },
      { label: "比平时多", value: `${spentCount - avgSpentCount}次` },
      { label: "比平时", value: vsUsual, highlight: true }
    ];
    progress = 80;
    goalDisplay = "少超支";
  }

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-4 -mt-12 mb-4 bg-white rounded-[24px] p-5 shadow-xl shadow-blue-500/5 border border-blue-50 relative overflow-hidden group"
    >
      {/* Background IP Element */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.04] group-hover:opacity-[0.06] transition-opacity pointer-events-none rotate-12 scale-150">
        <MascotIcon size={160} />
      </div>

      {/* Layer 1: Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 overflow-hidden border border-blue-100">
            <MascotIcon size={20} className="scale-125" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">本月消费目标</h3>
        </div>
        <div className="bg-blue-50 text-blue-600 text-[10px] px-2.5 py-1 rounded-full font-bold border border-blue-100">
          小花在帮你看着
        </div>
      </div>

      {/* Layer 2: Goal Info */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-400">目标：</span>
          <span className="text-lg font-bold text-gray-900">{goalDisplay}</span>
        </div>
        <button 
          onClick={onModify}
          className="text-xs text-blue-600 font-medium px-3 py-1 rounded-full bg-blue-50/50 hover:bg-blue-50 transition-colors"
        >
          修改
        </button>
      </div>

      {/* Layer 3: Core Status */}
      <div className="grid grid-cols-3 gap-4 mb-4 relative z-10">
        {coreStats.map((stat, idx) => (
          <div key={idx}>
            <p className="text-[10px] text-gray-400 mb-1">{stat.label}</p>
            <p className={cn("text-base font-bold", stat.highlight ? "text-orange-500" : "text-gray-900")}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden mb-5 relative z-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn(
            "h-full rounded-full",
            progress > 85 ? "bg-orange-500" : "bg-blue-500"
          )}
        />
      </div>

      {/* Layer 4: Auxiliary Status */}
      <div className="flex items-center justify-between py-3 border-t border-gray-50 mb-4 relative z-10">
        <div className="flex gap-4">
          <div>
            <span className="text-[10px] text-gray-400">待还金额 </span>
            <span className="text-xs font-bold text-gray-800">¥{dueAmount}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400">距还款日 </span>
            <span className="text-xs font-bold text-gray-800">{daysLeft}天</span>
          </div>
        </div>
        <div className={cn(
          "text-[10px] px-2 py-0.5 rounded font-bold",
          status === "还算稳" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
        )}>
          {status}
        </div>
      </div>

      {/* Layer 5: Mascot Summary + CTA */}
      <div className="space-y-4 relative z-10">
        <div className="bg-blue-50/40 backdrop-blur-sm p-3.5 rounded-2xl border border-blue-100/30 relative">
          <div className="absolute -top-2 left-4 bg-white px-2 py-0.5 rounded-full border border-blue-50 text-[9px] font-bold text-blue-500">
            小花说
          </div>
          <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
            “{summary}”
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={mainBtn.action}
            className="py-2.5 rounded-xl bg-[#1677FF] text-white text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          >
            {mainBtn.label}
          </button>
          <button 
            onClick={subBtn.action}
            className="py-2.5 rounded-xl bg-white text-gray-700 text-sm font-bold border border-gray-100 shadow-sm active:scale-95 transition-transform"
          >
            {subBtn.label}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const QuickActions = () => {
  const actions = [
    { icon: <Smartphone className="text-blue-500" />, label: '生活号' },
    { icon: <Gift className="text-orange-400" />, label: '花呗金' },
    { icon: <Zap className="text-cyan-500" />, label: '闪购特权' },
    { icon: <PieChart className="text-indigo-500" />, label: '分期生活' },
    { icon: <FileText className="text-blue-400" />, label: '账单助手' },
    { icon: <Wallet className="text-blue-600" />, label: '备用金' },
    { icon: <CheckCircle2 className="text-blue-500" />, label: '花呗皮肤' },
    { icon: <LayoutGrid className="text-gray-400" />, label: '全部' },
  ];

  return (
    <div className="bg-white mx-4 rounded-2xl p-4 mb-4 grid grid-cols-4 gap-y-6">
      {actions.map((action, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            {action.icon}
          </div>
          <span className="text-xs text-gray-600">{action.label}</span>
        </div>
      ))}
    </div>
  );
};

const TrustGrowthCard = () => (
  <div className="bg-white mx-4 rounded-2xl p-4 mb-4 flex items-center justify-between border border-teal-50 shadow-sm shadow-teal-500/5">
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center">
          <ShieldCheck size={32} className="text-teal-500" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-teal-500 text-white text-[8px] px-1.5 py-0.5 rounded-full border-2 border-white">
          LV.4
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 flex items-center gap-1">
          信任成长 <span className="text-teal-500 text-xs font-normal">稳步提升中</span>
        </h4>
        <div className="flex gap-2 mt-1">
          <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">已开启自动还款</span>
          <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">连续按时还款</span>
        </div>
      </div>
    </div>
    <ChevronRight size={20} className="text-gray-300" />
  </div>
);

const InstallmentSection = () => (
  <div className="px-4 mb-20">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold text-gray-800">分期生活</h3>
      <span className="text-xs text-gray-400 flex items-center">更多 <ChevronRight size={14} /></span>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
      {[1, 2, 3].map((i) => (
        <div key={i} className="min-w-[140px] bg-white rounded-xl p-3 border border-gray-100">
          <div className="w-full aspect-square bg-gray-50 rounded-lg mb-2 flex items-center justify-center">
             <Smartphone className="text-gray-300" size={40} />
          </div>
          <div className="flex gap-1 mb-1">
            <span className="text-[9px] bg-blue-500 text-white px-1 rounded">3期</span>
            <span className="text-[9px] bg-orange-500 text-white px-1 rounded">免息</span>
          </div>
          <p className="text-xs font-medium text-gray-800">¥32.33/期</p>
          <button className="w-full mt-2 py-1.5 bg-blue-500 text-white text-[10px] rounded-full font-medium">去购买</button>
        </div>
      ))}
    </div>
  </div>
);

const BottomNav = ({ activePage, onNavigate }: { activePage: Page, onNavigate: (page: Page) => void }) => (
  <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-2 pb-6 flex justify-between items-center z-[110]">
    <div 
      className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", activePage === 'home' ? "text-blue-600 font-bold" : "text-gray-400")}
      onClick={() => onNavigate('home')}
    >
      <Home size={20} />
      <span className="text-[10px]">首页</span>
    </div>
    <div 
      className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", activePage === 'bill-analysis' ? "text-blue-600 font-bold" : "text-gray-400")}
      onClick={() => onNavigate('bill-analysis')}
    >
      <FileText size={20} />
      <span className="text-[10px]">账单</span>
    </div>
    <div 
      className={cn("flex flex-col items-center gap-1 cursor-pointer transition-colors", activePage === 'credit-info' ? "text-blue-600 font-bold" : "text-gray-400")}
      onClick={() => onNavigate('credit-info')}
    >
      <CreditCard size={20} />
      <span className="text-[10px]">额度</span>
    </div>
    <div className="flex flex-col items-center gap-1 text-gray-400 opacity-40 cursor-not-allowed">
      <User size={20} />
      <span className="text-[10px]">我的</span>
    </div>
  </div>
);

const MascotIcon = ({ className, size = 48 }: { className?: string, size?: number }) => (
  <div className={cn("relative flex items-center justify-center shrink-0", className)} style={{ width: size, height: size }}>
    {/* Irregular Cloud Body (SVG for better control) */}
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm">
      <path 
        d="M50,15 C65,15 75,25 85,35 C95,45 95,60 85,70 C75,80 65,85 50,85 C35,85 25,80 15,70 C5,60 5,45 15,35 C25,25 35,15 50,15" 
        fill="#FFE4E6" 
      />
      <circle cx="50" cy="50" r="30" fill="#FFE4E6" />
      <circle cx="30" cy="40" r="18" fill="#FFE4E6" />
      <circle cx="70" cy="40" r="18" fill="#FFE4E6" />
      <circle cx="25" cy="65" r="15" fill="#FFE4E6" />
      <circle cx="75" cy="65" r="15" fill="#FFE4E6" />
      <circle cx="50" cy="75" r="15" fill="#FFE4E6" />
      
      {/* Central Blush Gradient */}
      <defs>
        <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF4D4D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="25" ry="15" fill="url(#blushGradient)" />
      
      {/* Eyes */}
      <rect x="42" y="42" width="3" height="4" rx="1.5" fill="#333" transform="rotate(-15 43.5 44)" />
      <rect x="55" y="42" width="3" height="4" rx="1.5" fill="#333" transform="rotate(15 56.5 44)" />
    </svg>
    
    {/* Arms (Green) */}
    <div className="absolute -left-[5%] top-[60%] w-[15%] h-[30%] bg-[#A3E635] rounded-full rotate-[-25deg] shadow-sm" />
    <div className="absolute -right-[5%] top-[60%] w-[15%] h-[30%] bg-[#A3E635] rounded-full rotate-[25deg] shadow-sm" />
    
    {/* Legs (Yellow) */}
    <div className="absolute -bottom-[5%] left-[35%] w-[12%] h-[20%] bg-[#FDE047] rounded-t-lg shadow-sm" />
    <div className="absolute -bottom-[5%] right-[35%] w-[12%] h-[20%] bg-[#FDE047] rounded-t-lg shadow-sm" />
  </div>
);

const ChatAssistant = ({ activePage, onOpenSteward }: { activePage: Page, onOpenSteward: (question: string) => void }) => {
  const [bubbleState, setBubbleState] = useState(0);
  
  const contextBubbles: Record<Page, string[]> = {
    'home': [
      "这月花得挺稳，帮你整理好了",
      "最近花得有点快，我帮你拆开看了",
      "离还款日还有 4 天，我把几种还法算好了",
      "有笔额度还在恢复中，点我看看原因"
    ],
    'bill-analysis': [
      "想知道为什么这月餐饮花得多吗？",
      "这周消费节奏有点快，点我分析",
      "帮你对比了上月，点我看看变化"
    ],
    'repayment': [
      "这几种还法哪种更省钱？点我对比",
      "担心下月压力大？我帮你算算",
      "入账时间晚？点我看看平衡方案"
    ],
    'credit-info': [
      "为什么额度还没完全恢复？点我查看",
      "想提升信用成长？点我看看建议",
      "这笔占用额度什么时候释放？"
    ],
    'mascot-steward': [] // Not shown when in steward view
  };

  const currentBubbles = contextBubbles[activePage] || contextBubbles['home'];

  useEffect(() => {
    setBubbleState(0);
    const interval = setInterval(() => {
      setBubbleState((prev) => (prev + 1) % currentBubbles.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [activePage, currentBubbles.length]);

  if (activePage === 'mascot-steward') return null;

  return (
    <motion.div
      drag
      dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onOpenSteward(currentBubbles[bubbleState])}
      className="fixed right-4 bottom-24 z-[60] cursor-pointer drop-shadow-lg flex flex-col items-end"
    >
      <AnimatePresence mode="wait">
        {currentBubbles.length > 0 && (
          <motion.div
            key={`${activePage}-${bubbleState}`}
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl rounded-br-none shadow-sm border border-blue-100 mb-2 text-[10px] text-blue-600 font-medium whitespace-nowrap"
          >
            {currentBubbles[bubbleState]}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative">
        <MascotIcon />
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full shadow-md animate-pulse">
          <Sparkles size={12} />
        </div>
      </div>
    </motion.div>
  );
};

// --- Mascot Steward View (Upgraded Chat) ---

const MascotStewardView = ({ onClose, onNavigate, initialQuestion }: { onClose: () => void, onNavigate: (page: Page) => void, initialQuestion?: string }) => {
  const [activeTab, setActiveTab] = useState<'consumption' | 'repayment' | 'credit' | 'health'>('consumption');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "哈喽呀！我是你的超级省钱搭子『花小呗』🌸。最近是在发愁哪笔开支，还是想看看额度怎么涨？尽管问我，咱们一起把账单理清，让钱花在刀刃上！✨" }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = useCallback(async (question: string) => {
    if (!question.trim() || isStreaming) return;
    
    const userMessage: Message = { role: 'user', text: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const systemPrompt = `你是一位专业、亲切且充满活力（年轻感）的消费管家『花小呗』🌸。
你的特质：
1. 说话风格：像邻家小姐姐/好哥们，多用“哇”、“好哒”、“别担心”、“咱们一起看看”等语气词，善用 Emoji（如 ✨, 💸, 📊, 🚀, 🌸）。
2. 分析模型：
   - 消费：关注餐饮、出行、日常剁手。
   - 额度：关注为什么没恢复、怎么提额。
   - 还款：关注怎么分期、怎么还压力小。
3. 决策建议：不要只描述现象，要给出明确的“下一步建议”。
4. 交互引导：在回答中，如果涉及到具体功能，可以使用特定格式插入跳转按钮。
   格式：[按钮名称|页面ID]
   可用页面ID：
   - bill-analysis (跳转到账单分析)
   - credit-info (跳转到额度详情)
   - repayment (跳转到还款建议)
   例子：“想看看详细的消费分布吗？点击这里直达：[查看详细诊断|bill-analysis]”

请记住：你的目标是让用户觉得理财不枯燥，还款有希望，消费有把控！`;
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: "user", content: question }
          ]
        })
      });

      if (!response.ok) throw new Error("Failed to fetch from AI");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'model' as const, text: '' };
      
      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last partial line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data:')) {
              try {
                const data = JSON.parse(trimmedLine.slice(5));
                const content = data.output.choices[0].message.content;
                const newText = typeof content === 'string' ? content : content[0].text;
                
                assistantMessage.text += newText;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              } catch (e) {
                // Ignore parse errors for partial or non-JSON lines
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "抱歉，小花刚才走神了，请再试一次吧~" }]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  // Removed automatic question on mount as requested
  // useEffect(() => {
  //   if (initialQuestion) {
  //     handleAsk(initialQuestion);
  //   }
  // }, [initialQuestion, handleAsk]);

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-gradient-to-b from-[#F9F5FF] via-[#FFFFFF] to-[#F9F5FF] z-[120] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between shrink-0">
        <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-800" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-100 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center">
              <MascotIcon size={16} className="scale-125" />
            </div>
            <span className="text-xs font-bold text-purple-900">花小呗 · 消费管家</span>
          </div>
        </div>
        <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
          <Ellipsis size={24} className="text-gray-400" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-6 pb-40">
        {/* 1. Identity Area */}
        <div className="flex flex-col items-center text-center pt-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-100 to-pink-100 p-1 shadow-inner">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <MascotIcon size={80} />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-purple-50 flex items-center gap-1">
              <span className="text-[10px] text-gray-400">信任成长</span>
              <span className="text-[10px] font-bold text-purple-600">稳步中</span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800">小花在帮你看着</h2>
          <p className="text-xs text-gray-400 mt-1">最近消费状态：<span className="text-orange-500 font-bold">有点快了</span></p>
        </div>

        {/* 2. Current Status Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-xl shadow-purple-500/5 border border-purple-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <div className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">中等偏高</div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-[10px] text-gray-400 mb-1">本月已消费</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">2,180</span>
                <span className="text-[10px] text-orange-500 font-bold">比平时 +32%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">距离还款日</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">4</span>
                <span className="text-[10px] text-gray-400">天</span>
              </div>
            </div>
          </div>
          <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
            <p className="text-xs text-purple-800 leading-relaxed">
              <span className="font-bold">小花总结：</span>这月你花得比平时多一些，主要是餐饮和出行在涨，离还款日也不远了，建议你先看看怎么还更稳。
            </p>
          </div>
        </div>

        {/* 4. Perspective Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-gray-800">今日洞察</h3>
            <span className="text-[10px] text-gray-400">更新于 08:41</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              {activeTab === 'consumption' && (
                <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between group cursor-pointer" onClick={() => handleAsk('我为什么这月花得多？')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">高频小额消费增加</p>
                      <p className="text-[10px] text-gray-400">餐饮、出行频次比平时多 8 次</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
                </div>
              )}
              {activeTab === 'repayment' && (
                <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between group cursor-pointer" onClick={() => handleAsk('哪种还法更适合我？')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">建议关注“平衡还”</p>
                      <p className="text-[10px] text-gray-400">入账晚于还款日，建议留出缓冲</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
                </div>
              )}
              {activeTab === 'credit' && (
                <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between group cursor-pointer" onClick={() => handleAsk('为什么我的额度还没恢复？')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">1 笔退款恢复中</p>
                      <p className="text-[10px] text-gray-400">预计 1-3 个工作日完成结算</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
                </div>
              )}
              {activeTab === 'health' && (
                <div className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between group cursor-pointer" onClick={() => handleAsk('我最近花得健康吗？')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">消费节奏“有点快了”</p>
                      <p className="text-[10px] text-gray-400">建议本周适当控制非必要支出</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-500 transition-colors" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5. Chat History (Structured Answers) */}
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
              {msg.role === 'user' ? (
                <div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm shadow-sm max-w-[80%]">
                  {msg.text}
                </div>
              ) : (
                <div className="space-y-3 max-w-[90%]">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm">
                    <div className="text-xs text-gray-800 leading-relaxed">
                      {msg.text.split(/(\[.*?\|.*?\])/g).map((part, i) => {
                        const match = part.match(/\[(.*?)\|(.*?)\]/);
                        if (match) {
                          const [, label, action] = match;
                          return (
                            <button
                              key={i}
                              onClick={() => onNavigate(action as Page)}
                              className="my-3 flex items-center justify-between w-full bg-purple-50 text-purple-600 px-4 py-3 rounded-2xl text-[11px] font-bold border border-purple-100 hover:bg-purple-100 transition-all active:scale-[0.98] group"
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles size={14} className="animate-pulse" />
                                {label}
                              </div>
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          );
                        }
                        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
                      })}
                    </div>
                    
                    {/* Knowledge Card Integration */}
                    {msg.text.includes('额度') && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Info size={14} className="text-blue-500" />
                          <span className="text-xs font-bold text-gray-700">术语小百科：额度恢复中</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          退款发起后，额度正在回退但还没完全到账。常见原因包括：流程未完成、商户确认中、系统结算中。
                        </p>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {(msg as any).actions && (
                    <div className="flex flex-wrap gap-2">
                      {(msg as any).actions.map((btn: any, i: number) => (
                        <button 
                          key={i}
                          className="px-4 py-2 bg-white text-purple-600 text-xs font-bold rounded-full border border-purple-100 shadow-sm active:scale-95 transition-transform"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 6. Dynamic Suggested Questions */}
        <div className="space-y-3 pt-4">
          <p className="text-[10px] text-gray-400 px-1">你可能想问</p>
          <div className="flex flex-wrap gap-2">
            {[
              '我为什么这月花得多？',
              '哪种还法更适合我？',
              '为什么我的额度还没恢复？',
              '我最近花得健康吗？',
              '这月哪些地方还能控制一下？'
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => handleAsk(q)}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-600 text-xs rounded-full border border-purple-50 shadow-sm hover:bg-white hover:text-purple-600 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Input */}
      <div className="shrink-0 bg-white/80 backdrop-blur-md border-t border-purple-50">
        {/* Fixed Perspective Tabs above Input */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 border-b border-gray-50">
          {[
            { id: 'consumption', label: '消费变化', icon: <TrendingUp size={12} />, q: '我为什么这月花得多？' },
            { id: 'repayment', label: '还款安排', icon: <Calendar size={12} />, q: '哪种还法更适合我？' },
            { id: 'credit', label: '额度状态', icon: <Shield size={12} />, q: '为什么我的额度还没恢复？' },
            { id: 'health', label: '消费健康', icon: <CheckCircle2 size={12} />, q: '我最近花得健康吗？' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                handleAsk(tab.q);
              }}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
                activeTab === tab.id 
                  ? "bg-purple-600 text-white shadow-sm" 
                  : "bg-gray-50 text-gray-500 border border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 flex items-center border border-purple-50">
            <input 
              type="text" 
              placeholder={isStreaming ? "小花正在思考中..." : "输入文本或长按说话..."} 
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
              disabled={isStreaming}
            />
            <button className="text-gray-400 hover:text-purple-500 transition-colors">
              <MessageCircle size={20} />
            </button>
          </div>
          <button 
            onClick={() => handleAsk(input)}
            disabled={isStreaming || !input.trim()}
            className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-200 active:scale-90 transition-transform disabled:opacity-50 disabled:bg-gray-400"
          >
            {isStreaming ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-center text-[9px] text-gray-300 mt-2">内容由 AI 生成</p>
      </div>
    </div>
  </motion.div>
  );
};

// --- Repayment View Components ---

const RepaymentView = ({ onClose }: { onClose: () => void }) => {
  const [selectedPlan, setSelectedPlan] = useState<'省心还' | '平衡还' | '省钱还'>('平衡还');
  const [showMascotExplain, setShowMascotExplain] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const plans = [
    {
      id: '省心还',
      title: '省心还',
      currentPay: '380.00',
      nextPay: '380.00 × 6期',
      cost: '120.00',
      pressure: '低',
      scenario: '下次入账还没到、这月消费明显高于平时',
      reason: '你这月待还金额高于平时，先把本期压力降下来会更稳妥',
      isRecommended: false,
    },
    {
      id: '平衡还',
      title: '平衡还',
      currentPay: '760.00',
      nextPay: '760.00 × 3期',
      cost: '60.00',
      pressure: '中',
      scenario: '想留一点缓冲，又不想成本太高',
      reason: '你当前账单略高于平时，但还不到必须拉长周期的程度，这种还法更均衡',
      isRecommended: true,
    },
    {
      id: '省钱还',
      title: '省钱还',
      currentPay: '2,180.00',
      nextPay: '0',
      cost: '0.00',
      pressure: '高',
      scenario: '当前资金较充足，希望尽快结清',
      reason: '如果你本期资金能周转开，这种方式最省钱、也最利落',
      isRecommended: false,
    }
  ];

  if (isConfirmed) {
    return (
      <DetailView title="还款处理中" onClose={onClose}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">还款方案已确认</h3>
          <p className="text-sm text-gray-500 mb-8">正在为您按“{selectedPlan}”方案处理账单</p>
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-[#1677FF] text-white rounded-full font-bold shadow-lg shadow-blue-500/20"
          >
            返回首页
          </button>
        </div>
      </DetailView>
    );
  }

  return (
    <DetailView title="还款安排" onClose={onClose}>
      <div className="space-y-4 pb-24">
        {/* Core Bill Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <button className="text-blue-500 text-xs font-medium flex items-center gap-1">
              账单明细 <ChevronRight size={12} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-1">本月待还总额(元)</p>
          <h3 className="text-4xl font-bold text-gray-900 tracking-tight">2,180.00</h3>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">最晚还款日 4月10日</span>
            <span className="text-[10px] text-gray-400">下次入账 4月14日</span>
          </div>
        </div>

        {/* AI Repayment Assistant */}
        <div className="space-y-3">
          {/* Layer 1: Status Judgment */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none rotate-12">
              <MascotIcon size={100} />
            </div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <MascotIcon size={18} className="scale-125" />
                </div>
                <span className="text-xs font-bold text-blue-900">AI 还款方案助手</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400">当前还款压力</span>
                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">中压力偏高</span>
              </div>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed relative z-10">
              你下次入账离还款日有点近，建议先看哪种方案更稳妥。
            </p>
          </div>

          {/* Layer 2: Three Plan Cards */}
          <div className="space-y-3">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                  selectedPlan === plan.id 
                    ? "bg-white border-blue-500 shadow-lg shadow-blue-500/5" 
                    : "bg-white border-gray-100 opacity-70"
                )}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-bl-lg font-bold">
                    更适合你
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">{plan.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{plan.scenario}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">本期支付</p>
                    <p className="text-lg font-bold text-gray-900">¥{plan.currentPay}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedPlan === plan.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-gray-50 grid grid-cols-3 gap-2 mb-3">
                        <div>
                          <p className="text-[9px] text-gray-400 mb-0.5">后续每期</p>
                          <p className="text-xs font-bold text-gray-800">¥{plan.nextPay}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 mb-0.5">总成本</p>
                          <p className="text-xs font-bold text-gray-800">¥{plan.cost}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-400 mb-0.5">未来30天压力</p>
                          <p className={cn(
                            "text-xs font-bold",
                            plan.pressure === '低' ? "text-green-500" : plan.pressure === '中' ? "text-orange-500" : "text-red-500"
                          )}>{plan.pressure}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50/30 p-2.5 rounded-xl border border-blue-100/30">
                        <p className="text-[10px] text-blue-800 leading-relaxed">
                          <span className="font-bold">AI 理由：</span>{plan.reason}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ask Mascot Entry */}
        <div 
          className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer group"
          onClick={() => setShowMascotExplain(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
              <MascotIcon size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">问问花小呗</p>
              <p className="text-[10px] text-gray-500">“为什么推荐我用平衡还？”</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
        </div>

        {/* Other Options */}
        <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <Calendar size={18} />
              </div>
              <span className="text-sm text-gray-700">自动还款设置</span>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                <ShieldCheck size={18} />
              </div>
              <span className="text-sm text-gray-700">还款提醒服务</span>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white p-4 border-t border-gray-100 z-50">
          <button 
            onClick={() => setIsConfirmed(true)}
            className="w-full py-4 bg-[#1677FF] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
          >
            确认按“{selectedPlan}”处理
          </button>
        </div>

        {/* Mascot Explanation Layer */}
        <AnimatePresence>
          {showMascotExplain && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[110] flex items-end justify-center"
              onClick={() => setShowMascotExplain(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="w-full max-w-[430px] bg-white rounded-t-[32px] p-6 pb-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-1.5 bg-gray-100 rounded-full" />
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="shrink-0">
                    <MascotIcon size={48} />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-2xl rounded-tl-none border border-blue-100">
                      <p className="text-sm text-blue-900 font-bold mb-2">为什么推荐我用平衡还？</p>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        亲爱的，我注意到你这月的待还金额（¥2,180）比平时高了约 50%，而且你的工资入账（14日）晚于还款日（10日）。
                        <br /><br />
                        如果全还压力可能有点大，但分 6 期成本又偏高。“平衡还”分 3 期能帮你留出 ¥1,420 的周转资金，且总成本仅需 ¥60，是最均衡的选择哦！🌸
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => {
                          setSelectedPlan('平衡还');
                          setShowMascotExplain(false);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm"
                      >
                        选这个方案
                      </button>
                      <button 
                        onClick={() => setShowMascotExplain(false)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-100"
                      >
                        再比较一下
                      </button>
                      <button 
                        onClick={() => {
                          setShowMascotExplain(false);
                          // In a real app we'd navigate to analysis
                        }}
                        className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-full border border-gray-100"
                      >
                        去看账单分析
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DetailView>
  );
};
const DetailView = ({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) => (
  <motion.div 
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    className="absolute inset-0 bg-gray-50 z-[100] flex flex-col overflow-hidden"
  >
    <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-gray-100 shrink-0">
      <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <ArrowLeft size={24} className="text-gray-800" />
      </button>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {children}
    </div>
  </motion.div>
);

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [stewardQuestion, setStewardQuestion] = useState<string | undefined>();
  const [goalType, setGoalType] = useState('稳还款');
  const [goalAmount, setGoalAmount] = useState(1800);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [billCardIndex, setBillCardIndex] = useState(0);
  const [showLocalAnswer, setShowLocalAnswer] = useState(false);

  const openSteward = (question?: string) => {
    setStewardQuestion(question);
    setActivePage('mascot-steward');
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      {/* Mobile Container Emulator */}
      <div className="w-full max-w-[430px] bg-gray-50 h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans select-none">
        {activePage === 'home' && (
          <div className="flex-1 pb-24 overflow-y-auto custom-scrollbar">
            <Header 
              onCreditClick={() => setActivePage('credit-info')} 
              onBillClick={() => setActivePage('bill-analysis')}
            />
            <ConsumptionGoalCard 
              goalType={goalType}
              goalAmount={goalAmount}
              onModify={() => setShowGoalModal(true)}
              onAnalysisClick={() => setActivePage('bill-analysis')}
              onRepayClick={() => setActivePage('repayment')}
            />
            <QuickActions />
            <TrustGrowthCard />
            <InstallmentSection />
          </div>
        )}

        <ChatAssistant 
          activePage={activePage} 
          onOpenSteward={(q) => openSteward(q)} 
        />

      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-[430px] bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-gray-900 mb-6">修改消费目标</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-3">目标类型</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['控总额', '稳还款', '少超支'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setGoalType(type)}
                        className={cn(
                          "py-3 rounded-2xl text-xs font-bold transition-all",
                          goalType === type 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-200" 
                            : "bg-gray-50 text-gray-500 border border-gray-100"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {goalType === '控总额' && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-3">目标金额 (元)</p>
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-2 border border-gray-100">
                      <span className="text-xl font-bold text-gray-400">¥</span>
                      <input 
                        type="number" 
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold text-gray-900 outline-none w-full"
                      />
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="w-full py-4 bg-[#1677FF] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  保存并返回
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activePage === 'mascot-steward' && (
          <MascotStewardView 
            initialQuestion={stewardQuestion}
            onClose={() => {
              setActivePage('home');
              setStewardQuestion(undefined);
            }} 
            onNavigate={(p) => {
              setActivePage(p);
              setStewardQuestion(undefined);
            }}
          />
        )}
        {activePage === 'bill-analysis' && (
          <DetailView title="4月账单分析诊断" onClose={() => setActivePage('home')}>
            <div className="space-y-6 pb-32">
              {/* 1. Top Bill Amount Area */}
              <div className="px-5 pt-2">
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">4月账单累计中(元)</p>
                    <h3 className="text-4xl font-bold text-gray-900 tracking-tight">510.63</h3>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-blue-100/50">
                    <Zap size={10} fill="currentColor" /> AI 诊断中
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                        <img src={`https://picsum.photos/seed/user${i}/40/40`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">你和 1.2万 用户都在关注本月消费节奏</span>
                </div>
              </div>

              {/* 2. Horizontal Bill Diagnosis Card Group */}
              <div className="relative">
                <div 
                  className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 px-5 pb-4"
                  onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const width = e.currentTarget.offsetWidth;
                    const index = Math.round(scrollLeft / (width * 0.85));
                    if (index !== billCardIndex) setBillCardIndex(index);
                  }}
                >
                  {/* Card 1: 本期账单诊断 */}
                  <div className="min-w-[88%] snap-center">
                    <div className="bg-white rounded-[24px] shadow-xl shadow-blue-500/5 border border-blue-50 overflow-hidden flex flex-col h-full relative">
                      {/* Receipt Header Style */}
                      <div className="h-2 bg-blue-500/10 w-full" />
                      <div className="p-5 flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Sparkles size={14} className="text-blue-500" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">本期账单诊断</h4>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">NO. 20260409</span>
                        </div>

                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-gray-900 leading-snug">
                            这月花得比平时快了一点，主要是餐饮和出行在往上走。
                          </h3>
                        </div>

                        <div className="space-y-3 mb-6 border-t border-dashed border-gray-100 pt-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">诊断依据</p>
                          {[
                            '最近消费次数比平时更多',
                            '增长最多的是餐饮和出行',
                            '没有明显大额消费，主要是高频小额累积'
                          ].map((text, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                              <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
                            </div>
                          ))}
                        </div>

                        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/30">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-bold rounded">诊断结果</div>
                          </div>
                          <p className="text-xs text-blue-900/80 leading-relaxed mb-1">
                            离还款日还有16天，短期压力不大，但后半月需要留意节奏。
                          </p>
                          <p className="text-xs text-blue-900/80 leading-relaxed">
                            建议优先关注：<span className="font-bold underline decoration-blue-200 underline-offset-2">餐饮、出行、本月待还准备</span>
                          </p>
                        </div>
                      </div>
                      {/* Receipt Footer Style */}
                      <div className="h-1.5 bg-gray-50 flex gap-1 px-4 items-center">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-white" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: 这月花多在哪 */}
                  <div className="min-w-[88%] snap-center">
                    <div className="bg-white rounded-[24px] shadow-xl shadow-blue-500/5 border border-blue-50 overflow-hidden flex flex-col h-full relative">
                      <div className="h-2 bg-orange-500/10 w-full" />
                      <div className="p-5 flex-1">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center">
                              <LayoutGrid size={14} className="text-orange-500" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">这月花多在哪</h4>
                          </div>
                          <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded">Top 3 场景</span>
                        </div>

                        <div className="space-y-3">
                          {[
                            { label: '餐饮美食', val: '¥240.00', change: '+¥85', scene: '最近外卖和堂食频率都比平时高', icon: <UtensilsCrossed size={14} /> },
                            { label: '交通出行', val: '¥110.00', change: '上升明显', scene: '打车次数增加明显', icon: <Car size={14} /> },
                            { label: '日用百货', val: '¥160.63', change: '+¥42', scene: '零散小额购买较多', icon: <ShoppingBag size={14} /> },
                          ].map((item, idx) => (
                            <div key={idx} className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/50">
                              <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm">
                                    {item.icon}
                                  </div>
                                  <span className="text-xs font-bold text-gray-800">{item.label}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold text-gray-900">{item.val}</p>
                                  <p className="text-[9px] font-bold text-orange-500">{item.change}</p>
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-500 leading-relaxed">{item.scene}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-50 flex gap-1 px-4 items-center">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-white" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: 先处理这两件事 */}
                  <div className="min-w-[88%] snap-center">
                    <div className="bg-white rounded-[24px] shadow-xl shadow-blue-500/5 border border-blue-50 overflow-hidden flex flex-col h-full relative">
                      <div className="h-2 bg-green-500/10 w-full" />
                      <div className="p-5 flex-1">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                              <CheckCircle size={14} className="text-green-500" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-800">先处理这两件事</h4>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="p-3 bg-orange-50/30 rounded-xl border border-orange-100/30">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-gray-800">餐饮消费涨得快</span>
                              <button className="text-[10px] font-bold text-orange-600 bg-white px-2 py-1 rounded-lg border border-orange-100 shadow-sm">看看怎么省</button>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">如果后半月还按这个节奏，账单会进一步抬高</p>
                          </div>
                          <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-100/30">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-gray-800">¥366.90 退款未恢复</span>
                              <button className="text-[10px] font-bold text-blue-600 bg-white px-2 py-1 rounded-lg border border-blue-100 shadow-sm">查看进度</button>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed">这会影响你对当前可用额度的判断</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => setActivePage('repayment')}
                            className="py-2.5 rounded-xl bg-[#1677FF] text-white text-[11px] font-bold shadow-lg shadow-blue-500/20"
                          >
                            怎么还更稳
                          </button>
                          <button className="py-2.5 rounded-xl bg-gray-50 text-gray-700 text-[11px] font-bold border border-gray-100">
                            哪里花得快
                          </button>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-50 flex gap-1 px-4 items-center">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-white" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Page Indicator */}
                <div className="flex justify-center gap-1.5 mt-2">
                  {[0, 1, 2].map(i => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        billCardIndex === i ? "w-4 bg-blue-500" : "w-1 bg-gray-200"
                      )} 
                    />
                  ))}
                </div>
              </div>

              {/* 3. Xiao Hua continues to help you */}
              <div className="px-5">
                <div className="space-y-3">
                  <div 
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/50 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all"
                    onClick={() => setShowLocalAnswer(!showLocalAnswer)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <MascotIcon size={36} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">小花继续帮你看</p>
                        <p className="text-[10px] text-gray-500">“我为什么这月花得多？”</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-bold text-[10px]">
                      {showLocalAnswer ? '收起回答' : '立即追问'} <ChevronRight size={12} className={cn("transition-transform", showLocalAnswer && "rotate-90")} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {showLocalAnswer && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white rounded-2xl p-4 border border-blue-50 shadow-sm relative">
                          <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-l border-t border-blue-50 rotate-[-45deg]" />
                          <p className="text-xs text-gray-600 leading-relaxed mb-3">
                            “我看了一下，主要是因为这月你有几次聚餐和长途打车，单笔金额虽然不算巨大，但频率比上月高了 30%。建议下周可以多尝试公共交通，能省下不少哦。”
                          </p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => openSteward("帮我制定省钱计划")}
                              className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg"
                            >
                              制定省钱计划
                            </button>
                            <button 
                              onClick={() => openSteward("看看具体哪天花得多")}
                              className="text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg"
                            >
                              查看消费日历
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 4. Bill Details (Original List) */}
              <div className="px-5 pt-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">账单明细</h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">全部</span>
                    <span className="text-[10px] text-gray-400 px-2 py-1">退款</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { title: '火车票', cate: '交通出行', price: '401.90', date: '4月1日', icon: <Car size={18} /> },
                    { title: '南京地铁', cate: '交通出行', price: '3.00', date: '4月1日', icon: <Car size={18} /> },
                    { title: '小红书订单', cate: '文化休闲', price: '8.80', date: '4月1日', icon: <ShoppingBag size={18} /> },
                  ].map((bill, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-gray-50 shadow-sm shadow-gray-500/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500">
                          {bill.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{bill.title}</p>
                          <p className="text-[10px] text-gray-400">{bill.cate} | {bill.date}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">¥{bill.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DetailView>
        )}

        {activePage === 'repayment' && (
          <RepaymentView onClose={() => setActivePage('home')} />
        )}

        {activePage === 'credit-info' && (
          <DetailView title="总计额度" onClose={() => setActivePage('home')}>
            <div className="flex flex-col min-h-full -mt-4">
              {/* Core Info Area - Matches Screenshot Style */}
              <div className="bg-gradient-to-b from-blue-50 to-white pt-8 pb-10 px-4 flex flex-col items-center text-center">
                <p className="text-sm text-gray-500 mb-2">可用额度(元)</p>
                <h3 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">0.00</h3>
                <div className="flex items-center gap-1 text-gray-400 text-sm cursor-pointer">
                  <span>总计额度3,000.00</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* AI Credit Explanation Area - NEW */}
              <div className="px-4 -mt-4 mb-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white rounded-2xl p-5 shadow-xl shadow-blue-500/5 border border-blue-50 relative overflow-hidden group"
                >
                  {/* Background IP */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none rotate-12 scale-125">
                    <MascotIcon size={140} />
                  </div>

                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <MascotIcon size={24} className="scale-125" />
                    </div>
                    <h3 className="font-bold text-gray-800">AI 额度诊断</h3>
                    <div className="ml-auto bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-medium">深度解析中</div>
                  </div>

                  {/* A. 当前状态说明 */}
                  <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 mb-4 relative z-10">
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <span className="font-bold">当前状态：</span>可用额度低于总额度，主要因为存在<span className="text-orange-600 font-bold">占用中交易</span>。系统评估您的信用状态良好，额度恢复中。
                    </p>
                  </div>

                  {/* B. 原因解释模块 & C. 重点状态标签 */}
                  <div className="space-y-3 mb-5 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        <span className="text-xs text-gray-600">未完成交易占用</span>
                      </div>
                      <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">占用中</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-xs text-gray-600">某笔退款正在恢复</span>
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">恢复中</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <span className="text-xs text-gray-600">系统动态评估结果</span>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">动态评估中</span>
                    </div>
                  </div>

                  {/* D. 下一步动作 */}
                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    <button className="flex items-center justify-center gap-1 py-2 rounded-xl bg-gray-50 text-gray-700 text-[11px] font-medium hover:bg-gray-100 transition-colors">
                      <History size={12} /> 额度记录
                    </button>
                    <button className="flex items-center justify-center gap-1 py-2 rounded-xl bg-gray-50 text-gray-700 text-[11px] font-medium hover:bg-gray-100 transition-colors">
                      <ArrowUpRight size={12} /> 退款进度
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Original Banner Card - Matches Screenshot */}
              <div className="px-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100 flex flex-col items-center text-center">
                  <h4 className="text-sm font-bold text-gray-800 mb-4">花呗额度可取现 这些场景都能用</h4>
                  <div className="flex gap-3 mb-6">
                    {['支', '微信', '抖音', '转账'].map((item, i) => (
                      <div key={i} className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                        i === 0 ? "bg-[#1677FF]" : i === 1 ? "bg-[#07C160]" : i === 2 ? "bg-black" : "bg-[#1677FF]"
                      )}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-[#1677FF] text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/20">
                    立即取用
                  </button>
                </div>
              </div>

              {/* Quick Actions - Matches Screenshot Icons */}
              <div className="bg-white mx-4 rounded-2xl p-5 mb-6 grid grid-cols-3 gap-4 shadow-sm border border-gray-50">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs text-gray-600">使用明细</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                    <Clock size={24} />
                  </div>
                  <span className="text-xs text-gray-600">额度记录</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                    <LayoutGrid size={24} />
                  </div>
                  <span className="text-xs text-gray-600">额度管理</span>
                </div>
              </div>

              {/* Ask Mascot Entry - Scenario Based */}
              <div className="px-4 mb-6">
                <div 
                  className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-2xl border border-pink-100 flex items-center justify-between cursor-pointer"
                  onClick={() => setActivePage('home')}
                >
                  <div className="flex items-center gap-3">
                    <MascotIcon size={44} />
                    <div>
                      <p className="text-sm font-bold text-gray-800">问问花小呗</p>
                      <p className="text-[10px] text-gray-500">“为什么我的额度没恢复？”</p>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] text-pink-600 font-bold border border-pink-200">
                    立即提问
                  </div>
                </div>
              </div>

              {/* More Credit Section - Matches Screenshot */}
              <div className="px-4 pb-32">
                <h3 className="text-sm font-bold text-gray-400 mb-4 px-1">更多额度</h3>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
                  {[
                    { icon: <Wallet className="text-blue-500" />, label: '备用金', desc: '到账快 不用愁' },
                    { icon: <ShieldCheck className="text-blue-600" />, label: '借呗', desc: '放款快借钱方便' },
                    { icon: <Zap className="text-blue-400" />, label: '蚂蚁宝藏信用卡', desc: '测测你的额度****元' },
                    { icon: <PieChart className="text-blue-500" />, label: '网商贷', desc: '随借随还秒到账' },
                  ].map((item, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-4",
                      i !== 3 && "border-b border-gray-50"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs">{item.desc}</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DetailView>
        )}
      </AnimatePresence>

      {/* Global Bottom Nav for Main Tabs */}
      {['home', 'bill-analysis', 'credit-info', 'repayment'].includes(activePage) && (
        <BottomNav 
          activePage={activePage} 
          onNavigate={(p) => setActivePage(p)} 
        />
      )}
      </div>
    </div>
  );
}
