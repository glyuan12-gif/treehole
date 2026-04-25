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

// 角色映射
const ROLES = {
  student: { name: '学生党', icon: '🎓' },
  worker: { name: '打工人', icon: '💼' },
  freelancer: { name: '自由职业', icon: '🎨' },
  traveler: { name: '神秘旅人', icon: '🧭' }
};

// 可选 Emoji 列表（72个）
const EMOJI_LIST = [
  '😊','😂','🥰','😎','🤔','😢','😤','🥺',
  '😴','🤗','😇','🙃','😋','🤩','🥳','😇',
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

// 敏感词库（基础）
const SENSITIVE_WORDS = [
  '赌博','色情','暴力','恐怖','毒品','枪支','炸弹','杀人','自杀',
  '诈骗','传销','洗钱','走私','卖淫','嫖娼','强奸','猥亵',
  '身份证号','银行卡号','密码泄露','信用卡',
  '代开发票','假币','违禁品','管制刀具',
  '人肉搜索','网络暴力','恶意造谣',
  '赌博网站','色情网站','非法集资'
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
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
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
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// 随机昵称
function randomNickname() {
  const adj = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
  const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
  return adj + noun;
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
  const hero = document.getElementById('heroSection');
  const expandBtn = document.getElementById('heroExpandBtn');
  hero.classList.add('collapsed');
  expandBtn.style.display = 'block';
  App.heroCollapsed = true;
  DB.set('hero_collapsed', true);
}

function expandHero() {
  const hero = document.getElementById('heroSection');
  const expandBtn = document.getElementById('heroExpandBtn');
  hero.classList.remove('collapsed');
  expandBtn.style.display = 'none';
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

  let imagesHtml = '';
  if (post.images && post.images.length > 0) {
    imagesHtml = `<div class="post-images">${post.images.map(img =>
      `<img class="post-image" src="${img}" alt="图片" onclick="event.stopPropagation();viewImage('${img.replace(/'/g, "\\'")}')">`
    ).join('')}</div>`;
  }

  return `
    <div class="post-card${post.mood ? ' data-mood="'+post.mood+'"' : ''}" onclick="navigate('detail', {postId: '${post.id}'})">
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

  // 敏感词检测
  for (const word of SENSITIVE_WORDS) {
    if (fullText.includes(word.toLowerCase())) {
      return { pass: false, reason: '内容包含敏感词，请修改后重新发布' };
    }
  }

  // 内容过短
  if (content.trim().length < 5) {
    return { pass: false, reason: '内容太短了，至少写 5 个字吧' };
  }

  // 特殊字符比例检测
  const specialChars = (fullText.match(/[^\w\u4e00-\u9fa5\s]/g) || []).length;
  if (specialChars / fullText.length > 0.5) {
    return { pass: false, reason: '特殊字符过多，请正常输入内容' };
  }

  return { pass: true };
}

// 提交帖子
function submitPost() {
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
  const emotionTypes = [
    { key: 'touched', label: '感动', emoji: '🥹' },
    { key: 'heartache', label: '心疼', emoji: '💔' },
    { key: 'resonate', label: '共鸣', emoji: '🤝' },
    { key: 'agree', label: '赞同', emoji: '👍' },
    { key: 'think', label: '深思', emoji: '🤔' },
    { key: 'warm', label: '温暖', emoji: '☀️' }
  ];

  let emotionsHtml = emotionTypes.map(e => {
    const count = post.emotions && post.emotions[e.key] ? post.emotions[e.key].length : 0;
    const isActive = identity && post.emotions && post.emotions[e.key] && post.emotions[e.key].includes(identity.id);
    return `<button class="emotion-btn ${isActive ? 'active' : ''}" onclick="toggleEmotion('${post.id}','${e.key}')">
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
    <button class="btn-ghost btn-sm" onclick="navigate('home')" style="margin-bottom:16px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><polyline points="15 18 9 12 15 6"/></svg>
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
          <input type="text" class="comment-input" id="commentInput" placeholder="写下你的想法..." maxlength="500">
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

  // 举报超过3次自动隐藏
  if (post.reports.length >= 3) {
    post.hidden = true;
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
    const preview = lastMsg ? (lastMsg.senderId === identity.id ? '我: ' : '') + lastMsg.content : '暂无消息';
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

  // 防重复发送（1秒）
  if (Date.now() - App.lastSendTime < 1000) return;
  App.lastSendTime = Date.now();

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
        <div class="letter-preview">${escapeHtml(letter.content.substring(0, 30))}${letter.content.length > 30 ? '...' : ''}</div>
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
  // E/I 维度 (6题)
  { id: 1, dimension: 'EI', text: '在社交聚会上，你通常会...', options: [
    { text: '主动和很多人聊天，享受热闹的氛围', value: 'E' },
    { text: '找一两个熟悉的人安静聊天', value: 'I' }
  ]},
  { id: 2, dimension: 'EI', text: '周末你更倾向于...', options: [
    { text: '约朋友出去聚会或参加活动', value: 'E' },
    { text: '在家看书、追剧或独处充电', value: 'I' }
  ]},
  { id: 3, dimension: 'EI', text: '在团队讨论中，你通常...', options: [
    { text: '积极发言，分享自己的想法', value: 'E' },
    { text: '先听别人说，想好了再发言', value: 'I' }
  ]},
  { id: 4, dimension: 'EI', text: '长时间独处后，你会...', options: [
    { text: '感到无聊，想要出去社交', value: 'E' },
    { text: '觉得很充实，不想被打扰', value: 'I' }
  ]},
  { id: 5, dimension: 'EI', text: '认识新朋友时，你...', options: [
    { text: '很容易和陌生人打成一片', value: 'E' },
    { text: '需要时间才能打开心扉', value: 'I' }
  ]},
  { id: 6, dimension: 'EI', text: '你的能量来源主要是...', options: [
    { text: '与他人的互动和交流', value: 'E' },
    { text: '独处时的思考和反思', value: 'I' }
  ]},
  // S/N 维度 (6题)
  { id: 7, dimension: 'SN', text: '你更关注...', options: [
    { text: '具体的事实和细节', value: 'S' },
    { text: '整体的概念和可能性', value: 'N' }
  ]},
  { id: 8, dimension: 'SN', text: '学习新东西时，你更喜欢...', options: [
    { text: '按步骤来，注重实际操作', value: 'S' },
    { text: '先理解原理，再灵活运用', value: 'N' }
  ]},
  { id: 9, dimension: 'SN', text: '你更信赖...', options: [
    { text: '自己的经验和过去的经历', value: 'S' },
    { text: '自己的直觉和第六感', value: 'N' }
  ]},
  { id: 10, dimension: 'SN', text: '描述一件事时，你倾向于...', options: [
    { text: '按时间顺序详细叙述', value: 'S' },
    { text: '跳跃式地讲述重点和感受', value: 'N' }
  ]},
  { id: 11, dimension: 'SN', text: '面对问题时，你更倾向于...', options: [
    { text: '参考已有的解决方案', value: 'S' },
    { text: '寻找全新的解决方法', value: 'N' }
  ]},
  { id: 12, dimension: 'SN', text: '你更欣赏的人是...', options: [
    { text: '脚踏实地、注重实际的人', value: 'S' },
    { text: '充满想象力、有远见的人', value: 'N' }
  ]},
  // T/F 维度 (6题)
  { id: 13, dimension: 'TF', text: '做决定时，你更看重...', options: [
    { text: '逻辑分析和客观事实', value: 'T' },
    { text: '个人感受和他人的影响', value: 'F' }
  ]},
  { id: 14, dimension: 'TF', text: '朋友遇到困难来找你，你会...', options: [
    { text: '帮他分析问题，给出解决方案', value: 'T' },
    { text: '先安慰他的情绪，让他感到被理解', value: 'F' }
  ]},
  { id: 15, dimension: 'TF', text: '在争论中，你更倾向于...', options: [
    { text: '坚持自己认为正确的观点', value: 'T' },
    { text: '为了和谐而做出让步', value: 'F' }
  ]},
  { id: 16, dimension: 'TF', text: '评价一个人时，你更看重...', options: [
    { text: '他的能力和成就', value: 'T' },
    { text: '他的品格和为人', value: 'F' }
  ]},
  { id: 17, dimension: 'TF', text: '你觉得更重要的是...', options: [
    { text: '公平和正义', value: 'T' },
    { text: '善良和同情', value: 'F' }
  ]},
  { id: 18, dimension: 'TF', text: '收到批评时，你通常会...', options: [
    { text: '理性分析批评是否合理', value: 'T' },
    { text: '先感到受伤，然后慢慢消化', value: 'F' }
  ]},
  // J/P 维度 (6题)
  { id: 19, dimension: 'JP', text: '你的日常生活更像是...', options: [
    { text: '有计划、有条理的', value: 'J' },
    { text: '随性、灵活的', value: 'P' }
  ]},
  { id: 20, dimension: 'JP', text: '面对截止日期，你通常...', options: [
    { text: '提前完成，留出缓冲时间', value: 'J' },
    { text: '在最后期限前冲刺完成', value: 'P' }
  ]},
  { id: 21, dimension: 'JP', text: '旅行时，你更喜欢...', options: [
    { text: '提前规划好详细的行程', value: 'J' },
    { text: '到了目的地再随机应变', value: 'P' }
  ]},
  { id: 22, dimension: 'JP', text: '你的工作空间通常是...', options: [
    { text: '整洁有序，东西都有固定位置', value: 'J' },
    { text: '有点乱但自己能找到东西', value: 'P' }
  ]},
  { id: 23, dimension: 'JP', text: '制定规则时，你倾向于...', options: [
    { text: '严格遵守既定的规则和流程', value: 'J' },
    { text: '觉得规则可以灵活变通', value: 'P' }
  ]},
  { id: 24, dimension: 'JP', text: '对于未来，你...', options: [
    { text: '喜欢有明确的目标和计划', value: 'J' },
    { text: '保持开放，看看会有什么机会', value: 'P' }
  ]}
];

function openMBTITest() {
  App.mbtiTestAnswers = new Array(24).fill(null);
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

  const sampleIdentities = [
    { id: 'sample1', nickname: '温柔的猫咪', role: 'student', mbti: 'INFP', avatarStyle: 'emoji', emoji: '🐱', bgColor: '#5b8c6e', createdAt: Date.now() - 86400000 * 30 },
    { id: 'sample2', nickname: '酷酷的星星', role: 'worker', mbti: 'INTJ', avatarStyle: 'emoji', emoji: '⭐', bgColor: '#7b8cde', createdAt: Date.now() - 86400000 * 25 },
    { id: 'sample3', nickname: '快乐的小熊', role: 'freelancer', mbti: 'ENFP', avatarStyle: 'emoji', emoji: '🐻', bgColor: '#d4944a', createdAt: Date.now() - 86400000 * 20 },
    { id: 'sample4', nickname: '安静的月亮', role: 'student', mbti: 'INFJ', avatarStyle: 'emoji', emoji: '🌙', bgColor: '#d4728a', createdAt: Date.now() - 86400000 * 15 },
    { id: 'sample5', nickname: '勇敢的微风', role: 'worker', mbti: 'ENTJ', avatarStyle: 'emoji', emoji: '🍃', bgColor: '#6fa882', createdAt: Date.now() - 86400000 * 10 },
    { id: 'sample6', nickname: '神秘的云朵', role: 'traveler', mbti: 'INTP', avatarStyle: 'emoji', emoji: '☁️', bgColor: '#c495d4', createdAt: Date.now() - 86400000 * 5 },
    { id: 'sample7', nickname: '文艺的晚风', role: 'student', mbti: 'ISFP', avatarStyle: 'emoji', emoji: '🌸', bgColor: '#e67e22', createdAt: Date.now() - 86400000 * 3 },
    { id: 'sample8', nickname: '孤独的露珠', role: 'worker', mbti: 'ISTJ', avatarStyle: 'emoji', emoji: '💧', bgColor: '#3498db', createdAt: Date.now() - 86400000 * 2 }
  ];

  const samplePosts = [
    { title: '考研倒计时30天，好焦虑', content: '还有30天就要考研了，可是感觉什么都没准备好。每天在图书馆从早到晚，但效率越来越低。室友们都找到了工作或者保了研，只有我还在苦哈哈地备考。有时候真的会怀疑自己的选择是不是对的...', channel: 'campus', mood: 'anxious', tags: ['secret', 'complain'], author: sampleIdentities[0], likes: 23, likedBy: ['sample2','sample3','sample4'], comments: [
      { id: 'c1', content: '加油！最后一个月坚持住，你一定可以的！', author: sampleIdentities[2], authorId: 'sample3', createdAt: Date.now() - 86400000 * 28 },
      { id: 'c2', content: '我去年也是这样过来的，最后结果比想象的好，相信自己', author: sampleIdentities[3], authorId: 'sample4', createdAt: Date.now() - 86400000 * 27 },
      { id: 'c3', content: '焦虑是正常的，说明你在乎。适当放松也很重要', author: sampleIdentities[1], authorId: 'sample2', createdAt: Date.now() - 86400000 * 26 }
    ], emotions: { touched: ['sample3','sample4'], resonate: ['sample2'], warm: ['sample1'] }, reports: [], createdAt: Date.now() - 86400000 * 29 },
    { title: '入职三个月了，终于适应了', content: '从校园到职场的转变真的不容易。刚开始的时候每天都在犯错，被领导说了好几次。但现在慢慢上手了，也交到了几个不错的同事朋友。虽然工资不高，但至少能养活自己了。分享一些职场小经验给大家。', channel: 'work', mood: 'calm', tags: ['experience', 'share'], author: sampleIdentities[1], likes: 45, likedBy: ['sample1','sample3','sample5','sample6'], comments: [
      { id: 'c4', content: '恭喜适应了！能分享一下具体的经验吗？', author: sampleIdentities[4], authorId: 'sample5', createdAt: Date.now() - 86400000 * 20 }
    ], emotions: { agree: ['sample5'], warm: ['sample1'] }, reports: [], createdAt: Date.now() - 86400000 * 24 },
    { title: '今天在路边看到一只流浪猫', content: '下班回家的路上，看到一只小橘猫蹲在路边。它看到我过来，就蹭了蹭我的腿。我好想带它回家，但是出租屋不让养宠物。给它买了根火腿肠，看着它吃完才走。希望它能找到一个好人家。', channel: 'life', mood: 'moved', tags: ['daily', 'share'], author: sampleIdentities[2], likes: 67, likedBy: ['sample1','sample2','sample4','sample5','sample6','sample7'], comments: [
      { id: 'c5', content: '好有爱！可以联系当地的流浪动物救助站', author: sampleIdentities[6], authorId: 'sample7', createdAt: Date.now() - 86400000 * 18 },
      { id: 'c6', content: '我也好喜欢猫猫，可是条件不允许', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 * 17 }
    ], emotions: { touched: ['sample1','sample6','sample7'], warm: ['sample2','sample4'], heartache: ['sample3'] }, reports: [], createdAt: Date.now() - 86400000 * 19 },
    { title: '暗恋的人今天跟我说话了', content: '他/她今天主动来问我借笔记，我的心跳得好快。虽然只是一个很普通的对话，但我开心了一整天。不知道该不该表白，怕被拒绝之后连朋友都做不了。有没有人能给我一些建议？', channel: 'emotion', mood: 'expect', tags: ['secret', 'help'], author: sampleIdentities[3], likes: 89, likedBy: ['sample1','sample2','sample3','sample5','sample6','sample7','sample8'], comments: [
      { id: 'c7', content: '先从朋友做起，慢慢了解对方，不着急', author: sampleIdentities[2], authorId: 'sample3', createdAt: Date.now() - 86400000 * 14 },
      { id: 'c8', content: '勇敢一点！就算被拒绝也不会后悔', author: sampleIdentities[4], authorId: 'sample5', createdAt: Date.now() - 86400000 * 13 },
      { id: 'c9', content: '我当年也是这样，后来鼓起勇气表白了，现在在一起三年了', author: sampleIdentities[5], authorId: 'sample6', createdAt: Date.now() - 86400000 * 12 },
      { id: 'c10', content: '加油！喜欢就要说出来呀', author: sampleIdentities[6], authorId: 'sample7', createdAt: Date.now() - 86400000 * 11 }
    ], emotions: { touched: ['sample2','sample6'], resonate: ['sample1','sample3','sample7'], warm: ['sample4','sample5'], agree: ['sample8'] }, reports: [], createdAt: Date.now() - 86400000 * 15 },
    { title: '自由职业一年了，说说真实感受', content: '辞职做自由职业已经一年了。好处是时间自由，不用通勤，可以在家办公。坏处是收入不稳定，有时候一个月赚很多，有时候几乎没收入。而且很孤独，没有同事可以聊天。总的来说，适合自律的人，不适合我这种拖延症患者。', channel: 'work', mood: 'lost', tags: ['experience', 'share'], author: sampleIdentities[2], likes: 34, likedBy: ['sample1','sample4','sample7'], comments: [
      { id: 'c11', content: '深有同感，自由职业的孤独感真的很难受', author: sampleIdentities[3], authorId: 'sample4', createdAt: Date.now() - 86400000 * 10 }
    ], emotions: { resonate: ['sample4','sample7'], agree: ['sample1'] }, reports: [], createdAt: Date.now() - 86400000 * 11 },
    { title: '终于把毕业论文写完了！', content: '历时三个月，改了八遍，终于把毕业论文写完了！虽然可能还有很多问题，但至少交出去了。感觉整个人都轻松了。今晚要好好犒劳自己，吃顿好的！', channel: 'campus', mood: 'happy', tags: ['daily', 'share'], author: sampleIdentities[4], likes: 56, likedBy: ['sample1','sample2','sample3','sample6','sample7','sample8'], comments: [
      { id: 'c12', content: '恭喜恭喜！答辩加油！', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 * 8 },
      { id: 'c13', content: '太棒了！辛苦了这么久终于完成了', author: sampleIdentities[5], authorId: 'sample6', createdAt: Date.now() - 86400000 * 7 }
    ], emotions: { warm: ['sample1','sample2'], agree: ['sample3','sample6'] }, reports: [], createdAt: Date.now() - 86400000 * 9 },
    { title: '深夜emo，随便说说', content: '凌晨两点还睡不着。最近压力很大，工作上的事情一团糟，感情上也出了问题。感觉自己什么都做不好，好累。不知道有没有人和我一样，白天假装没事，晚上一个人崩溃。', channel: 'treehole', mood: 'sad', tags: ['secret', 'complain'], author: sampleIdentities[5], likes: 112, likedBy: ['sample1','sample2','sample3','sample4','sample6','sample7','sample8'], comments: [
      { id: 'c14', content: '抱抱你，你不是一个人，很多人都经历过', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 * 6 },
      { id: 'c15', content: '允许自己脆弱，不需要一直坚强', author: sampleIdentities[3], authorId: 'sample4', createdAt: Date.now() - 86400000 * 5 },
      { id: 'c16', content: '如果需要倾诉，可以私信我，我一直都在', author: sampleIdentities[6], authorId: 'sample7', createdAt: Date.now() - 86400000 * 4 },
      { id: 'c17', content: '一切都会好起来的，相信我', author: sampleIdentities[2], authorId: 'sample3', createdAt: Date.now() - 86400000 * 3 }
    ], emotions: { touched: ['sample1','sample4','sample7'], heartache: ['sample2','sample3','sample6'], resonate: ['sample8'], warm: ['sample4','sample6'] }, reports: [], createdAt: Date.now() - 86400000 * 7 },
    { title: '推荐几部治愈系电影', content: '最近看了几部特别治愈的电影，分享给大家：1.《小森林》- 关于回到乡村生活的故事，画面很美 2.《海街日记》- 是枝裕和的作品，温暖又治愈 3.《心灵奇旅》- 皮克斯的，关于找到人生的意义 4.《龙猫》- 永远的经典，看多少遍都不会腻。心情不好的时候看看这些电影，真的会好很多。', channel: 'life', mood: 'happy', tags: ['share', 'experience'], author: sampleIdentities[6], likes: 78, likedBy: ['sample1','sample2','sample3','sample4','sample5','sample7'], comments: [
      { id: 'c18', content: '《小森林》真的太治愈了！', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 * 4 },
      { id: 'c19', content: '加一个《千与千寻》！', author: sampleIdentities[5], authorId: 'sample6', createdAt: Date.now() - 86400000 * 3 }
    ], emotions: { agree: ['sample1','sample2','sample5'], warm: ['sample3','sample4'] }, reports: [], createdAt: Date.now() - 86400000 * 5 },
    { title: '今天被领导夸了', content: '做了一个方案被领导在会议上表扬了！虽然只是一个小小的肯定，但对我来说意义很大。入职以来一直在怀疑自己的能力，今天终于有了点信心。继续加油！', channel: 'work', mood: 'happy', tags: ['daily', 'share'], author: sampleIdentities[7], likes: 29, likedBy: ['sample1','sample2','sample4','sample5'], comments: [
      { id: 'c20', content: '太棒了！继续加油！', author: sampleIdentities[4], authorId: 'sample5', createdAt: Date.now() - 86400000 * 2 }
    ], emotions: { warm: ['sample1','sample4'], agree: ['sample2','sample5'] }, reports: [], createdAt: Date.now() - 86400000 * 3 },
    { title: '一个人旅行的第五天', content: '辞职后决定一个人出来旅行。今天是第五天，到了大理。洱海真的很美，坐在海边发了一下午的呆。虽然一个人有时候会感到孤独，但更多的是自由和放松。不用管工作消息，不用应付社交，就做自己想做的事。', channel: 'life', mood: 'calm', tags: ['daily', 'share'], author: sampleIdentities[5], likes: 95, likedBy: ['sample1','sample2','sample3','sample4','sample6','sample7','sample8'], comments: [
      { id: 'c21', content: '好羡慕！一个人旅行真的很酷', author: sampleIdentities[6], authorId: 'sample7', createdAt: Date.now() - 86400000 * 2 },
      { id: 'c22', content: '大理很美，祝你旅途愉快', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 }
    ], emotions: { resonate: ['sample1','sample6','sample7'], warm: ['sample2','sample3','sample4'], agree: ['sample8'] }, reports: [], createdAt: Date.now() - 86400000 * 2 },
    { title: '关于MBTI的一些想法', content: '做了MBTI测试发现自己是INFP，看了描述觉得好准。但后来想了一下，是不是因为我们看了描述之后，才觉得自己是这样的？就像星座一样，巴纳姆效应。不过MBTI至少能帮我们更好地了解自己，也不全是坏事。大家觉得呢？', channel: 'treehole', mood: 'lost', tags: ['daily', 'share'], author: sampleIdentities[3], likes: 41, likedBy: ['sample1','sample2','sample5','sample6'], comments: [
      { id: 'c23', content: '我觉得有一定参考价值，但不能完全定义一个人', author: sampleIdentities[5], authorId: 'sample6', createdAt: Date.now() - 86400000 }
    ], emotions: { think: ['sample1','sample2','sample5'], agree: ['sample6'] }, reports: [], createdAt: Date.now() - 86400000 },
    { title: '学做饭一个月了', content: '一个月前开始学做饭，从煮泡面都不会到现在能做几道简单的菜了。虽然味道一般，但看着自己做的菜还是很有成就感。今天尝试做了番茄炒蛋和蒜蓉西兰花，居然还不错！发出来纪念一下。', channel: 'life', mood: 'happy', tags: ['daily', 'experience'], author: sampleIdentities[7], likes: 52, likedBy: ['sample1','sample2','sample3','sample4','sample6'], comments: [
      { id: 'c24', content: '厉害！我到现在还只会煮泡面', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 * 3 },
      { id: 'c25', content: '番茄炒蛋是入门必修课，加油！', author: sampleIdentities[4], authorId: 'sample5', createdAt: Date.now() - 86400000 * 2 }
    ], emotions: { warm: ['sample1','sample2'], agree: ['sample3','sample4'] }, reports: [], createdAt: Date.now() - 86400000 * 4 },
    { title: '和好朋友吵架了', content: '因为一件小事和最好的朋友吵了一架，现在冷战三天了。其实我知道自己也有不对的地方，但就是拉不下脸去道歉。我们认识十年了，从来没有吵过这么久。好想回到以前的样子，但又不知道该怎么开口。', channel: 'emotion', mood: 'sad', tags: ['secret', 'help'], author: sampleIdentities[6], likes: 38, likedBy: ['sample1','sample3','sample4','sample7'], comments: [
      { id: 'c26', content: '十年的友情不会因为一次吵架就结束的，勇敢一点去道歉吧', author: sampleIdentities[3], authorId: 'sample4', createdAt: Date.now() - 86400000 * 2 },
      { id: 'c27', content: '可以发条消息说想他了，不用太正式', author: sampleIdentities[0], authorId: 'sample1', createdAt: Date.now() - 86400000 }
    ], emotions: { resonate: ['sample1','sample4'], warm: ['sample3','sample7'], heartache: ['sample6'] }, reports: [], createdAt: Date.now() - 86400000 * 2 },
    { title: '今天收到了offer！', content: '面试了五家公司，终于收到了心仪的offer！虽然薪资没有预期那么高，但是公司氛围很好，做的事情也是自己喜欢的。从秋招到现在，投了上百份简历，被拒了无数次，终于有了结果。想告诉正在找工作的朋友们，不要放弃！', channel: 'campus', mood: 'happy', tags: ['daily', 'experience'], author: sampleIdentities[0], likes: 88, likedBy: ['sample1','sample2','sample3','sample4','sample5','sample6','sample7','sample8'], comments: [
      { id: 'c28', content: '恭喜恭喜！太替你开心了！', author: sampleIdentities[2], authorId: 'sample3', createdAt: Date.now() - 86400000 },
      { id: 'c29', content: '我也在找工作，看到你的分享有了动力', author: sampleIdentities[7], authorId: 'sample8', createdAt: Date.now() - 86400000 },
      { id: 'c30', content: '好棒！第一份工作加油！', author: sampleIdentities[4], authorId: 'sample5', createdAt: Date.now() - 86400000 }
    ], emotions: { warm: ['sample2','sample3','sample4','sample5','sample6','sample7'], agree: ['sample1','sample8'] }, reports: [], createdAt: Date.now() - 86400000 },
    { title: '给三年后的自己写了一封信', content: '不知道三年后的你在做什么，是不是已经实现了现在的梦想。希望你依然保持初心，不要被生活磨平了棱角。如果遇到了困难，请记住现在的你有多么勇敢。无论如何，都要好好照顾自己。', channel: 'treehole', mood: 'expect', tags: ['secret', 'share'], author: sampleIdentities[4], likes: 63, likedBy: ['sample1','sample2','sample3','sample5','sample6','sample7'], comments: [
      { id: 'c31', content: '好感动，我也想给未来的自己写信', author: sampleIdentities[3], authorId: 'sample4', createdAt: Date.now() - 86400000 }
    ], emotions: { touched: ['sample1','sample2','sample3','sample6','sample7'], warm: ['sample5'], resonate: ['sample4'] }, reports: [], createdAt: Date.now() - 86400000 * 6 },
    { title: '失眠的第N个夜晚', content: '又失眠了。躺在床上翻来覆去就是睡不着，脑子里全是乱七八糟的想法。工作上的压力、生活中的琐事、对未来的迷茫...有时候真的很累，想找个地方好好哭一场。但是明天还要早起上班，只能逼自己闭上眼睛。', channel: 'treehole', mood: 'anxious', tags: ['secret', 'complain'], author: sampleIdentities[7], likes: 76, likedBy: ['sample1','sample2','sample3','sample4','sample5','sample6','sample7'], comments: [
      { id: 'c32', content: '试试睡前冥想或者听白噪音，对我很有用', author: sampleIdentities[5], authorId: 'sample6', createdAt: Date.now() - 86400000 * 3 },
      { id: 'c33', content: '失眠的时候可以起来写写日记，把脑子里的东西倒出来', author: sampleIdentities[3], authorId: 'sample4', createdAt: Date.now() - 86400000 * 2 }
    ], emotions: { resonate: ['sample1','sample2','sample3','sample6'], heartache: ['sample4','sample7'], warm: ['sample5'] }, reports: [], createdAt: Date.now() - 86400000 * 4 },
    { title: '学会了骑自行车！', content: '作为一个二十多岁还不会骑自行车的人，今天终于学会了！虽然摔了好几次，膝盖都磕破了，但是当终于能稳稳地骑起来的那一刻，真的太开心了。原来什么时候开始都不晚，只要你想学。', channel: 'life', mood: 'happy', tags: ['daily', 'share'], author: sampleIdentities[6], likes: 44, likedBy: ['sample1','sample2','sample3','sample4','sample5'], comments: [
      { id: 'c34', content: '哈哈哈太可爱了，恭喜！', author: sampleIdentities[2], authorId: 'sample3', createdAt: Date.now() - 86400000 }
    ], emotions: { warm: ['sample1','sample2','sample3','sample4'], agree: ['sample5'] }, reports: [], createdAt: Date.now() - 86400000 * 3 },
    { title: '被裁员了', content: '今天突然被通知裁员了，完全没有心理准备。公司说是因为业务调整，整个部门都被裁了。拿着赔偿金走出公司大门的那一刻，不知道该哭还是该笑。投了那么多简历，好不容易找到的工作，就这样没了。接下来该怎么办呢...', channel: 'work', mood: 'sad', tags: ['complain', 'help'], author: sampleIdentities[7], likes: 56, likedBy: ['sample1','sample2','sample3','sample4','sample5','sample6'], comments: [
      { id: 'c35', content: '抱抱你，这不是你的问题。趁这个机会好好休息一下，然后重新出发', author: sampleIdentities[4], authorId: 'sample5', createdAt: Date.now() - 86400000 },
      { id: 'c36', content: '有赔偿金的话可以先休息一段时间，调整好状态再找工作', author: sampleIdentities[1], authorId: 'sample2', createdAt: Date.now() - 86400000 }
    ], emotions: { heartache: ['sample1','sample2','sample3','sample4'], warm: ['sample5','sample6'], resonate: ['sample7'] }, reports: [], createdAt: Date.now() - 86400000 }
  ];

  // 添加 id 和 authorId
  const posts = samplePosts.map((p, i) => ({
    ...p,
    id: 'post_' + (i + 1),
    authorId: p.author.id,
    authorMbti: p.author.mbti,
    images: [],
    createdAt: p.createdAt || (Date.now() - 86400000 * (20 - i))
  }));

  DB.set('posts', posts);

  // 示例日记
  const sampleDiaries = [
    { id: 'diary_1', date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 16), content: '今天天气很好，出去散了步。路边的花都开了，春天真的来了。虽然最近压力很大，但看到这些花心情好了很多。', mood: 'calm', isPublic: true, createdAt: Date.now() - 86400000 * 2 },
    { id: 'diary_2', date: new Date(Date.now() - 86400000).toISOString().slice(0, 16), content: '和朋友吃了一顿火锅，聊了很多以前的事情。时间过得真快，转眼我们都毕业好几年了。希望我们的友谊能一直延续下去。', mood: 'happy', isPublic: false, createdAt: Date.now() - 86400000 },
    { id: 'diary_3', date: new Date().toISOString().slice(0, 16), content: '新的一天，新的开始。虽然昨天失眠了，但今天还是要打起精神来。给自己加油！', mood: 'expect', isPublic: false, createdAt: Date.now() }
  ];
  DB.set('diaries', sampleDiaries);

  // 示例回信
  const sampleLetters = [
    { id: 'letter_1', content: '亲爱的未来的我，希望你已经实现了现在的梦想。不管遇到什么困难，都不要放弃。记住现在的你有多么勇敢和坚强。加油！', openAt: Date.now() + 7 * 24 * 60 * 60 * 1000, createdAt: Date.now() - 86400000 * 10 },
    { id: 'letter_2', content: '给一年后的自己：你现在还在做那份工作吗？有没有学会做饭？有没有去旅行？希望你过得开心。', openAt: Date.now() + 365 * 24 * 60 * 60 * 1000, createdAt: Date.now() - 86400000 * 5 }
  ];
  DB.set('letters', sampleLetters);

  // 示例私信
  const sampleConversations = [
    {
      id: 'conv_1',
      partnerId: 'sample1',
      partner: sampleIdentities[0],
      messages: [
        { id: 'msg_1', content: '你好呀，看了你的帖子很有感触', senderId: 'sample2', createdAt: Date.now() - 86400000 * 3 },
        { id: 'msg_2', content: '谢谢你的关心，真的很温暖', senderId: 'sample1', createdAt: Date.now() - 86400000 * 3 + 3600000 },
        { id: 'msg_3', content: '有什么想说的都可以跟我聊', senderId: 'sample2', createdAt: Date.now() - 86400000 * 2 }
      ],
      createdAt: Date.now() - 86400000 * 3,
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
