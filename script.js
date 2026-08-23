"use strict";

/* =========================================================
   SOCIAL NETWORK — MAIN JAVASCRIPT
   ========================================================= */


/* =========================
   APP STATE
   ========================= */

const state = {
  currentSection: "home",

  likedPosts: new Set(),

  likedReels: new Set(),

  following: new Set(),

  messages: [
    {
      user: "Alex",
      text: "Привет! Добро пожаловать в Social Network.",
      me: false
    },
    {
      user: "You",
      text: "Привет! 👋",
      me: true
    }
  ],

  posts: [
    {
      id: 1,
      user: "Alex",
      username: "@alex",
      text:
        "Добро пожаловать в Social Network! Здесь мы будем создавать настоящую социальную сеть."
    }
  ],

  stories: [
    {
      id: 1,
      user: "Alex",
      letter: "A"
    },
    {
      id: 2,
      user: "Anna",
      letter: "N"
    },
    {
      id: 3,
      user: "Mike",
      letter: "M"
    }
  ]
};


/* =========================
   USERS
   ========================= */

const users = [
  {
    id: 1,
    name: "Alex",
    username: "@alex",
    letter: "A",
    followers: 1280
  },

  {
    id: 2,
    name: "Anna",
    username: "@anna",
    letter: "N",
    followers: 842
  },

  {
    id: 3,
    name: "Mike",
    username: "@mike",
    letter: "M",
    followers: 2310
  },

  {
    id: 4,
    name: "Sofia",
    username: "@sofia",
    letter: "S",
    followers: 531
  },

  {
    id: 5,
    name: "Daniel",
    username: "@daniel",
    letter: "D",
    followers: 1090
  }
];


/* =========================================================
   NAVIGATION
   ========================================================= */

function openSection(section, buttonId) {

  const sections = [
    "home",
    "search",
    "reels",
    "chat",
    "profile"
  ];

  sections.forEach(function(id) {

    const element =
      document.getElementById(id);

    if (element) {
      element.classList.add("hidden");
    }

  });


  const target =
    document.getElementById(section);

  if (!target) {
    console.warn(
      "Section not found:",
      section
    );

    return;
  }


  target.classList.remove("hidden");


  document
    .querySelectorAll(".nav-button")
    .forEach(function(button) {

      button.classList.remove("active");

    });


  if (buttonId) {

    const button =
      document.getElementById(buttonId);

    if (button) {
      button.classList.add("active");
    }

  }


  state.currentSection =
    section;


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   SEARCH
   ========================================================= */

function searchPeople() {

  const input =
    document.getElementById(
      "peopleSearch"
    );

  const container =
    document.getElementById(
      "people"
    );


  if (!input || !container) {
    return;
  }


  const value =
    input.value
      .toLowerCase()
      .trim();


  const results =
    users.filter(function(user) {

      return (
        user.name
          .toLowerCase()
          .includes(value)

        ||

        user.username
          .toLowerCase()
          .includes(value)
      );

    });


  if (results.length === 0) {

    container.innerHTML = `
      <div class="person">
        Пользователь не найден.
      </div>
    `;

    return;
  }


  container.innerHTML =
    results
      .map(createUserCard)
      .join("");

}


function createUserCard(user) {

  const following =
    state.following.has(
      user.username
    );


  return `

    <div class="person">

      <div class="user-avatar">
        ${escapeHTML(user.letter)}
      </div>

      <div class="person-info">

        <div class="person-name">
          ${escapeHTML(user.name)}
        </div>

        <div class="person-username">
          ${escapeHTML(user.username)}
        </div>

      </div>

      <button
        class="follow ${following ? "active" : ""}"
        onclick="followUser('${escapeAttribute(user.username)}', this)"
      >

        ${
          following
            ? "Вы подписаны"
            : "Подписаться"
        }

      </button>

    </div>

  `;
}


/* =========================================================
   FOLLOW
   ========================================================= */

function followUser(
  username,
  button
) {

  if (
    state.following.has(username)
  ) {

    state.following.delete(
      username
    );

    button.textContent =
      "Подписаться";

    button.classList.remove(
      "active"
    );

  } else {

    state.following.add(
      username
    );

    button.textContent =
      "Вы подписаны";

    button.classList.add(
      "active"
    );

  }

}


/* =========================================================
   POSTS
   ========================================================= */

function likePost(button) {

  if (!button) {
    return;
  }


  const post =
    button.closest(".post");


  if (!post) {
    return;
  }


  const id =
    post.dataset.postId ||
    "main";


  const counter =
    button.querySelector("span");


  if (!counter) {
    return;
  }


  let count =
    Number(counter.textContent) || 0;


  if (
    state.likedPosts.has(id)
  ) {

    state.likedPosts.delete(id);

    count--;

    button.style.color = "";

  } else {

    state.likedPosts.add(id);

    count++;

    button.style.color =
      "#ed4956";

  }


  counter.textContent =
    count;

}


function commentPost() {

  const text =
    prompt(
      "Напишите комментарий:"
    );


  if (
    text &&
    text.trim()
  ) {

    showToast(
      "Комментарий добавлен"
    );

  }

}


async function sharePost() {

  await shareContent(
    "Social Network",
    "Посмотри эту публикацию!"
  );

}


/* =========================================================
   CREATE POST
   ========================================================= */

function createPost() {

  const text =
    prompt(
      "Что хотите опубликовать?"
    );


  if (
    !text ||
    !text.trim()
  ) {
    return;
  }


  const cleanText =
    text.trim();


  const post = {

    id:
      Date.now(),

    user:
      "You",

    username:
      "@you",

    text:
      cleanText

  };


  state.posts.unshift(
    post
  );


  renderNewPost(
    post
  );


  showToast(
    "Публикация создана"
  );

}


function renderNewPost(post) {

  const home =
    document.getElementById(
      "home"
    );


  if (!home) {
    return;
  }


  const article =
    document.createElement(
      "article"
    );


  article.className =
    "post";


  article.dataset.postId =
    post.id;


  article.innerHTML = `

    <div class="post-header">

      <div class="user-avatar">
        Y
      </div>

      <div>

        <div class="user-name">
          You
        </div>

        <div class="user-handle">
          @you
        </div>

      </div>

    </div>

    <div class="post-media">
      POST
    </div>

    <div class="post-actions">

      <button
        class="action"
        onclick="likePost(this)"
      >
        ♡ <span>0</span>
      </button>

      <button
        class="action"
        onclick="commentPost()"
      >
        ○
      </button>

      <button
        class="action"
        onclick="sharePost()"
      >
        ↗
      </button>

    </div>

    <div class="post-text">
      ${escapeHTML(post.text)}
    </div>

  `;


  home.appendChild(
    article
  );

}


/* =========================================================
   REELS
   ========================================================= */

function likeReel(button) {

  if (!button) {
    return;
  }


  const reel =
    button.closest(".reel");


  if (!reel) {
    return;
  }


  const id =
    reel.dataset.reelId ||
    "reel";


  const counter =
    button.querySelector("small");


  if (!counter) {
    return;
  }


  let count =
    Number(counter.textContent) || 0;


  if (
    state.likedReels.has(id)
  ) {

    state.likedReels.delete(
      id
    );

    count--;

    button.style.color = "";

  } else {

    state.likedReels.add(
      id
    );

    count++;

    button.style.color =
      "#ff3040";

  }


  counter.textContent =
    count;

}


function commentReel() {

  const text =
    prompt(
      "Комментарий к Reel:"
    );


  if (
    text &&
    text.trim()
  ) {

    showToast(
      "Комментарий добавлен"
    );

  }

}


async function shareReel() {

  await shareContent(
    "Social Network Reel",
    "Посмотри этот Reel!"
  );

}


/* =========================================================
   CHAT
   ========================================================= */

function sendMessage() {

  const input =
    document.getElementById(
      "message"
    );


  const container =
    document.getElementById(
      "messages"
    );


  if (
    !input ||
    !container
  ) {
    return;
  }


  const text =
    input.value.trim();


  if (!text) {
    return;
  }


  state.messages.push({

    user:
      "You",

    text:
      text,

    me:
      true

  });


  addMessageToScreen(
    text,
    true
  );


  input.value =
    "";


  container.scrollTop =
    container.scrollHeight;


  /*
    Демонстрационный ответ.
    Позже заменим его настоящим
    realtime-чатом через Supabase.
  */

  setTimeout(
    function() {

      state.messages.push({

        user:
          "Alex",

        text:
          "Сообщение получено 👍",

        me:
          false

      });


      addMessageToScreen(
        "Сообщение получено 👍",
        false
      );


    },
    800
  );

}


function addMessageToScreen(
  text,
  me
) {

  const container =
    document.getElementById(
      "messages"
    );


  if (!container) {
    return;
  }


  const row =
    document.createElement(
      "div"
    );


  row.className =
    me
      ? "message me"
      : "message";


  const bubble =
    document.createElement(
      "div"
    );


  bubble.className =
    "bubble";


  bubble.textContent =
    text;


  row.appendChild(
    bubble
  );


  container.appendChild(
    row
  );


  container.scrollTop =
    container.scrollHeight;

}


function messageEnter(event) {

  if (
    event.key === "Enter"
  ) {

    event.preventDefault();

    sendMessage();

  }

}


/* =========================================================
   STORIES
   ========================================================= */

function openStory(user) {

  showToast(
    "История " +
    user +
    " открыта"
  );

}


function addStory() {

  showToast(
    "Загрузка историй подключим через Supabase Storage"
  );

}


/* =========================================================
   HEADER SEARCH
   ========================================================= */

function headerSearch(value) {

  if (
    !value ||
    !value.trim()
  ) {
    return;
  }


  openSection(
    "search",
    null
  );


  const input =
    document.getElementById(
      "peopleSearch"
    );


  if (input) {

    input.value =
      value;

    searchPeople();

  }

}


/* =========================================================
   PROFILE
   ========================================================= */

function editProfile() {

  const name =
    prompt(
      "Введите новое имя:"
    );


  if (
    !name ||
    !name.trim()
  ) {
    return;
  }


  const element =
    document.querySelector(
      ".profile-name"
    );


  if (element) {

    element.textContent =
      name.trim();

  }


  showToast(
    "Профиль обновлён"
  );

}


/* =========================================================
   SHARE
   ========================================================= */

async function shareContent(
  title,
  text
) {

  try {

    if (
      navigator.share
    ) {

      await navigator.share({

        title:
          title,

        text:
          text

      });

    } else {

      await navigator.clipboard.writeText(
        text
      );

      showToast(
        "Текст скопирован"
      );

    }

  } catch (error) {

    /*
      Пользователь мог закрыть
      окно отправки — это не ошибка сайта.
    */

    console.log(
      "Share cancelled"
    );

  }

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(
  message
) {

  let toast =
    document.getElementById(
      "toast"
    );


  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "toast";


    toast.style.position =
      "fixed";

    toast.style.left =
      "50%";

    toast.style.bottom =
      "82px";

    toast.style.transform =
      "translateX(-50%)";

    toast.style.background =
      "#111";

    toast.style.color =
      "#fff";

    toast.style.padding =
      "11px 16px";

    toast.style.borderRadius =
      "12px";

    toast.style.zIndex =
      "9999";

    toast.style.fontSize =
      "14px";

    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.style.opacity =
    "1";


  clearTimeout(
    toast.timer
  );


  toast.timer =
    setTimeout(
      function() {

        toast.style.opacity =
          "0";

      },
      2200
    );

}


/* =========================================================
   SECURITY HELPERS
   ========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeAttribute(value) {

  return String(value)
    .replace(
      /\\/g,
      "\\\\"
    )
    .replace(
      /'/g,
      "\\'"
    );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

  console.log(
    "Social Network JS запущен"
  );


  /*
    Загружаем пользователей
    при открытии приложения.
  */

  searchPeople();


  /*
    Обработчик Enter для поиска.
  */

  const search =
    document.getElementById(
      "peopleSearch"
    );


  if (search) {

    search.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter"
        ) {

          searchPeople();

        }

      }
    );

  }


  /*
    Автоматически прокручиваем
    чат вниз.
  */

  const messages =
    document.getElementById(
      "messages"
    );


  if (messages) {

    messages.scrollTop =
      messages.scrollHeight;

  }

}


/* =========================================================
   START APP
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

}
