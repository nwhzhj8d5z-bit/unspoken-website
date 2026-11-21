(function () {
  var PILLARS = ["Work & Money", "Time & Milestones", "Mind & Self", "Being Taken Seriously"];
  var PLACEHOLDERS = [
    { title: "The waiting room", tag: "Time & Milestones", tagColor: "purple" },
    { title: "They stopped listening", tag: "Being Taken Seriously", tagColor: "black" }
  ];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function catClass(c) { return c === "green" ? "cat-green" : (c === "purple" ? "cat-purple" : "cat-grey"); }
  function blockColor(c) { return c === "green" ? "var(--green)" : (c === "purple" ? "var(--purple)" : "var(--black)"); }

  function thumb(a) {
    if (a.image) {
      return '<div class="article-block"><img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || a.title) + '"></div>';
    }
    return '<div class="article-block" style="background:' + blockColor(a.tagColor) + ';"></div>';
  }

  function card(a) {
    return '<a class="article-card" href="' + esc(a.url) + '">' + thumb(a) +
      '<p class="cat-tag ' + catClass(a.tagColor) + '">' + esc(a.tag) + '</p>' +
      '<p class="article-card-title">' + esc(a.title) + '</p>' +
      '<p class="article-date">By ' + esc(a.author) + '</p></a>';
  }

  function placeholder(p) {
    return '<div class="article-card">' + thumb(p) +
      '<p class="cat-tag ' + catClass(p.tagColor) + '">' + esc(p.tag) + '</p>' +
      '<p class="article-card-title">' + esc(p.title) + '</p>' +
      '<p class="article-date">Coming soon</p></div>';
  }

  function featured(a) {
    var right;
    if (a.quote) {
      right = '<a class="quote-box ' + esc(a.tagColor || "") + '" href="' + esc(a.url) + '"><p>\u201c' + esc(a.quote) + '\u201d</p></a>';
    } else {
      right = '<a class="featured-img" href="' + esc(a.url) + '">' + (a.image ? '<img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || a.title) + '">' : '') + '</a>';
    }
    return '<p class="section-label">Latest Article</p><div class="featured-grid"><div>' +
      '<p class="cat-tag ' + catClass(a.tagColor) + '">' + esc(a.tag) + '</p>' +
      '<h2 class="featured-title">' + esc(a.title) + '</h2>' +
      '<p class="featured-by">By ' + esc(a.author) + '</p>' +
      '<p class="featured-desc">' + esc(a.teaser) + '</p>' +
      '<a href="' + esc(a.url) + '" class="read-now">Read now \u2192</a></div>' + right + '</div>';
  }

  function bySlug(slug) {
    for (var i = 0; i < ARTICLES.length; i++) { if (ARTICLES[i].slug === slug) return ARTICLES[i]; }
    return null;
  }

  function renderHome() {
    var f = document.getElementById("featured");
    var g = document.getElementById("more-grid");
    if (!f || !g || !ARTICLES.length) return;
    f.innerHTML = featured(ARTICLES[0]);
    var more = ARTICLES.slice(1, 4).map(card);
    var i = 0;
    while (more.length < 3 && i < PLACEHOLDERS.length) { more.push(placeholder(PLACEHOLDERS[i++])); }
    g.innerHTML = more.join("");
  }

  function renderArchive() {
    var grid = document.getElementById("archive-grid");
    var tabs = document.getElementById("filter-tabs");
    if (!grid || !tabs) return;
    var current = "All";
    function draw() {
      var list = ARTICLES.filter(function (a) { return current === "All" || a.tag === current; });
      grid.innerHTML = list.length ? list.map(card).join("") : '<p class="empty-note">Nothing here yet. Check back soon.</p>';
      var btns = tabs.querySelectorAll(".filter-tab");
      for (var i = 0; i < btns.length; i++) {
        btns[i].className = "filter-tab" + (btns[i].getAttribute("data-tag") === current ? " active" : "");
      }
    }
    tabs.innerHTML = ["All"].concat(PILLARS).map(function (t) {
      return '<button class="filter-tab" data-tag="' + esc(t) + '">' + esc(t) + '</button>';
    }).join("");
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".filter-tab") : null;
      if (!b) return;
      current = b.getAttribute("data-tag");
      draw();
    });
    draw();
  }

  function renderRelated() {
    var grid = document.getElementById("related-grid");
    if (!grid) return;
    var cur = grid.getAttribute("data-current");
    var others = ARTICLES.filter(function (a) { return a.slug !== cur; }).slice(0, 3);
    if (!others.length) { grid.parentNode.style.display = "none"; return; }
    grid.innerHTML = others.map(function (a) {
      return '<a class="related-card" style="display:block;" href="' + esc(a.url) + '">' + thumb(a) + '<p>' + esc(a.title) + '</p></a>';
    }).join("");
  }

  function renderHero() {
    var h = document.getElementById("article-hero");
    if (!h) return;
    var a = bySlug(h.getAttribute("data-slug"));
    if (a && a.image) {
      h.innerHTML = '<img src="' + esc(a.image) + '" alt="' + esc(a.imageAlt || a.title) + '">';
    } else {
      h.style.display = "none";
    }
  }

  if (typeof ARTICLES === "undefined") return;
  renderHome(); renderArchive(); renderRelated(); renderHero();
})();
