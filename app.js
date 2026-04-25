// ============================================================
// 树洞匿名社交平台 - app.js 第一部分
// 包含：数据层、常量、状态、工具函数、路由、模态框、
//       Hero折叠、搜索、筛选、帖子列表、发帖、详情、
//       举报、私信、图片查看器
// ============================================================

// ============ 1. 数据存储层 ============
const DB = {
  get(key, defaultVal = null) {
    try {
      const data = localStorage.getItem('treehole_' + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch { return defaultVal; }
  },
  set(key, val) {
    localStorage.setItem('treehole_' + key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem('treehole_' + key);
  }
};

// ============ 2. 常量定义 ============

// 频道映射
const CHANNELS = {
  campus: { name: '校园', icon: '🏫' },
  work: { name: '职场', icon: '💼' },
  emotion: { name: '情感', icon: '💕' },
  life: { name: '生活', icon: '🌿' },
  treehole: { name: '树洞', icon: '🌳' }
};

// 心情映射
const MOODS = {
  happy: { name: '开心', emoji: '😊' },
  calm: { name: '平静', emoji: '😌' },
  moved: { name: '感动', emoji: '🥹' },
  anxious: { name: '焦虑', emoji: '😰' },
  sad: { name: '难过', emoji: '😢' },
  angry: { name: '愤怒', emoji: '😤' },
  lost: { name: '迷茫', emoji: '😵' },
  expect: { name: '期待', emoji: '✨' }
};

// 标签映射
const TAGS = {
  daily: '日常',
  experience: '经验',
  secret: '心事',
  complain: '吐槽',
  help: '求助',
  share: '分享'
};

// 情绪反应映射
const EMOTIONS = {
  touched: { emoji: '🥴', label: '感动' },
  empathy: { emoji: '🤗', label: '心疼' },
  resonate: { emoji: '💪', label: '共鸣' },
  agree: { emoji: '👏', label: '赞同' },
  think: { emoji: '🤔', label: '深思' },
  warm: { emoji: '☀️', label: '温暖' }
};

// 角色映射
const ROLES = {
  student: { name: '学生党', icon: '🎓' },
  worker: { name: '打工人', icon: '💼' },
  freelancer: { name: '自由职业', icon: '🎨' },
  other: { name: '神秘旅人', icon: '🌟' }
};

// 可选 Emoji 列表（72个）
const EMOJI_LIST = [
  '😊','😂','🥰','😎','🤔','😢','😤','🥺',
  '😴','🤗','😇','🙃','😋','🤩','🥳','🤭',
  '🤭','🫣','🫢','🤫','😏','😒','🙄','😬',
  '😌','🤓','🧐','😈','👻','💀','🤖','👽',
  '🐱','🐶','🐻','🦊','🐰','🐼','🐨','🐯',
  '🌸','🌺','🌻','🌹','🍀','🌈','⭐','🌙',
  '🔥','💧','❄️','⚡','🎵','🎨','📚','✏️',
  '☕','🍰','🍕','🎮','🏀','🎯','💡','🔑'
];

// 背景颜色列表（12种）
const BG_COLORS = [
  '#5b8c6e','#6fa882','#d4728a','#d4944a',
  '#7b8cde','#c495d4','#e74c3c','#3498db',
  '#f39c12','#1abc9c','#9b59b6','#e67e22'
];

// MBTI 描述
const MBTI_DESCRIPTIONS = {
  INTJ: '富有想象力的战略思想家，凡事皆有计划。独立、果断，对自己和他人都有很高的要求。',
  INTP: '具有创新精神的发明家，对知识有着不可抑制的渴望。善于分析问题，追求逻辑和真理。',
  ENTJ: '大胆、富有想象力且意志强大的领导者，总能找到解决方案。天生的领袖，善于制定战略。',
  ENTP: '聪明好奇的思想者，不会放弃任何智力上的挑战。喜欢辩论，善于发现新的可能性。',
  INFJ: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。富有同理心，追求有意义的生活。',
  INFP: '诗意、善良的利他主义者，总是热心地为正义事业提供帮助。内心丰富，追求真实。',
  ENFJ: '富有魅力和鼓舞力的领导者，能够吸引听众。善于激励他人，是天生的导师和引路人。',
  ENFP: '热情、有创造力、善于社交的自由灵魂，总能找到微笑的理由。充满活力，善于发现美好。',
  ISTJ: '实际且注重事实的个人，可靠性不容怀疑。严谨、负责，重视传统和规则。',
  ISFJ: '非常专注且温暖的保护者，时刻准备着保护所爱的人。忠诚、体贴，善于照顾他人。',
  ESTJ: '出色的管理者，在管理事物或人方面无与伦比。务实、高效，善于组织。',
  ESFJ: '极有爱心、善于社交和受欢迎的人，总是热心帮助他人。友善、合作，重视和谐。',
  ISTP: '大胆而实际的实验家，擅长使用各种形式的工具。灵活、冷静，善于解决问题。',
  ISFP: '灵活而有魅力的艺术家，时刻准备着探索和体验新事物。敏感、温和，追求美感。',
  ESTP: '聪明、精力充沛且善于感知的人，真正享受生活在边缘。大胆、直接，喜欢冒险。',
  ESFP: '自发的、精力充沛且热情的人——生命在他们身边永远不会无聊。乐观、有趣，善于社交。'
};

// MBTI 契合度矩阵（简化版）
const MBTI_COMPATIBILITY = {
  'INTJ': { 'ENFP': 95, 'ENTP': 85, 'INFJ': 80, 'INTJ': 70 },
  'INTP': { 'ENTJ': 95, 'ENFP': 85, 'INTP': 70, 'INFJ': 80 },
  'ENTJ': { 'INTP': 95, 'ENFP': 85, 'ENTJ': 70, 'INFJ': 75 },
  'ENTP': { 'INTJ': 85, 'INFJ': 90, 'ENFP': 80, 'ENTP': 70 },
  'INFJ': { 'ENTP': 90, 'ENFP': 95, 'INFJ': 75, 'INTJ': 80 },
  'INFP': { 'ENFJ': 95, 'ENTJ': 80, 'ENFP': 85, 'INFP': 70 },
  'ENFJ': { 'INFP': 95, 'INFJ': 85, 'ENFJ': 75, 'ENFP': 80 },
  'ENFP': { 'INFJ': 95, 'INTJ': 95, 'ENFP': 75, 'INTP': 85 },
  'ISTJ': { 'ESFP': 85, 'ISFJ': 80, 'ESTJ': 75, 'ISTJ': 70 },
  'ISFJ': { 'ESFP': 90, 'ESTP': 85, 'ISFJ': 75, 'ISTJ': 80 },
  'ESTJ': { 'ISFP': 85, 'ISTP': 80, 'ESFJ': 75, 'ESTJ': 70 },
  'ESFJ': { 'ISFP': 90, 'ISTP': 85, 'ESFJ': 75, 'ISFJ': 80 },
  'ISTP': { 'ESFJ': 85, 'ESTJ': 80, 'ISTP': 70, 'ISFP': 75 },
  'ISFP': { 'ESFJ': 90, 'ESTJ': 85, 'ISFP': 70, 'ISTP': 75 },
  'ESTP': { 'ISFJ': 85, 'ISTJ': 80, 'ESTP': 70, 'ESFP': 75 },
  'ESFP': { 'ISFJ': 90, 'ISTJ': 85, 'ESFP': 70, 'ESTP': 75 }
};

// 敏感词正则（5类）
const SENSITIVE_PATTERNS = [
  { category: '暴力自残', regex: /杀|死|去死|自杀|自残|跳楼|割腕/ },
  { category: '毒品', regex: /毒品|吸毒|贩毒|大麻|海洛因|冰毒/ },
  { category: '赌博', regex: /赌博|赌场|下注|赌资/ },
  { category: '诈骗', regex: /诈骗|骗钱|传销|洗钱/ },
  { category: '色情', regex: /色情|裸照|约炮/ }
];

// 随机昵称生成
const NICKNAME_ADJECTIVES = ['温柔的','快乐的','安静的','勇敢的','自由的','神秘的','可爱的','酷酷的','善良的','聪明的','文艺的','浪漫的','孤独的','温暖的','淡然的','执着的','随性的','优雅的','憨憨的','佛系的'];
const NICKNAME_NOUNS = ['小熊','猫咪','兔子','星星','月亮','云朵','微风','花朵','树叶','小鱼','小鸟','蝴蝶','蜗牛','蘑菇','橡果','雪花','露珠','彩虹','晚风','晨光'];

// ============ 3. 应用状态 ============
const App = {
  currentPage: 'home',
  currentPostId: null,
  currentChatId: null,
  filters: { channel: 'all', tag: 'all', mbti: 'all', sort: 'latest' },
  searchQuery: '',
  calendarDate: new Date(),
  editingDiaryId: null,
  viewingDiaryId: null,
  viewingLetterId: null,
  messageTarget: null,
  reportTarget: null,
  mbtiTestAnswers: [],
  mbtiTestStep: 0,
  lastSendTime: 0,
  heroCollapsed: false,
  createChannel: '',
  createMood: '',
  createTags: [],
  createImage: ''
};

// ============ 4. 工具函数 ============

// 生成唯一 ID
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

// 时间格式化
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚';
  if (diff < hour) return Math.floor(diff / minute) + '分钟前';
  if (diff < day) return Math.floor(diff / hour) + '小时前';
  if (diff < 7 * day) return Math.floor(diff / day) + '天前';
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(timestamp));
}

function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(timestamp));
}

// 随机 Emoji
function randomEmoji() {
  return EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
}

// 随机颜色
function randomColor() {
  return BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
}

// 随机 MBTI
function randomMBTI() {
  const types = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
  return types[Math.floor(Math.random() * types.length)];
}

// 获取身份
function getIdentity() {
  return DB.get('my_identity', null);
}

// 保存身份
function saveIdentity(identity) {
  DB.set('my_identity', identity);
}

// 初始化身份（首次使用）
function initIdentity(role) {
  const identity = {
    id: genId(),
    nickname: randomNickname(),
    role: role,
    mbti: '',
    avatarStyle: 'emoji',
    emoji: randomEmoji(),
    bgColor: randomColor(),
    createdAt: Date.now()
  };
  saveIdentity(identity);
  return identity;
}

// 渲染头像 HTML
function renderAvatar(identity, size = 40) {
  if (!identity) return '';
  const style = identity.avatarStyle || 'emoji';
  if (style === 'emoji') {
    return `<div class="post-avatar post-avatar-emoji" style="width:${size}px;height:${size}px;font-size:${size*0.45}px">${identity.emoji || '😊'}</div>`;
  } else if (style === 'gradient') {
    const initial = (identity.nickname || '?')[0];
    return `<div class="post-avatar post-avatar-gradient" style="width:${size}px;height:${size}px;font-size:${size*0.4}px;background:linear-gradient(135deg,${identity.bgColor || '#5b8c6e'},${identity.bgColor || '#c4956a'})">${initial}</div>`;
  } else {
    const initial = (identity.nickname || '?')[0];
    return `<div class="post-avatar post-avatar-letter" style="width:${size}px;height:${size}px;font-size:${size*0.4}px">${initial}</div>`;
  }
}

// 获取角色标签 HTML
function renderRoleBadge(role) {
  const r = ROLES[role];
  if (!r) return '';
  return `<span class="role-badge">${r.icon} ${r.name}</span>`;
}

// 获取 MBTI 徽章 HTML
function renderMBTIBadge(mbti) {
  if (!mbti) return '';
  return `<span class="mbti-badge">${mbti}</span>`;
}

// 获取心情徽章 HTML
function renderMoodBadge(mood) {
  const m = MOODS[mood];
  if (!m) return '';
  return `<span class="mood-badge mood-${mood}">${m.emoji} ${m.name}</span>`;
}

// 获取标签 HTML
function renderTags(tags) {
  if (!tags || !tags.length) return '';
  return tags.map(t => `<span class="post-tag">${TAGS[t] || t}</span>`).join('');
}

// 防抖函数
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Toast 提示
function showToast(message, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// 确认弹窗
function showConfirm(title, message, callback) {
  document.getElementById('confirmTitle').textContent = title;
  document.getElementById('confirmMessage').textContent = message;
  const btn = document.getElementById('confirmBtn');
  btn.onclick = () => { callback(); closeModal('confirmModal'); };
  openModal('confirmModal');
}

// HTML 转义
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ 5. 路由系统 ============
function navigate(page, params = {}) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // 隐藏 FAB
  document.getElementById('diaryFab').style.display = 'none';
  document.getElementById('letterFab').style.display = 'none';

  // 显示对应页面
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) {
    pageEl.classList.add('active');
  }

  // 更新 Tab 高亮
  document.querySelectorAll('.tab-item').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === page);
  });

  App.currentPage = page;

  // 更新 hash
  if (page === 'home') {
    history.pushState(null, '', '#');
  } else if (page === 'detail' && params.postId) {
    App.currentPostId = params.postId;
    history.pushState(null, '', '#detail/' + params.postId);
    renderDetail(params.postId);
  } else {
    history.pushState(null, '', '#' + page);
  }

  // 页面初始化
  switch(page) {
    case 'home':
      renderPostList();
      break;
    case 'create':
      resetCreateForm();
      break;
    case 'messages':
      renderConversationList();
      break;
    case 'diary':
      renderCalendar();
      renderDiaryList();
      document.getElementById('diaryFab').style.display = 'flex';
      break;
    case 'letter':
      renderLetterList();
      document.getElementById('letterFab').style.display = 'flex';
      break;
    case 'settings':
      renderSettings();
      break;
  }

  // 滚动到顶部
  window.scrollTo(0, 0);
}

// 监听浏览器后退
window.addEventListener('popstate', () => {
  const hash = location.hash.slice(1) || 'home';
  if (hash.startsWith('detail/')) {
    const postId = hash.split('/')[1];
    navigate('detail', { postId });
  } else {
    navigate(hash);
  }
});

// ============ 6. 模态框管理 ============
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Escape 关闭模态框
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// 点击遮罩关闭
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ============ 7. Hero 折叠 ============
function collapseHero() {
  const hero = document.querySelector('.hero');
  if (hero) hero.style.display = 'none';
  App.heroCollapsed = true;
  DB.set('hero_collapsed', true);
}

function expandHero() {
  const hero = document.querySelector('.hero');
  if (hero) hero.style.display = '';
  App.heroCollapsed = false;
  DB.set('hero_collapsed', false);
}

// ============ 8. 搜索功能 ============
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  const isHidden = bar.style.display === 'none';
  bar.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    document.getElementById('searchInput').focus();
  } else {
    clearSearch();
  }
}

const handleSearch = debounce(() => {
  App.searchQuery = document.getElementById('searchInput').value.trim();
  renderPostList();
}, 300);

function clearSearch() {
  document.getElementById('searchInput').value = '';
  App.searchQuery = '';
  renderPostList();
}

// ============ 9. 筛选功能 ============
// 初始化筛选事件
function initFilters() {
  // 频道筛选
  document.querySelectorAll('[data-filter="channel"]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter="channel"]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      App.filters.channel = chip.dataset.value;
      renderPostList();
    });
  });

  // 标签筛选（下拉选择）
  const tagFilterSelect = document.getElementById('tagFilterSelect');
  if (tagFilterSelect) {
    tagFilterSelect.addEventListener('change', (e) => {
      App.filters.tag = e.target.value;
      renderPostList();
    });
  }

  // 排序
  document.getElementById('sortFilter').addEventListener('change', (e) => {
    App.filters.sort = e.target.value;
    renderPostList();
  });
}

// ============ 10. 帖子列表渲染 ============
function renderPostList() {
  let posts = DB.get('posts', []);

  // 筛选
  if (App.filters.channel !== 'all') {
    posts = posts.filter(p => p.channel === App.filters.channel);
  }
  if (App.filters.tag !== 'all') {
    posts = posts.filter(p => p.tags && p.tags.includes(App.filters.tag));
  }
  if (App.filters.mbti !== 'all') {
    posts = posts.filter(p => p.authorMbti === App.filters.mbti);
  }

  // 搜索
  if (App.searchQuery) {
    const q = App.searchQuery.toLowerCase();
    posts = posts.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.content && p.content.toLowerCase().includes(q))
    );
  }

  // 排序
  if (App.filters.sort === 'latest') {
    posts.sort((a, b) => b.createdAt - a.createdAt);
  } else if (App.filters.sort === 'hot') {
    posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (App.filters.sort === 'discussed') {
    posts.sort((a, b) => (b.comments ? b.comments.length : 0) - (a.comments ? a.comments.length : 0));
  }

  const container = document.getElementById('postList');
  const emptyState = document.getElementById('emptyState');

  if (posts.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    const emptyTitle = emptyState.querySelector('.empty-state-title');
    const emptyDesc = emptyState.querySelector('.empty-state-text');
    if (emptyTitle) emptyTitle.textContent = App.searchQuery ? '没有找到匹配的内容' : '这片森林还安静着';
    if (emptyDesc) emptyDesc.textContent = App.searchQuery ? '试试其他关键词' : '种下第一棵树…';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = posts.map(post => renderPostCard(post)).join('');
}

function renderPostCard(post) {
  const channel = CHANNELS[post.channel] || { name: '未知', icon: '📝' };
  const mood = MOODS[post.mood] || null;
  const identity = getIdentity();
  const isLiked = identity && post.likedBy && post.likedBy.includes(identity.id);
  const commentCount = post.comments ? post.comments.length : 0;
  const isHot = (post.likes >= 5 || commentCount >= 5);

  let imagesHtml = '';
  if (post.images && post.images.length > 0) {
    imagesHtml = `<div class="post-images">${post.images.map(img =>
      `<img class="post-image" src="${img}" alt="图片" onclick="event.stopPropagation();viewImage('${img.replace(/'/g, "\\'")}')">`
    ).join('')}</div>`;
  }

  return `
    <div class="post-card${isHot ? ' glow' : ''}"${post.mood ? ' data-mood="'+post.mood+'"' : ''} onclick="navigate('detail', {postId: '${post.id}'})">
      <div class="post-card-header">
        ${renderAvatar(post.author)}
        <div class="post-author-info">
          <div class="post-author-name">${escapeHtml(post.author.nickname)}</div>
          <div class="post-meta">
            ${renderRoleBadge(post.author.role)}
            ${post.author.mbti ? renderMBTIBadge(post.author.mbti) : ''}
            <span>${formatTime(post.createdAt)}</span>
          </div>
        </div>
      </div>
      <div class="post-card-content">
        <div class="post-title">${escapeHtml(post.title)}</div>
        <div class="post-text">${escapeHtml(post.content)}</div>
        ${imagesHtml}
        <div class="post-tags">
          <span class="post-tag">${channel.icon} ${channel.name}</span>
          ${mood ? `<span class="mood-badge mood-${post.mood}">${mood.emoji} ${mood.name}</span>` : ''}
          ${renderTags(post.tags)}
        </div>
      </div>
      <div class="post-card-footer">
        <button class="post-action ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation();toggleLike('${post.id}')">
          <svg viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span>${post.likes || 0}</span>
        </button>
        <button class="post-action" onclick="event.stopPropagation();navigate('detail', {postId: '${post.id}'})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>${commentCount}</span>
        </button>
      </div>
    </div>
  `;
}

// ============ 11. 点赞功能 ============
function toggleLike(postId) {
  const posts = DB.get('posts', []);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const identity = getIdentity();
  if (!identity) return;

  if (!post.likedBy) post.likedBy = [];

  const idx = post.likedBy.indexOf(identity.id);
  if (idx > -1) {
    post.likedBy.splice(idx, 1);
    post.likes = Math.max(0, (post.likes || 0) - 1);
  } else {
    post.likedBy.push(identity.id);
    post.likes = (post.likes || 0) + 1;
  }

  DB.set('posts', posts);
  renderPostList();

  // 如果在详情页，也刷新
  if (App.currentPage === 'detail' && App.currentPostId === postId) {
    renderDetail(postId);
  }
}

// ============ 12. 发帖功能 ============
function resetCreateForm() {
  document.getElementById('postTitle').value = '';
  document.getElementById('postContent').value = '';
  document.getElementById('titleCharCount').textContent = '0';
  document.getElementById('contentCharCount').textContent = '0';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imageInput').value = '';

  // 重置选择
  document.querySelectorAll('#channelSelector .channel-option').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('#moodSelector .mood-option').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('#tagSelector .tag-option').forEach(t => t.classList.remove('active'));

  App.createChannel = '';
  App.createMood = '';
  App.createTags = [];
  App.createImage = '';
}

// 初始化发帖事件
function initCreateForm() {
  // 字数统计
  document.getElementById('postTitle').addEventListener('input', (e) => {
    document.getElementById('titleCharCount').textContent = e.target.value.length;
  });
  document.getElementById('postContent').addEventListener('input', (e) => {
    document.getElementById('contentCharCount').textContent = e.target.value.length;
  });

  // 频道选择
  document.querySelectorAll('#channelSelector .channel-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#channelSelector .channel-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      App.createChannel = btn.dataset.channel;
    });
  });

  // 心情选择（单选）
  document.querySelectorAll('#moodSelector .mood-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#moodSelector .mood-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      App.createMood = btn.dataset.mood;
    });
  });

  // 标签选择（多选）
  document.querySelectorAll('#tagSelector .tag-option').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      if (!App.createTags) App.createTags = [];
      const tag = btn.dataset.tag;
      if (btn.classList.contains('active')) {
        if (!App.createTags.includes(tag)) App.createTags.push(tag);
      } else {
        App.createTags = App.createTags.filter(t => t !== tag);
      }
    });
  });
}

// 图片上传
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast('图片大小不能超过 2MB', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    App.createImage = e.target.result;
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('imagePreview').style.display = 'inline-block';
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  App.createImage = '';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imageInput').value = '';
}

// AI 内容审核
function contentReview(title, content) {
  const fullText = (title + ' ' + content).toLowerCase();

  // 敏感词检测（正则）
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.regex.test(fullText)) {
      return { pass: false, reason: '内容包含敏感词（' + pattern.category + '），请修改后重新发布' };
    }
  }

  // 内容过短
  if (content.trim().length < 5) {
    return { pass: false, reason: '内容过短，请写得更详细一些' };
  }

  // 刷屏检测：同一字符重复10次以上
  if (/(.)\1{9,}/.test(content)) {
    return { pass: false, reason: '内容疑似刷屏，请写有意义的内容' };
  }

  // 特殊字符比例检测
  const specialChars = (fullText.match(/[^\w\u4e00-\u9fa5\s]/g) || []).length;
  if (specialChars / fullText.length > 0.5) {
    return { pass: false, reason: '内容包含过多特殊字符' };
  }

  return { pass: true };
}

// 提交帖子
function submitPost() {
  // 防抖：1秒冷却
  if (window._isSubmittingPost) return;
  window._isSubmittingPost = true;
  setTimeout(() => { window._isSubmittingPost = false; }, 1000);

  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();

  if (!App.createChannel) {
    showToast('请选择频道', 'warning');
    return;
  }
  if (!title) {
    showToast('请输入标题', 'warning');
    return;
  }
  if (!content) {
    showToast('请输入内容', 'warning');
    return;
  }

  // 内容审核
  const review = contentReview(title, content);
  if (!review.pass) {
    showToast(review.reason, 'error');
    return;
  }

  const identity = getIdentity();
  if (!identity) return;

  const post = {
    id: genId(),
    title,
    content,
    channel: App.createChannel,
    mood: App.createMood || '',
    tags: App.createTags || [],
    images: App.createImage ? [App.createImage] : [],
    author: { ...identity },
    authorId: identity.id,
    authorMbti: identity.mbti,
    likes: 0,
    likedBy: [],
    comments: [],
    emotions: {},
    reports: [],
    createdAt: Date.now()
  };

  const posts = DB.get('posts', []);
  posts.unshift(post);
  DB.set('posts', posts);

  showToast('发布成功！', 'success');
  navigate('home');
}

// 取消发帖
function cancelCreate() {
  // 防抖：首次提示，3秒超时重置
  if (window._cancelCreateConfirm) return;
  window._cancelCreateConfirm = true;
  setTimeout(() => { window._cancelCreateConfirm = false; }, 3000);

  const title = document.getElementById('postTitle').value.trim();
  const content = document.getElementById('postContent').value.trim();
  if (title || content) {
    showConfirm('放弃编辑', '确定要放弃正在编辑的内容吗？', () => {
      navigate('home');
    });
  } else {
    navigate('home');
  }
}

// ============ 13. 帖子详情 ============
function renderDetail(postId) {
  const posts = DB.get('posts', []);
  const post = posts.find(p => p.id === postId);
  if (!post) {
    showToast('帖子不存在', 'error');
    navigate('home');
    return;
  }

  const identity = getIdentity();
  const isLiked = identity && post.likedBy && post.likedBy.includes(identity.id);
  const channel = CHANNELS[post.channel] || { name: '未知', icon: '📝' };
  const mood = MOODS[post.mood] || null;

  let imagesHtml = '';
  if (post.images && post.images.length > 0) {
    imagesHtml = `<div class="detail-images">${post.images.map(img =>
      `<img class="detail-image" src="${img}" alt="图片" onclick="viewImage('${img.replace(/'/g, "\\'")}')">`
    ).join('')}</div>`;
  }

  // 情绪反应
  let emotionsHtml = Object.entries(EMOTIONS).map(([key, e]) => {
    const count = post.emotions && post.emotions[key] ? post.emotions[key].length : 0;
    const isActive = identity && post.emotions && post.emotions[key] && post.emotions[key].includes(identity.id);
    return `<button class="emotion-btn ${isActive ? 'active' : ''}" onclick="toggleEmotion('${post.id}','${key}')">
      ${e.emoji} ${e.label} <span class="emotion-count">${count || ''}</span>
    </button>`;
  }).join('');

  // 评论区
  let commentsHtml = '';
  if (post.comments && post.comments.length > 0) {
    commentsHtml = post.comments.map(c => `
      <div class="comment-item">
        ${renderAvatar(c.author, 32)}
        <div class="comment-body">
          <span class="comment-author">${escapeHtml(c.author.nickname)}</span>
          <span class="comment-time">${formatTime(c.createdAt)}</span>
          <div class="comment-text">${escapeHtml(c.content)}</div>
        </div>
      </div>
    `).join('');
  }

  const container = document.getElementById('detailContent');
  container.innerHTML = `
    <button class="btn-ghost btn-sm" onclick="navigate('home')" style="margin-bottom:16px" aria-label="返回首页">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
      返回
    </button>
    <div class="detail-card">
      <div class="post-card-header" style="margin-bottom:16px">
        ${renderAvatar(post.author)}
        <div class="post-author-info">
          <div class="post-author-name">${escapeHtml(post.author.nickname)}</div>
          <div class="post-meta">
            ${renderRoleBadge(post.author.role)}
            ${post.author.mbti ? renderMBTIBadge(post.author.mbti) : ''}
            <span>${formatDateTime(post.createdAt)}</span>
          </div>
        </div>
      </div>
      <h2 class="detail-title">${escapeHtml(post.title)}</h2>
      <div class="detail-content">${escapeHtml(post.content)}</div>
      ${imagesHtml}
      <div class="post-tags" style="margin-bottom:16px">
        <span class="post-tag">${channel.icon} ${channel.name}</span>
        ${mood ? `<span class="mood-badge mood-${post.mood}">${mood.emoji} ${mood.name}</span>` : ''}
        ${renderTags(post.tags)}
      </div>
      <div class="detail-actions">
        <button class="detail-action-btn ${isLiked ? 'active' : ''}" onclick="toggleLike('${post.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${post.likes || 0}
        </button>
        <button class="detail-action-btn" onclick="openMessageModal('${post.authorId}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          私信
        </button>
        <button class="detail-action-btn" onclick="openReportModal('${post.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          举报
        </button>
      </div>
      <div class="emotion-bar">${emotionsHtml}</div>
      <div class="comments-section">
        <h3 style="font-size:16px;margin-bottom:12px;color:var(--text-primary)">评论 (${post.comments ? post.comments.length : 0})</h3>
        <div class="comment-input-wrap">
          <input type="text" class="comment-input" id="commentInput" placeholder="写下你的评论…" maxlength="500" autocomplete="off" name="comment">
          <button class="comment-send" onclick="submitComment('${post.id}')">发送</button>
        </div>
        <div id="commentList">${commentsHtml}</div>
      </div>
    </div>
  `;
}

// 情绪反应
function toggleEmotion(postId, emotionKey) {
  const posts = DB.get('posts', []);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const identity = getIdentity();
  if (!identity) return;

  if (!post.emotions) post.emotions = {};
  if (!post.emotions[emotionKey]) post.emotions[emotionKey] = [];

  // 先移除所有情绪
  Object.keys(post.emotions).forEach(key => {
    post.emotions[key] = post.emotions[key].filter(id => id !== identity.id);
  });

  // 如果之前没选这个情绪，添加
  const idx = post.emotions[emotionKey].indexOf(identity.id);
  if (idx === -1) {
    post.emotions[emotionKey].push(identity.id);
  }

  DB.set('posts', posts);
  renderDetail(postId);
}

// 评论
function submitComment(postId) {
  const input = document.getElementById('commentInput');
  const content = input.value.trim();
  if (!content) {
    showToast('请输入评论内容', 'warning');
    return;
  }

  // 评论审核
  const review = contentReview('', content);
  if (!review.pass) {
    showToast(review.reason, 'error');
    return;
  }

  const identity = getIdentity();
  if (!identity) return;

  const posts = DB.get('posts', []);
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.comments) post.comments = [];
  post.comments.push({
    id: genId(),
    content,
    author: { ...identity },
    authorId: identity.id,
    createdAt: Date.now()
  });

  DB.set('posts', posts);
  renderDetail(postId);
  showToast('评论成功', 'success');
}

// ============ 14. 举报功能 ============
function openReportModal(postId) {
  App.reportTarget = postId;
  document.querySelectorAll('input[name="report"]').forEach(r => r.checked = false);
  openModal('reportModal');
}

function submitReport() {
  const reason = document.querySelector('input[name="report"]:checked');
  if (!reason) {
    showToast('请选择举报原因', 'warning');
    return;
  }

  const posts = DB.get('posts', []);
  const post = posts.find(p => p.id === App.reportTarget);
  if (!post) return;

  if (!post.reports) post.reports = [];
  post.reports.push({
    reason: reason.value,
    createdAt: Date.now()
  });

  // 举报超过3次自动标记为 pending
  if (post.reports.length >= 3) {
    post.status = 'pending';
  }

  DB.set('posts', posts);
  closeModal('reportModal');
  showToast('举报已提交，感谢你的反馈', 'success');
}

// ============ 15. 私信发送 ============
function openMessageModal(authorId) {
  App.messageTarget = authorId;
  document.getElementById('messageInput').value = '';
  document.getElementById('messageCharCount').textContent = '0';
  document.getElementById('messageModalTitle').textContent = '发送私信';
  openModal('messageModal');
}

document.getElementById('messageInput').addEventListener('input', (e) => {
  document.getElementById('messageCharCount').textContent = e.target.value.length;
});

function sendPrivateMessage() {
  // 防抖：1秒冷却
  if (window._isSendingDm) return;
  window._isSendingDm = true;
  setTimeout(() => { window._isSendingDm = false; }, 1000);

  const content = document.getElementById('messageInput').value.trim();
  if (!content) {
    showToast('请输入消息内容', 'warning');
    return;
  }

  const identity = getIdentity();
  if (!identity) return;

  // 查找或创建对话
  let conversations = DB.get('messages', []);
  let conversation = conversations.find(c => c.partnerId === App.messageTarget);

  if (!conversation) {
    // 需要找到目标用户的信息 - 从帖子中找
    const posts = DB.get('posts', []);
    let partnerInfo = null;
    for (const p of posts) {
      if (p.authorId === App.messageTarget) {
        partnerInfo = p.author;
        break;
      }
    }
    if (!partnerInfo) {
      showToast('无法找到对方信息', 'error');
      return;
    }

    conversation = {
      id: genId(),
      partnerId: App.messageTarget,
      partner: partnerInfo,
      messages: [],
      createdAt: Date.now(),
      unread: 0
    };
    conversations.push(conversation);
  }

  conversation.messages.push({
    id: genId(),
    content,
    senderId: identity.id,
    createdAt: Date.now()
  });

  DB.set('messages', conversations);
  closeModal('messageModal');
  showToast('消息已发送', 'success');
}

// ============ 16. 图片查看器 ============
function viewImage(src) {
  document.getElementById('viewerImage').src = src;
  document.getElementById('imageViewer').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageViewer() {
  document.getElementById('imageViewer').classList.remove('active');
  document.body.style.overflow = '';
}
// ============ 私信系统 ============

function renderConversationList() {
  const conversations = DB.get('messages', []);
  const identity = getIdentity();
  const container = document.getElementById('conversationList');
  const emptyState = document.getElementById('emptyMessages');

  if (conversations.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  // 按最后消息时间排序
  conversations.sort((a, b) => {
    const aTime = a.messages.length ? a.messages[a.messages.length - 1].createdAt : a.createdAt;
    const bTime = b.messages.length ? b.messages[b.messages.length - 1].createdAt : b.createdAt;
    return bTime - aTime;
  });

  container.innerHTML = conversations.map(conv => {
    const lastMsg = conv.messages.length ? conv.messages[conv.messages.length - 1] : null;
    const preview = lastMsg ? ((lastMsg.senderId === identity.id ? '我: ' : '') + lastMsg.content).substring(0, 30) : '暂无消息';
    const time = lastMsg ? formatTime(lastMsg.createdAt) : '';
    const isActive = App.currentChatId === conv.id;

    return `
      <div class="conversation-item ${isActive ? 'active' : ''}" onclick="openChat('${conv.id}')">
        ${renderAvatar(conv.partner, 44)}
        <div class="conversation-info">
          <div class="conversation-name">
            ${escapeHtml(conv.partner.nickname)}
            ${conv.partner.mbti ? renderMBTIBadge(conv.partner.mbti) : ''}
          </div>
          <div class="conversation-preview">${escapeHtml(preview)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="conversation-time">${time}</span>
          ${conv.unread > 0 ? '<span class="conversation-unread"></span>' : ''}
        </div>
      </div>
    `;
  }).join('');

  updateUnreadBadge();
}

function openChat(convId) {
  const conversations = DB.get('messages', []);
  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;

  App.currentChatId = convId;

  // 清除未读
  conv.unread = 0;
  DB.set('messages', conversations);

  // 显示聊天视图
  document.getElementById('conversationListView').style.display = 'none';
  document.getElementById('chatView').classList.add('active');

  // 渲染聊天伙伴信息
  const identity = getIdentity();
  let compatHtml = '';
  if (identity.mbti && conv.partner.mbti && identity.mbti !== conv.partner.mbti) {
    const compat = getMBTICompatibility(identity.mbti, conv.partner.mbti);
    compatHtml = `
      <div class="mbti-compatibility" id="mbtiCompatibility" style="display:flex">
        <span>${identity.mbti} ❤️ ${conv.partner.mbti}</span>
        <span>契合度 ${compat}%</span>
        <div class="compatibility-bar"><div class="compatibility-fill" style="width:${compat}%"></div></div>
      </div>
    `;
  }

  document.getElementById('chatPartnerInfo').innerHTML = `
    ${renderAvatar(conv.partner, 32)}
    <span style="font-weight:600;margin-left:8px">${escapeHtml(conv.partner.nickname)}</span>
    ${conv.partner.mbti ? renderMBTIBadge(conv.partner.mbti) : ''}
  `;
  document.getElementById('mbtiCompatibility').outerHTML = compatHtml || '<div id="mbtiCompatibility" class="mbti-compatibility" style="display:none"></div>';

  renderChatMessages(conv);

  // 滚动到底部
  setTimeout(() => {
    const msgContainer = document.getElementById('chatMessages');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 100);
}

function renderChatMessages(conv) {
  const identity = getIdentity();
  const container = document.getElementById('chatMessages');

  container.innerHTML = conv.messages.map(msg => {
    const isSent = msg.senderId === identity.id;
    return `
      <div class="chat-bubble-wrap ${isSent ? 'sent' : 'received'}">
        <div>
          <div class="chat-bubble">${escapeHtml(msg.content)}</div>
          <div class="chat-time" style="text-align:${isSent ? 'right' : 'left'}">${formatTime(msg.createdAt)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function backToConversations() {
  document.getElementById('conversationListView').style.display = 'block';
  document.getElementById('chatView').classList.remove('active');
  App.currentChatId = null;
  renderConversationList();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const content = input.value.trim();
  if (!content) return;

  // 防抖：1秒冷却
  if (window._isSendingChat) return;
  window._isSendingChat = true;
  setTimeout(() => { window._isSendingChat = false; }, 1000);

  const identity = getIdentity();
  if (!identity) return;

  const conversations = DB.get('messages', []);
  const conv = conversations.find(c => c.id === App.currentChatId);
  if (!conv) return;

  conv.messages.push({
    id: genId(),
    content,
    senderId: identity.id,
    createdAt: Date.now()
  });

  DB.set('messages', conversations);
  input.value = '';

  renderChatMessages(conv);

  // 滚动到底部
  const msgContainer = document.getElementById('chatMessages');
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // 模拟对方回复（从示例数据中随机选一条）
  setTimeout(() => {
    simulateReply(conv);
  }, 1000 + Math.random() * 2000);
}

function simulateReply(conv) {
  const replies = [
    '嗯嗯，我理解你的感受',
    '谢谢你跟我分享这些',
    '加油，一切都会好起来的',
    '我也遇到过类似的情况',
    '你说的很有道理',
    '深呼吸，慢慢来',
    '我在这里听着呢',
    '你很勇敢，能说出来就很棒了',
    '抱抱你 🤗',
    '生活就是这样，起起落落的',
    '有什么想聊的都可以说',
    '我也有同感'
  ];

  const identity = getIdentity();
  const conversations = DB.get('messages', []);
  const currentConv = conversations.find(c => c.id === conv.id);
  if (!currentConv) return;

  currentConv.messages.push({
    id: genId(),
    content: replies[Math.floor(Math.random() * replies.length)],
    senderId: currentConv.partnerId,
    createdAt: Date.now()
  });

  DB.set('messages', conversations);

  // 如果还在当前聊天页面，刷新
  if (App.currentChatId === conv.id && App.currentPage === 'messages') {
    renderChatMessages(currentConv);
    const msgContainer = document.getElementById('chatMessages');
    msgContainer.scrollTop = msgContainer.scrollHeight;
  } else {
    // 增加未读
    currentConv.unread = (currentConv.unread || 0) + 1;
    DB.set('messages', conversations);
    updateUnreadBadge();
  }
}

function getMBTICompatibility(type1, type2) {
  if (type1 === type2) return 70;
  const map = MBTI_COMPATIBILITY[type1];
  if (map && map[type2]) return map[type2];
  return 50 + Math.floor(Math.random() * 30);
}

function updateUnreadBadge() {
  const conversations = DB.get('messages', []);
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  const navBadge = document.getElementById('navUnreadBadge');
  const tabBadge = document.getElementById('tabUnreadBadge');

  if (totalUnread > 0) {
    navBadge.textContent = totalUnread > 99 ? '99+' : totalUnread;
    navBadge.style.display = 'flex';
    navBadge.classList.remove('msg-badge');
    void navBadge.offsetWidth; // 触发 reflow
    navBadge.classList.add('msg-badge');
    tabBadge.textContent = totalUnread > 99 ? '99+' : totalUnread;
    tabBadge.style.display = 'flex';
    tabBadge.classList.remove('msg-badge');
    void tabBadge.offsetWidth;
    tabBadge.classList.add('msg-badge');
  } else {
    navBadge.style.display = 'none';
    tabBadge.style.display = 'none';
  }
}

// ============ 日记系统 ============

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('calendarTitle');
  const date = App.calendarDate;
  const year = date.getFullYear();
  const month = date.getMonth();

  title.textContent = `${year}年${month + 1}月`;

  const diaries = DB.get('diaries', []);
  const diaryDates = new Set(diaries.map(d => {
    const dd = new Date(d.date);
    return `${dd.getFullYear()}-${dd.getMonth()}-${dd.getDate()}`;
  }));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const today = new Date();

  let html = '';
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  weekdays.forEach(w => {
    html += `<div class="calendar-weekday">${w}</div>`;
  });

  // 上月尾部
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    html += `<div class="calendar-day other-month">${day}</div>`;
  }

  // 本月
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate();
    const dateKey = `${year}-${month}-${i}`;
    const hasDiary = diaryDates.has(dateKey);
    html += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasDiary ? 'has-diary' : ''}" onclick="onCalendarDayClick(${year},${month},${i})">${i}</div>`;
  }

  // 下月开头
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="calendar-day other-month">${i}</div>`;
  }

  grid.innerHTML = html;
}

function changeMonth(delta) {
  App.calendarDate.setMonth(App.calendarDate.getMonth() + delta);
  renderCalendar();
}

function onCalendarDayClick(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const diaries = DB.get('diaries', []);
  const diary = diaries.find(d => d.date && d.date.startsWith(dateStr));

  if (diary) {
    viewDiary(diary.id);
  } else {
    openDiaryEdit(year, month, day);
  }
}

function renderDiaryList() {
  const diaries = DB.get('diaries', []);
  const container = document.getElementById('diaryList');
  const emptyState = document.getElementById('emptyDiary');

  if (diaries.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  // 按日期排序，最近20条
  const sorted = [...diaries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

  container.innerHTML = sorted.map(d => {
    const mood = MOODS[d.mood] || null;
    return `
      <div class="diary-item" onclick="viewDiary('${d.id}')">
        <div class="diary-date">
          ${formatDateTime(new Date(d.date).getTime())}
          ${mood ? `<span class="diary-mood">${mood.emoji} ${mood.name}</span>` : ''}
          ${d.isPublic ? '<span style="font-size:11px;color:var(--accent)">🌐 公开</span>' : ''}
        </div>
        <div class="diary-preview">${escapeHtml(d.content)}</div>
      </div>
    `;
  }).join('');
}

function openDiaryEdit(year, month, day) {
  App.editingDiaryId = null;
  document.getElementById('diaryEditTitle').textContent = '写日记';

  // 设置默认日期
  const now = new Date();
  if (year !== undefined) {
    now.setFullYear(year, month, day);
  }
  const dtStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}T${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  document.getElementById('diaryDatetime').value = dtStr;
  document.getElementById('diaryContent').value = '';
  document.getElementById('diaryCharCount').textContent = '0';
  document.getElementById('diaryPublicToggle').classList.remove('active');

  // 重置心情选择
  document.querySelectorAll('#diaryMoodSelector .mood-option').forEach(m => m.classList.remove('active'));

  openModal('diaryEditModal');
}

function viewDiary(diaryId) {
  const diaries = DB.get('diaries', []);
  const diary = diaries.find(d => d.id === diaryId);
  if (!diary) return;

  App.viewingDiaryId = diaryId;
  const mood = MOODS[diary.mood] || null;

  document.getElementById('diaryViewContent').innerHTML = `
    <div style="margin-bottom:12px">
      <span style="font-size:13px;color:var(--text-muted)">${formatDateTime(new Date(diary.date).getTime())}</span>
      ${mood ? `<span class="mood-badge mood-${diary.mood}" style="margin-left:8px">${mood.emoji} ${mood.name}</span>` : ''}
      ${diary.isPublic ? '<span style="font-size:12px;color:var(--accent);margin-left:8px">🌐 公开</span>' : ''}
    </div>
    <div style="font-size:15px;color:var(--text-secondary);line-height:1.8;white-space:pre-wrap">${escapeHtml(diary.content)}</div>
  `;

  openModal('diaryViewModal');
}

function editDiary() {
  closeModal('diaryViewModal');
  const diaries = DB.get('diaries', []);
  const diary = diaries.find(d => d.id === App.viewingDiaryId);
  if (!diary) return;

  App.editingDiaryId = diary.id;
  document.getElementById('diaryEditTitle').textContent = '编辑日记';

  const d = new Date(diary.date);
  const dtStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  document.getElementById('diaryDatetime').value = dtStr;
  document.getElementById('diaryContent').value = diary.content;
  document.getElementById('diaryCharCount').textContent = diary.content.length;

  if (diary.isPublic) {
    document.getElementById('diaryPublicToggle').classList.add('active');
  } else {
    document.getElementById('diaryPublicToggle').classList.remove('active');
  }

  // 设置心情
  document.querySelectorAll('#diaryMoodSelector .mood-option').forEach(m => {
    m.classList.toggle('active', m.dataset.mood === diary.mood);
  });

  openModal('diaryEditModal');
}

function saveDiary() {
  const datetime = document.getElementById('diaryDatetime').value;
  const content = document.getElementById('diaryContent').value.trim();
  const isPublic = document.getElementById('diaryPublicToggle').classList.contains('active');
  const moodBtn = document.querySelector('#diaryMoodSelector .mood-option.active');
  const mood = moodBtn ? moodBtn.dataset.mood : '';

  if (!datetime) {
    showToast('请选择日期时间', 'warning');
    return;
  }
  if (!content) {
    showToast('请输入日记内容', 'warning');
    return;
  }

  const diaries = DB.get('diaries', []);

  if (App.editingDiaryId) {
    // 编辑
    const diary = diaries.find(d => d.id === App.editingDiaryId);
    if (diary) {
      diary.date = datetime;
      diary.content = content;
      diary.mood = mood;
      diary.isPublic = isPublic;
      diary.updatedAt = Date.now();
    }
  } else {
    // 新建
    diaries.push({
      id: genId(),
      date: datetime,
      content,
      mood,
      isPublic,
      createdAt: Date.now()
    });
  }

  DB.set('diaries', diaries);
  closeModal('diaryEditModal');
  showToast('日记已保存', 'success');
  renderCalendar();
  renderDiaryList();
}

function deleteDiary() {
  showConfirm('删除日记', '确定要删除这篇日记吗？删除后不可恢复。', () => {
    const diaries = DB.get('diaries', []);
    DB.set('diaries', diaries.filter(d => d.id !== App.viewingDiaryId));
    closeModal('diaryViewModal');
    showToast('日记已删除', 'success');
    renderCalendar();
    renderDiaryList();
  });
}

// 日记内容字数统计
document.getElementById('diaryContent').addEventListener('input', (e) => {
  document.getElementById('diaryCharCount').textContent = e.target.value.length;
});

// 日记心情选择（单选）
document.querySelectorAll('#diaryMoodSelector .mood-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#diaryMoodSelector .mood-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ============ 回信系统 ============

function renderLetterList() {
  const letters = DB.get('letters', []);
  const container = document.getElementById('letterList');
  const emptyState = document.getElementById('emptyLetter');

  if (letters.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  const now = Date.now();

  container.innerHTML = letters.sort((a, b) => b.createdAt - a.createdAt).map(letter => {
    const isOpened = now >= letter.openAt;
    const daysLeft = Math.ceil((letter.openAt - now) / (1000 * 60 * 60 * 24));
    const openDate = new Date(letter.openAt);

    return `
      <div class="letter-card ${isOpened ? 'opened' : 'sealed'}" onclick="${isOpened ? `viewLetter('${letter.id}')` : ''}">
        <div class="letter-status ${isOpened ? 'opened' : 'sealed'}">
          ${isOpened ? '📬 已开封' : '🔒 封存中'}
        </div>
        <div class="letter-preview">${isOpened ? (escapeHtml(letter.content.slice(0, 20)) + (letter.content.length > 20 ? '…' : '')) : '这封信正在沉睡中…'}</div>
        <div class="letter-meta">
          <div>写于 ${formatDateTime(letter.createdAt)}</div>
          ${isOpened ?
            `<div>封存了 ${Math.floor((now - letter.createdAt) / (1000 * 60 * 60 * 24))} 天</div>` :
            `<div class="letter-countdown">距离开封还有 ${daysLeft} 天</div>
             <div style="font-size:12px;color:var(--text-muted)">开封时间：${formatDateTime(letter.openAt)}</div>`
          }
        </div>
        <div class="letter-seal-icon">${isOpened ? '📬' : '🔒'}</div>
      </div>
    `;
  }).join('');
}

function openLetterEdit() {
  document.getElementById('letterContent').value = '';
  document.getElementById('letterCharCount').textContent = '0';
  document.getElementById('letterCustomTime').style.display = 'none';
  document.getElementById('letterCustomTime').value = '';

  // 重置时间选择
  document.querySelectorAll('#letterTimeOptions .filter-chip').forEach(c => c.classList.remove('active'));

  openModal('letterEditModal');
}

// 回信时间选择
document.querySelectorAll('#letterTimeOptions .filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#letterTimeOptions .filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const days = chip.dataset.days;
    if (days === 'custom') {
      document.getElementById('letterCustomTime').style.display = 'block';
    } else {
      document.getElementById('letterCustomTime').style.display = 'none';
    }
  });
});

function saveLetter() {
  const content = document.getElementById('letterContent').value.trim();
  if (!content) {
    showToast('请输入信件内容', 'warning');
    return;
  }

  const activeChip = document.querySelector('#letterTimeOptions .filter-chip.active');
  if (!activeChip) {
    showToast('请选择开封时间', 'warning');
    return;
  }

  const days = activeChip.dataset.days;
  let openAt;

  if (days === 'custom') {
    const customTime = document.getElementById('letterCustomTime').value;
    if (!customTime) {
      showToast('请选择自定义时间', 'warning');
      return;
    }
    openAt = new Date(customTime).getTime();
    if (openAt <= Date.now()) {
      showToast('开封时间必须是未来时间', 'error');
      return;
    }
  } else {
    openAt = Date.now() + parseInt(days) * 24 * 60 * 60 * 1000;
  }

  const letters = DB.get('letters', []);
  letters.push({
    id: genId(),
    content,
    openAt,
    createdAt: Date.now()
  });

  DB.set('letters', letters);
  closeModal('letterEditModal');
  showToast('信件已封存，等待未来的自己', 'success');
  renderLetterList();
}

function viewLetter(letterId) {
  const letters = DB.get('letters', []);
  const letter = letters.find(l => l.id === letterId);
  if (!letter) return;

  const now = Date.now();
  if (now < letter.openAt) {
    showToast('信件还未到开封时间', 'warning');
    return;
  }

  App.viewingLetterId = letterId;
  const sealedDays = Math.floor((now - letter.createdAt) / (1000 * 60 * 60 * 24));

  document.getElementById('letterViewTitle').textContent = '来自过去的信';
  document.getElementById('letterViewContent').innerHTML = `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:48px;margin-bottom:12px">📬</div>
      <p style="font-size:13px;color:var(--text-muted)">写于 ${formatDateTime(letter.createdAt)}</p>
      <p style="font-size:13px;color:var(--text-muted)">封存了 ${sealedDays} 天</p>
    </div>
    <div style="font-size:15px;color:var(--text-secondary);line-height:2;white-space:pre-wrap;padding:20px;background:var(--bg-tertiary);border-radius:var(--radius-md);font-family:var(--font-display)">${escapeHtml(letter.content)}</div>
  `;

  openModal('letterViewModal');
}

function deleteLetter() {
  showConfirm('删除回信', '确定要删除这封信吗？删除后不可恢复。', () => {
    const letters = DB.get('letters', []);
    DB.set('letters', letters.filter(l => l.id !== App.viewingLetterId));
    closeModal('letterViewModal');
    showToast('信件已删除', 'success');
    renderLetterList();
  });
}

// 回信内容字数统计
document.getElementById('letterContent').addEventListener('input', (e) => {
  document.getElementById('letterCharCount').textContent = e.target.value.length;
});

// ============ 个人设置 ============

function renderSettings() {
  const identity = getIdentity();
  if (!identity) return;

  // 头像预览
  document.getElementById('settingsAvatarPreview').innerHTML = renderAvatar(identity, 80).replace(/width:\d+px/g, '').replace(/height:\d+px/g, '').replace('post-avatar', 'avatar-preview-large-inner');
  document.getElementById('settingsAvatarPreview').innerHTML = identity.avatarStyle === 'emoji' ?
    `<span style="font-size:40px">${identity.emoji || '😊'}</span>` :
    identity.avatarStyle === 'gradient' ?
    `<span style="font-size:32px;font-weight:600;color:white;background:linear-gradient(135deg,${identity.bgColor || '#5b8c6e'},${identity.bgColor || '#c4956a'});width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%">${(identity.nickname || '?')[0]}</span>` :
    `<span style="font-size:32px;font-weight:600;color:var(--accent)">${(identity.nickname || '?')[0]}</span>`;

  // 昵称
  document.getElementById('nicknameInput').value = identity.nickname || '';

  // 头像风格
  document.querySelectorAll('#avatarStyleSelector .avatar-style-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.style === identity.avatarStyle);
  });

  // Emoji
  renderEmojiGrid(identity.emoji);

  // 颜色
  renderColorGrid(identity.bgColor);

  // 角色
  document.querySelectorAll('#roleSelector .role-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === identity.role);
  });

  // MBTI
  document.getElementById('mbtiSelect').value = identity.mbti || '';

  // 主题
  renderThemeOptions();
}

function renderEmojiGrid(currentEmoji) {
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = EMOJI_LIST.map(emoji =>
    `<div class="emoji-option ${emoji === currentEmoji ? 'active' : ''}" onclick="selectEmoji('${emoji}')">${emoji}</div>`
  ).join('');
}

function selectEmoji(emoji) {
  const identity = getIdentity();
  identity.emoji = emoji;
  saveIdentity(identity);
  renderEmojiGrid(emoji);
  renderSettings();
}

function renderColorGrid(currentColor) {
  const grid = document.getElementById('colorGrid');
  grid.innerHTML = BG_COLORS.map(color =>
    `<div class="color-option ${color === currentColor ? 'active' : ''}" style="background:${color}" onclick="selectColor('${color}')"></div>`
  ).join('');
}

function selectColor(color) {
  const identity = getIdentity();
  identity.bgColor = color;
  saveIdentity(identity);
  renderColorGrid(color);
  renderSettings();
}

// 头像风格切换
document.querySelectorAll('#avatarStyleSelector .avatar-style-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#avatarStyleSelector .avatar-style-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const identity = getIdentity();
    identity.avatarStyle = btn.dataset.style;
    saveIdentity(identity);

    // 切换显示
    document.getElementById('emojiGroup').style.display = btn.dataset.style === 'emoji' ? 'block' : 'none';
    document.getElementById('colorGroup').style.display = btn.dataset.style === 'gradient' ? 'block' : 'none';

    renderSettings();
  });
});

// 昵称输入
document.getElementById('nicknameInput').addEventListener('input', debounce((e) => {
  const identity = getIdentity();
  identity.nickname = e.target.value.trim() || randomNickname();
  saveIdentity(identity);
  renderSettings();
}, 300));

// 随机昵称
function randomNickname() {
  const adj = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
  const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
  const name = adj + noun;
  document.getElementById('nicknameInput').value = name;
  const identity = getIdentity();
  if (identity) {
    identity.nickname = name;
    saveIdentity(identity);
    renderSettings();
  }
  return name;
}

// 角色选择
document.querySelectorAll('#roleSelector .role-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#roleSelector .role-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const identity = getIdentity();
    identity.role = btn.dataset.role;
    saveIdentity(identity);
  });
});

// MBTI 选择
document.getElementById('mbtiSelect').addEventListener('change', (e) => {
  const identity = getIdentity();
  identity.mbti = e.target.value;
  saveIdentity(identity);
});

// ============ 主题系统 ============

const THEMES = [
  { id: 'light', name: '月光森林', bg: '#f8f6f1', accent: '#5b8c6e' },
  { id: 'dark', name: '暗夜森林', bg: '#1c1b18', accent: '#6fa882' },
  { id: 'starry', name: '星空', bg: '#0f0f1a', accent: '#7b8cde' },
  { id: 'sakura', name: '樱花', bg: '#fdf6f8', accent: '#d4728a' },
  { id: 'sunny', name: '暖阳', bg: '#faf8f2', accent: '#d4944a' }
];

function renderThemeOptions() {
  const currentTheme = DB.get('theme', 'light');
  const container = document.getElementById('themeOptions');

  container.innerHTML = THEMES.map(theme => `
    <div class="theme-option ${theme.id === currentTheme ? 'active' : ''}" onclick="switchTheme('${theme.id}')">
      <div class="theme-preview" style="background:${theme.bg};border:1px solid var(--border)"></div>
      <div class="theme-name">${theme.name}</div>
    </div>
  `).join('');
}

function switchTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  DB.set('theme', themeId);
  applyThemePattern(themeId);
  renderThemeOptions();
  // 更新 theme-color meta 标签
  const themeColors = {
    light: '#f8f6f1', dark: '#1a1b1e', starry: '#0f172a',
    sakura: '#fdf2f4', sunny: '#fffbeb'
  };
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = themeColors[themeId] || '#f8f6f1';
  showToast('主题已切换', 'success');
}

function applyThemePattern(themeId) {
  const patterns = {
    light: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c0 0-10 15-10 25s5 15 10 20c5-5 10-10 10-20S30 5 30 5z' fill='%235b8c6e' fill-opacity='0.03'/%3E%3Cpath d='M10 30c0 0 15-5 25-5s20 5 25 10c-5 5-15 10-25 10S10 30 10 30z' fill='%235b8c6e' fill-opacity='0.02'/%3E%3Cellipse cx='45' cy='15' rx='8' ry='5' fill='%235b8c6e' fill-opacity='0.03' transform='rotate(-30 45 15)'/%3E%3C/svg%3E")`,
    dark: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 10c0 0-15 20-15 35s8 20 15 25c7-5 15-10 15-25S40 10 40 10z' fill='%236fa882' fill-opacity='0.04'/%3E%3Cpath d='M15 40c0 0 20-8 35-8s25 8 30 15c-5 7-20 15-35 15S15 40 15 40z' fill='%236fa882' fill-opacity='0.02'/%3E%3C/svg%3E")`,
    starry: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='30' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3Ccircle cx='50' cy='10' r='1.5' fill='%23ffffff' fill-opacity='0.4'/%3E%3Ccircle cx='80' cy='25' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3Ccircle cx='35' cy='60' r='1.2' fill='%23ffffff' fill-opacity='0.35'/%3E%3Ccircle cx='70' cy='55' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3Ccircle cx='15' cy='80' r='1.5' fill='%23ffffff' fill-opacity='0.25'/%3E%3Ccircle cx='90' cy='75' r='1' fill='%23ffffff' fill-opacity='0.3'/%3E%3Ccircle cx='55' cy='85' r='1.3' fill='%23ffffff' fill-opacity='0.35'/%3E%3Cline x1='60' y1='5' x2='40' y2='25' stroke='%23ffffff' stroke-opacity='0.15' stroke-width='1'/%3E%3C/svg%3E")`,
    sakura: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='15' cy='20' rx='6' ry='4' fill='%23d4728a' fill-opacity='0.06' transform='rotate(20 15 20)'/%3E%3Cellipse cx='45' cy='10' rx='5' ry='3' fill='%23d4728a' fill-opacity='0.05' transform='rotate(-15 45 10)'/%3E%3Cellipse cx='30' cy='45' rx='7' ry='4' fill='%23d4728a' fill-opacity='0.04' transform='rotate(30 30 45)'/%3E%3Cellipse cx='50' cy='40' rx='4' ry='3' fill='%23d4728a' fill-opacity='0.05' transform='rotate(-25 50 40)'/%3E%3C/svg%3E")`,
    sunny: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='15' fill='%23d4944a' fill-opacity='0.04'/%3E%3Ccircle cx='40' cy='40' r='25' fill='%23d4944a' fill-opacity='0.02'/%3E%3Ccircle cx='20' cy='20' r='8' fill='%23d4944a' fill-opacity='0.03'/%3E%3Ccircle cx='65' cy='60' r='10' fill='%23d4944a' fill-opacity='0.03'/%3E%3C/svg%3E")`
  };

  document.body.style.backgroundImage = patterns[themeId] || patterns.light;
  document.body.style.backgroundRepeat = 'repeat';
}

// ============ MBTI 测试 ============

const MBTI_QUESTIONS = [
  { id: 1, dimension: 'EI', text: '周末到了，你更想…', options: [
    { text: '🏠 在家看书追剧，享受独处时光', value: 'I' },
    { text: '🎉 约朋友出去逛街吃饭', value: 'E' }
  ]},
  { id: 2, dimension: 'EI', text: '参加聚会，你通常会…', options: [
    { text: '🤯 找个安静角落和一两人深聊', value: 'I' },
    { text: '🎤 在人群中穿梭，认识新朋友', value: 'E' }
  ]},
  { id: 3, dimension: 'EI', text: '长时间独处后，你的感受…', options: [
    { text: '🔋 充满了电，感觉很舒服', value: 'I' },
    { text: '🧢 有点闷，想出去见见人', value: 'E' }
  ]},
  { id: 4, dimension: 'SN', text: '做决定时，你更依赖…', options: [
    { text: '🧠 直觉和灵感，跟着感觉走', value: 'N' },
    { text: '📊 事实和数据，讲究实际依据', value: 'S' }
  ]},
  { id: 5, dimension: 'SN', text: '看一部电影，你更在意…', options: [
    { text: '🎬 画面、音效、剧情细节', value: 'S' },
    { text: '💭 隐喻、主题、背后的深意', value: 'N' }
  ]},
  { id: 6, dimension: 'SN', text: '朋友吐槽，你第一反应…', options: [
    { text: '🔍 仔细问清楚具体发生了什么', value: 'S' },
    { text: '💭 联想背后的意义和可能性', value: 'N' }
  ]},
  { id: 7, dimension: 'TF', text: '朋友遇到困难，你会…', options: [
    { text: '🤗 先安慰情绪，陪伴最重要', value: 'F' },
    { text: '💡 帮TA分析问题，给解决方案', value: 'T' }
  ]},
  { id: 8, dimension: 'TF', text: '团队艰难决定，你更看重…', options: [
    { text: '⚖️ 公平和逻辑，即使不讨喜', value: 'T' },
    { text: '🤝 每个人的感受，照顾所有人', value: 'F' }
  ]},
  { id: 9, dimension: 'TF', text: '被批评时，你更常…', options: [
    { text: '🤔 冷静想想对方说得对不对', value: 'T' },
    { text: '😢 先觉得难过，然后才分析', value: 'F' }
  ]},
  { id: 10, dimension: 'JP', text: '旅行计划，你更倾向…', options: [
    { text: '📋 提前规划好行程和住宿', value: 'J' },
    { text: '🎒 说走就走，到了再应变', value: 'P' }
  ]},
  { id: 11, dimension: 'JP', text: '你的书桌/房间通常…', options: [
    { text: '🧹 整整齐齐，东西有固定位置', value: 'J' },
    { text: '🌀 有点乱但我知道东西在哪', value: 'P' }
  ]},
  { id: 12, dimension: 'JP', text: '面对截止日期，你通常…', options: [
    { text: '📅 提前完成，留出缓冲时间', value: 'J' },
    { text: '⏰ 最后一刻爆发，deadline是第一生产力', value: 'P' }
  ]}
];

function openMBTITest() {
  App.mbtiTestAnswers = new Array(12).fill(null);
  App.mbtiTestStep = 0;
  renderMBTIStep();
  openModal('mbtiModal');
}

function renderMBTIStep() {
  const container = document.getElementById('mbtiTestContent');
  const step = App.mbtiTestStep;
  const total = MBTI_QUESTIONS.length;

  if (step >= total) {
    // 显示结果
    showMBTIResult();
    return;
  }

  const question = MBTI_QUESTIONS[step];
  const progress = ((step) / total * 100);

  const dimensionLabels = { 'EI': '外向/内向', 'SN': '感觉/直觉', 'TF': '思考/情感', 'JP': '判断/感知' };

  container.innerHTML = `
    <div class="mbti-progress">
      <div class="mbti-progress-fill" style="width:${progress}%"></div>
    </div>
    <div style="text-align:center;margin-bottom:8px">
      <span style="font-size:13px;color:var(--text-muted)">第 ${step + 1}/${total} 题</span>
      <span class="mbti-dimension-tag">${dimensionLabels[question.dimension]}</span>
    </div>
    <div class="mbti-question">${question.text}</div>
    <div class="mbti-options">
      ${question.options.map((opt, i) => `
        <div class="mbti-option ${App.mbtiTestAnswers[step] === opt.value ? 'selected' : ''}" onclick="answerMBTI(${step}, '${opt.value}')">
          ${opt.text}
        </div>
      `).join('')}
    </div>
  `;
}

function answerMBTI(step, value) {
  App.mbtiTestAnswers[step] = value;
  App.mbtiTestStep++;
  renderMBTIStep();
}

function showMBTIResult() {
  const container = document.getElementById('mbtiTestContent');

  // 计算各维度得分
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  MBTI_QUESTIONS.forEach((q, i) => {
    const answer = App.mbtiTestAnswers[i];
    if (answer) scores[answer]++;
  });

  const type = (scores.E >= scores.I ? 'E' : 'I') +
               (scores.S >= scores.N ? 'S' : 'N') +
               (scores.T >= scores.F ? 'T' : 'F') +
               (scores.J >= scores.P ? 'J' : 'P');

  const description = MBTI_DESCRIPTIONS[type] || '你是一个独特的人。';

  container.innerHTML = `
    <div class="mbti-result">
      <div style="font-size:64px;margin-bottom:16px">🎭</div>
      <div class="mbti-result-type">${type}</div>
      <p style="font-size:14px;color:var(--text-muted);margin-bottom:16px">你的人格类型</p>
      <p class="mbti-result-desc">${description}</p>
      <div style="margin-top:24px;display:flex;gap:12px;justify-content:center">
        <button class="btn-ghost" onclick="openMBTITest()">重新测试</button>
        <button class="btn-primary" onclick="applyMBTIResult('${type}')">使用此结果</button>
      </div>
    </div>
  `;
}

function applyMBTIResult(type) {
  const identity = getIdentity();
  identity.mbti = type;
  saveIdentity(identity);
  document.getElementById('mbtiSelect').value = type;
  closeModal('mbtiModal');
  showToast(`MBTI 已设置为 ${type}`, 'success');
}

// ============ 随机发现 ============

function openRandomDiscover() {
  const posts = DB.get('posts', []);
  if (posts.length === 0) {
    showToast('还没有帖子可以发现', 'warning');
    return;
  }

  const post = posts[Math.floor(Math.random() * posts.length)];
  const channel = CHANNELS[post.channel] || { name: '未知', icon: '📝' };
  const mood = MOODS[post.mood] || null;

  const container = document.getElementById('randomContent');
  container.innerHTML = `
    <div class="random-card">
      <div class="random-card-inner" id="randomCardInner">
        <div class="random-card-front">
          <div style="font-size:48px;margin-bottom:16px">🎲</div>
          <p style="font-size:16px;color:var(--text-primary);font-weight:600">发现一篇心事</p>
          <p style="font-size:13px;color:var(--text-muted);margin-top:8px">点击翻转查看</p>
        </div>
        <div class="random-card-back">
          <div style="margin-bottom:12px">
            <span class="post-tag">${channel.icon} ${channel.name}</span>
            ${mood ? `<span class="mood-badge mood-${post.mood}" style="margin-left:4px">${mood.emoji} ${mood.name}</span>` : ''}
          </div>
          <h3 style="font-size:18px;font-weight:700;margin-bottom:8px">${escapeHtml(post.title)}</h3>
          <p style="font-size:14px;line-height:1.6;opacity:0.9;margin-bottom:16px">${escapeHtml(post.content)}</p>
          <div style="font-size:12px;opacity:0.7">
            ${escapeHtml(post.author.nickname)} · ${formatTime(post.createdAt)}
          </div>
          <button class="btn-ghost btn-sm" style="margin-top:12px;color:white;border-color:rgba(255,255,255,0.3)" onclick="closeModal('randomModal');navigate('detail',{postId:'${post.id}'})">查看详情</button>
        </div>
      </div>
    </div>
    <div style="text-align:center;margin-top:16px">
      <button class="btn-ghost btn-sm" onclick="openRandomDiscover()">换一篇</button>
    </div>
  `;

  // 翻转效果
  setTimeout(() => {
    const inner = document.getElementById('randomCardInner');
    if (inner) inner.classList.add('flipped');
  }, 500);

  openModal('randomModal');
}

// ============ 角色选择 ============

function selectRole(role) {
  const identity = initIdentity(role);
  closeModal('roleSelectModal');
  showToast(`欢迎，${ROLES[role].name}！`, 'success');
  renderPostList();
}

// ============ 清除数据 ============

function clearAllData() {
  showConfirm('清除所有数据', '确定要清除所有数据吗？此操作不可恢复！', () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('treehole_'));
    keys.forEach(k => localStorage.removeItem(k));
    showToast('数据已清除', 'success');
    setTimeout(() => location.reload(), 1000);
  });
}

// ============ 示例数据 ============

function initSampleData() {
  // 如果已有帖子数据，不覆盖
  if (DB.get('posts', []).length > 0) return;

  const now = Date.now();
  const h = 3600000;
  const d = 86400000;

  const sampleIdentities = [
    { id: 'sample_1', nickname: '温柔的猫咪', role: 'student', mbti: 'INFP', avatarStyle: 'emoji', emoji: '🐱', bgColor: '#e07c5a', createdAt: now - d * 30 },
    { id: 'sample_2', nickname: '自由的旅人', role: 'worker', mbti: 'ENTJ', avatarStyle: 'emoji', emoji: '🌍', bgColor: '#5b8cc9', createdAt: now - d * 25 },
    { id: 'sample_3', nickname: '安静的星辰', role: 'freelancer', mbti: 'INFJ', avatarStyle: 'emoji', emoji: '✨', bgColor: '#9b6bb0', createdAt: now - d * 20 },
    { id: 'sample_4', nickname: '浪漫的月光', role: 'student', mbti: 'ENFP', avatarStyle: 'emoji', emoji: '🌙', bgColor: '#c9a84c', createdAt: now - d * 15 },
    { id: 'sample_5', nickname: '勇敢的海鸥', role: 'worker', mbti: 'ISTJ', avatarStyle: 'emoji', emoji: '🕊️', bgColor: '#4a9e7d', createdAt: now - d * 10 }
  ];

  const samplePosts = [
    // 1. 温柔的猫咪 - "今天在公园看到一只超可爱的柴犬" - 生活/开心/日常 - 3赞2评 - 2小时前
    { title: '今天在公园看到一只超可爱的柴犬', content: '今天在公园散步的时候，看到一只超可爱的柴犬！毛茸茸的，屁股一扭一扭地跑来跑去，还冲我摇尾巴。主人说它叫"团子"，两岁半了。忍不住蹲下来摸了好久，感觉一天的疲惫都被治愈了。养狗的人真的好幸福啊！', channel: 'life', mood: 'happy', tags: ['daily'], author: sampleIdentities[0], likes: 3, likedBy: ['sample_2','sample_3','sample_5'], comments: [
      { id: 'c_1', content: '柴犬真的太可爱了！我也好想养一只', author: sampleIdentities[3], authorId: 'sample_4', createdAt: now - h * 1.5 },
      { id: 'c_2', content: '团子这个名字好适合柴犬哈哈哈', author: sampleIdentities[1], authorId: 'sample_2', createdAt: now - h * 1 }
    ], emotions: { touched: ['sample_4'], warm: ['sample_2','sample_3'] }, reports: [], createdAt: now - h * 2 },
    // 2. 自由的旅人 - "分享一个提高效率的方法：番茄工作法" - 职场/期待/经验,分享 - 4赞2评 - 8小时前
    { title: '分享一个提高效率的方法：番茄工作法', content: '最近工作压力很大，总是拖延。朋友推荐了番茄工作法，试了一周真的有效！方法很简单：专注工作25分钟，休息5分钟，每4个番茄钟休息15-30分钟。关键是把大任务拆成小步骤，一个番茄钟只做一件事。推荐给同样有拖延症的朋友们！', channel: 'work', mood: 'expect', tags: ['experience', 'share'], author: sampleIdentities[1], likes: 4, likedBy: ['sample_1','sample_3','sample_4','sample_5'], comments: [
      { id: 'c_3', content: '番茄工作法确实好用，我用了半年了', author: sampleIdentities[4], authorId: 'sample_5', createdAt: now - h * 7 },
      { id: 'c_4', content: '试试看！我总是注意力不集中，希望能有帮助', author: sampleIdentities[0], authorId: 'sample_1', createdAt: now - h * 6 }
    ], emotions: { agree: ['sample_5'], resonate: ['sample_1'] }, reports: [], createdAt: now - h * 8 },
    // 3. 安静的星辰 - "深夜的心事：30岁了还在迷茫" - 树洞/迷茫/心事 - 5赞3评 - 24小时前
    { title: '深夜的心事：30岁了还在迷茫', content: '今天过完生日就30岁了。身边的同龄人有的结婚生子，有的买房买车，有的升职加薪。而我呢，还在做着一份不上不下的工作，存款少得可怜，感情也没有着落。有时候真的很焦虑，觉得自己的人生是不是走错了方向。但又不知道该往哪里走。', channel: 'treehole', mood: 'lost', tags: ['secret'], author: sampleIdentities[2], likes: 4, likedBy: ['sample_1','sample_2','sample_4','sample_5'], comments: [
      { id: 'c_5', content: '每个人都有自己的节奏，不用和别人比', author: sampleIdentities[0], authorId: 'sample_1', createdAt: now - h * 23 },
      { id: 'c_6', content: '30岁只是一个数字，人生还有很多可能', author: sampleIdentities[4], authorId: 'sample_5', createdAt: now - h * 22 },
      { id: 'c_7', content: '我32了也一样迷茫，你不是一个人', author: sampleIdentities[3], authorId: 'sample_4', createdAt: now - h * 20 }
    ], emotions: { resonate: ['sample_1','sample_4'], empathy: ['sample_5'], warm: ['sample_2'] }, reports: [], createdAt: now - d },
    // 4. 浪漫的月光 - "吐槽：为什么外卖越来越难吃了" - 生活/愤怒/吐槽,求助 - 2赞1评 - 12小时前
    { title: '吐槽：为什么外卖越来越难吃了', content: '最近点了好几次外卖，每次都让人失望。分量越来越少，价格越来越贵，味道也大不如前。今天点了一份红烧排骨，结果全是骨头没几块肉。到底是我的口味变挑剔了，还是外卖真的越来越差了？有没有好吃的外卖推荐啊，快被饿死了！', channel: 'life', mood: 'angry', tags: ['complain', 'help'], author: sampleIdentities[3], likes: 2, likedBy: ['sample_1','sample_2'], comments: [
      { id: 'c_8', content: '建议自己做饭，又健康又省钱', author: sampleIdentities[2], authorId: 'sample_3', createdAt: now - h * 11 }
    ], emotions: { agree: ['sample_1'], think: ['sample_2'] }, reports: [], createdAt: now - h * 12 },
    // 5. 勇敢的海鸥 - "推荐几本最近读过的好书" - 树洞/平静/分享,经验 - 4赞2评 - 36小时前
    { title: '推荐几本最近读过的好书', content: '最近读了几本很不错的书，分享给大家：1.《被讨厌的勇气》- 阿德勒心理学入门，读完之后释怀了很多事。2.《活着》- 余华的经典，每次读都有不同的感受。3.《小王子》- 大人也应该读的童话。4.《人类简史》- 视角很独特，让人重新思考人类文明。', channel: 'treehole', mood: 'calm', tags: ['share', 'experience'], author: sampleIdentities[4], likes: 4, likedBy: ['sample_1','sample_2','sample_3','sample_4'], comments: [
      { id: 'c_9', content: '《被讨厌的勇气》真的很好，推荐！', author: sampleIdentities[2], authorId: 'sample_3', createdAt: now - h * 35 },
      { id: 'c_10', content: '《活着》每次看都会哭，太感人了', author: sampleIdentities[0], authorId: 'sample_1', createdAt: now - h * 34 }
    ], emotions: { agree: ['sample_3','sample_1'], warm: ['sample_2'] }, reports: [], createdAt: now - h * 36 },
    // 6. 温柔的猫咪 - "考研倒计时30天，好焦虑" - 校园/焦虑/心事,日常 - 4赞2评 - 5小时前
    { title: '考研倒计时30天，好焦虑', content: '考研倒计时30天了，感觉什么都没准备好。政治大题还没背熟，英语作文模板也没整理完，专业课还有好多知识点没搞懂。每天在图书馆从早到晚，但效率越来越低。室友都保研了，只有我还在苦哈哈地备考。有时候真的会怀疑自己的选择...', channel: 'campus', mood: 'anxious', tags: ['secret', 'daily'], author: sampleIdentities[0], likes: 4, likedBy: ['sample_2','sample_3','sample_4','sample_5'], comments: [
      { id: 'c_11', content: '加油！最后30天坚持住，你一定可以的！', author: sampleIdentities[4], authorId: 'sample_5', createdAt: now - h * 4 },
      { id: 'c_12', content: '焦虑说明你在乎，适当放松也很重要哦', author: sampleIdentities[2], authorId: 'sample_3', createdAt: now - h * 3 }
    ], emotions: { empathy: ['sample_5','sample_3'], resonate: ['sample_2'] }, reports: [], createdAt: now - h * 5 },
    // 7. 浪漫的月光 - "暗恋了三年的同事今天离职了" - 情感/难过/心事 - 5赞2评 - 48小时前
    { title: '暗恋了三年的同事今天离职了', content: '暗恋了三年的同事今天离职了。最后一天我鼓起勇气想跟他说点什么，但话到嘴边又咽了回去。看着他收拾东西离开的背影，心里空落落的。三年了，连一句喜欢都没说出口。也许这就是错过吧。以后再也没有理由每天期待去上班了。', channel: 'emotion', mood: 'sad', tags: ['secret'], author: sampleIdentities[3], likes: 5, likedBy: ['sample_1','sample_2','sample_3','sample_4','sample_5'], comments: [
      { id: 'c_13', content: '可以加他微信保持联系啊，还来得及', author: sampleIdentities[0], authorId: 'sample_1', createdAt: now - h * 47 },
      { id: 'c_14', content: '至少你知道自己的心意，下次勇敢一点', author: sampleIdentities[4], authorId: 'sample_5', createdAt: now - h * 46 }
    ], emotions: { empathy: ['sample_1','sample_2','sample_5'], touched: ['sample_3'], resonate: ['sample_4'] }, reports: [], createdAt: now - d * 2 }
  ];

  // 添加 id 和 authorId
  const posts = samplePosts.map((p, i) => ({
    ...p,
    id: 'p_' + (i + 1),
    authorId: p.author.id,
    authorMbti: p.author.mbti,
    images: [],
    createdAt: p.createdAt
  }));

  DB.set('posts', posts);

  // 示例日记
  const sampleDiaries = [
    { id: 'diary_1', date: new Date(now - d * 2).toISOString().slice(0, 16), content: '今天天气很好，出去散了步。路边的花都开了，春天真的来了。虽然最近压力很大，但看到这些花心情好了很多。', mood: 'calm', isPublic: true, createdAt: now - d * 2 },
    { id: 'diary_2', date: new Date(now - d).toISOString().slice(0, 16), content: '和朋友吃了一顿火锅，聊了很多以前的事情。时间过得真快，转眼我们都毕业好几年了。希望我们的友谊能一直延续下去。', mood: 'happy', isPublic: false, createdAt: now - d },
    { id: 'diary_3', date: new Date().toISOString().slice(0, 16), content: '新的一天，新的开始。虽然昨天失眠了，但今天还是要打起精神来。给自己加油！', mood: 'expect', isPublic: false, createdAt: now }
  ];
  DB.set('diaries', sampleDiaries);

  // 示例回信
  const sampleLetters = [
    { id: 'letter_1', content: '亲爱的未来的我，希望你已经实现了现在的梦想。不管遇到什么困难，都不要放弃。记住现在的你有多么勇敢和坚强。加油！', openAt: now + 7 * d, createdAt: now - d * 10 },
    { id: 'letter_2', content: '给一年后的自己：你现在还在做那份工作吗？有没有学会做饭？有没有去旅行？希望你过得开心。', openAt: now + 365 * d, createdAt: now - d * 5 }
  ];
  DB.set('letters', sampleLetters);

  // 示例私信
  const sampleConversations = [
    {
      id: 'conv_1',
      partnerId: 'sample_1',
      partner: sampleIdentities[0],
      messages: [
        { id: 'm_1', content: '你好呀，看了你的帖子很有感触', senderId: 'sample_2', createdAt: now - d * 3 },
        { id: 'm_2', content: '谢谢你的关心，真的很温暖', senderId: 'sample_1', createdAt: now - d * 3 + h },
        { id: 'm_3', content: '有什么想说的都可以跟我聊', senderId: 'sample_2', createdAt: now - d * 2 }
      ],
      createdAt: now - d * 3,
      unread: 0
    }
  ];
  DB.set('messages', sampleConversations);
}

// ============ 应用初始化 ============

function initApp() {
  // 初始化示例数据
  initSampleData();

  // 检查是否首次使用
  const identity = getIdentity();
  if (!identity) {
    openModal('roleSelectModal');
  }

  // 应用主题
  const theme = DB.get('theme', 'light');
  document.documentElement.setAttribute('data-theme', theme);
  applyThemePattern(theme);
  // 初始化 theme-color
  const themeColors = {
    light: '#f8f6f1', dark: '#1a1b1e', starry: '#0f172a',
    sakura: '#fdf2f4', sunny: '#fffbeb'
  };
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) metaThemeColor.content = themeColors[theme] || '#f8f6f1';

  // 恢复 Hero 折叠状态
  if (DB.get('hero_collapsed', false)) {
    collapseHero();
  }

  // 初始化筛选
  initFilters();

  // 初始化发帖表单
  initCreateForm();

  // 渲染帖子列表
  renderPostList();

  // 更新未读角标
  updateUnreadBadge();

  // 处理初始 hash
  const hash = location.hash.slice(1);
  if (hash) {
    if (hash.startsWith('detail/')) {
      const postId = hash.split('/')[1];
      navigate('detail', { postId });
    } else if (['create', 'messages', 'diary', 'letter', 'settings'].includes(hash)) {
      navigate(hash);
    }
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);
