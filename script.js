/* ================================================================
   KAROLINE SOUZA — PORTFOLIO 2025
   script.js — Funcionalidades interativas
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   UTILITÁRIOS
---------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ================================================================
   1. CURSOR PERSONALIZADO
================================================================ */
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  /* Seguidor com lag suave */
  (function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  /* Expandir cursor em links/botões */
  const interactives = 'a, button, .skill-badge, .edu-card, .project-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      follower.style.opacity = '0.2';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.opacity = '1';
    }
  });
})();

/* ================================================================
   2. NAVBAR — scroll + menu mobile
================================================================ */
(function initNavbar() {
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (!navbar) return;

  /* Efeito ao rolar */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu hambúrguer */
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Fechar ao clicar em link */
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Fechar ao clicar fora */
  document.addEventListener('click', e => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* Link ativo baseado na seção visível */
function updateActiveLink() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');
  const offset   = 120;

  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - offset) current = s.id;
  });

  links.forEach(l => {
    l.classList.toggle('active', l.dataset.section === current);
  });
}

/* ================================================================
   3. SCROLL SUAVE (fallback para browsers antigos)
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ================================================================
   4. TYPEWRITER — hero role
================================================================ */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = [
    'Desenvolvedora de Software',
    'Educadora em Tecnologia',
    'Criadora de Experiências',
    'Professora de Programação',
    'Apaixonada por Código',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];

    if (deleting) {
      el.textContent = phrase.slice(0, --charIdx);
    } else {
      el.textContent = phrase.slice(0, ++charIdx);
    }

    let delay = deleting ? 50 : 90;

    if (!deleting && charIdx === phrase.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();

/* ================================================================
   5. PARTÍCULAS — fundo hero
================================================================ */
(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const N = 28;

  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const x   = Math.random() * 100;
    const y   = Math.random() * 100;
    const dur = 6 + Math.random() * 8;
    const del = Math.random() * 8;
    const sz  = Math.random() > 0.7 ? 3 : 2;

    p.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${sz}px;
      height: ${sz}px;
      --dur: ${dur}s;
      --delay: ${del}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

/* ================================================================
   6. REVEAL ON SCROLL — IntersectionObserver
================================================================ */
(function initReveal() {
  const items = $$('.reveal-item');
  if (!items.length) return;

  /* Revelar hero imediatamente */
  $$('.home-section .reveal-item').forEach((el, i) => {
    el.style.setProperty('--i', i);
    setTimeout(() => el.classList.add('revealed'), 200 + i * 120);
  });

  /* Demais seções via observer */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => {
    if (!el.closest('.home-section')) observer.observe(el);
  });
})();

/* ================================================================
   7. CONTADORES ANIMADOS — estatísticas
================================================================ */
(function initCounters() {
  const nums = $$('.stat-num');
  if (!nums.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => observer.observe(el));
})();

/* ================================================================
   8. BOTÃO VOLTAR AO TOPO
================================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ================================================================
   9. FORMULÁRIO — validação + envio (simulado)
================================================================ */
(function initForm() {
  const form      = $('#contactForm');
  if (!form) return;

  const nameInput    = $('#name');
  const emailInput   = $('#email');
  const msgInput     = $('#message');
  const submitBtn    = $('#submitBtn');
  const successMsg   = $('#formSuccess');

  /* Validação individual */
  function validate(input, errorId, rules) {
    const error = $(`#${errorId}`);
    const msg = rules(input.value.trim());
    error.textContent = msg;
    input.classList.toggle('error', !!msg);
    return !msg;
  }

  const rules = {
    name:    v => v.length < 2   ? 'Por favor, insira seu nome completo.' : '',
    email:   v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Insira um e-mail válido.' : '',
    message: v => v.length < 10  ? 'A mensagem deve ter pelo menos 10 caracteres.' : '',
  };

  /* Validação em tempo real ao sair do campo */
  nameInput?.addEventListener('blur',  () => validate(nameInput,  'nameError',    rules.name));
  emailInput?.addEventListener('blur', () => validate(emailInput, 'emailError',   rules.email));
  msgInput?.addEventListener('blur',   () => validate(msgInput,   'messageError', rules.message));

  /* Submit */
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const ok = [
      validate(nameInput,  'nameError',    rules.name),
      validate(emailInput, 'emailError',   rules.email),
      validate(msgInput,   'messageError', rules.message),
    ].every(Boolean);

    if (!ok) return;

    /* Simulação de envio (2s) */
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 2000));

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    form.reset();
    successMsg.classList.add('show');

    setTimeout(() => successMsg.classList.remove('show'), 5000);
  });
})();

/* ================================================================
   10. GITHUB API — carregar projetos
================================================================ */
(function initProjects() {
  const grid = $('#projectsGrid');
  if (!grid) return;

  const USERNAME = 'koralinee';
  const API_URL  = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`;

  /* Ícone por linguagem */
  const langIcon = {
    JavaScript: 'fa-brands fa-js',
    TypeScript: 'fa-brands fa-js',
    Python:     'fa-brands fa-python',
    HTML:       'fa-brands fa-html5',
    CSS:        'fa-brands fa-css3-alt',
    Java:       'fa-brands fa-java',
    default:    'fa-solid fa-code',
  };

  /* Cor por linguagem */
  const langColor = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python:     '#3572a5',
    HTML:       '#e34c26',
    CSS:        '#563d7c',
    Java:       '#b07219',
    default:    '#8a9ab5',
  };

  async function fetchRepos() {
    try {
      const res  = await fetch(API_URL);
      if (!res.ok) throw new Error('GitHub API error');
      const data = await res.json();

      /* Filtrar forks e repos sem descrição muito genérica */
      const repos = data
        .filter(r => !r.fork)
        .slice(0, 6);

      grid.innerHTML = '';

      if (!repos.length) {
        grid.innerHTML = `
          <div class="no-projects">
            <i class="fa-brands fa-github"></i>
            <p>Projetos em breve. Confira meu <a href="https://github.com/${USERNAME}" target="_blank">GitHub</a>!</p>
          </div>`;
        return;
      }

      repos.forEach((repo, i) => {
        const card = createCard(repo);
        card.style.transitionDelay = `${i * 0.07}s`;
        grid.appendChild(card);

        /* Trigger reveal */
        setTimeout(() => card.classList.add('revealed'), 50 + i * 70);
      });

    } catch (err) {
      /* Fallback se a API falhar */
      grid.innerHTML = buildFallbackCards();
      $$('.project-card', grid).forEach((c, i) => {
        setTimeout(() => c.classList.add('revealed'), 50 + i * 70);
      });
    }
  }

  function createCard(repo) {
    const lang    = repo.language || 'Outros';
    const icon    = langIcon[lang] || langIcon.default;
    const color   = langColor[lang] || langColor.default;
    const desc    = repo.description || 'Sem descrição disponível.';
    const stars   = repo.stargazers_count;
    const forks   = repo.forks_count;
    const updated = new Date(repo.updated_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });

    const card = document.createElement('div');
    card.className = 'project-card reveal-item';
    card.innerHTML = `
      <div class="project-header">
        <div class="project-icon"><i class="${icon}" style="color:${color}"></i></div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener" aria-label="Ver no GitHub" title="Ver no GitHub">
            <i class="fa-brands fa-github"></i>
          </a>
          ${repo.homepage ? `
            <a href="${repo.homepage}" target="_blank" rel="noopener" aria-label="Demo ao vivo" title="Demo ao vivo">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>` : ''}
        </div>
      </div>
      <h3 class="project-name">${repo.name.replace(/-/g, ' ')}</h3>
      <p class="project-desc">${desc.length > 120 ? desc.slice(0,120) + '…' : desc}</p>
      <div class="project-langs">
        ${lang !== 'Outros' ? `<span class="lang-tag">${lang}</span>` : ''}
      </div>
      <div class="project-meta">
        <span><i class="fa-regular fa-star"></i> ${stars}</span>
        <span><i class="fa-solid fa-code-branch"></i> ${forks}</span>
        <span><i class="fa-regular fa-clock"></i> ${updated}</span>
      </div>
    `;
    return card;
  }

  /* Cards de fallback caso a API não responda */
  function buildFallbackCards() {
    const items = [
      { name: 'portfolio', desc: 'Portfólio pessoal desenvolvido com HTML, CSS e JavaScript puro.', lang: 'HTML' },
      { name: 'projeto-web', desc: 'Projeto web desenvolvido durante a graduação na Fatec.', lang: 'JavaScript' },
      { name: 'robótica-educacional', desc: 'Recursos e atividades para ensino de robótica para crianças e jovens.', lang: 'Python' },
      { name: 'algoritmos', desc: 'Implementações de algoritmos e estruturas de dados.', lang: 'Java' },
      { name: 'app-mobile', desc: 'Aplicação mobile multiplataforma.', lang: 'JavaScript' },
      { name: 'banco-de-dados', desc: 'Modelagem e implementação de banco de dados relacional.', lang: 'CSS' },
    ];

    return items.map(({ name, desc, lang }, i) => {
      const icon  = langIcon[lang] || langIcon.default;
      const color = langColor[lang] || langColor.default;
      return `
        <div class="project-card reveal-item" style="transition-delay:${i * 0.07}s">
          <div class="project-header">
            <div class="project-icon"><i class="${icon}" style="color:${color}"></i></div>
            <div class="project-links">
              <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener" aria-label="GitHub">
                <i class="fa-brands fa-github"></i>
              </a>
            </div>
          </div>
          <h3 class="project-name">${name.replace(/-/g, ' ')}</h3>
          <p class="project-desc">${desc}</p>
          <div class="project-langs"><span class="lang-tag">${lang}</span></div>
          <div class="project-meta">
            <span><i class="fa-regular fa-star"></i> 0</span>
            <span><i class="fa-solid fa-code-branch"></i> 0</span>
          </div>
        </div>
      `;
    }).join('');
  }

  fetchRepos();
})();

/* ================================================================
   11. EFEITO PARALLAX SUTIL — fundo grid no hero
================================================================ */
(function initParallax() {
  const grid = $('.grid-bg');
  if (!grid) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      grid.style.transform = `translateY(${y * 0.25}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* ================================================================
   12. HIGHLIGHT — seção ativa com borda sutil no nav
================================================================ */
window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();
