const SUPABASE_URL = "https://xaxfzzaxfzwanongekyx.supabase.co";

const SUPABASE_ANON_KEY = sb_publishable_0NJRFqTuC4zJ3EAjBzWk6g_si1D_2JV

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const authMessage = document.getElementById("authMessage");


function showMessage(message) {
  authMessage.textContent = message;
  authMessage.classList.add("show");
}


showRegister.addEventListener("click", () => {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
  authMessage.classList.remove("show");
});


showLogin.addEventListener("click", () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
  authMessage.classList.remove("show");
});


async function checkUser() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    window.location.replace("app.html");
  }
}


checkUser();


loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  showMessage("Выполняется вход...");

  const {
    data,
    error
  } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {

    showMessage("Ошибка входа: " + error.message);

    return;
  }

  if (data.session) {

    showMessage("Вход выполнен!");

    setTimeout(() => {
      window.location.replace("app.html");
    }, 500);
  }

});


registerForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const name =
    document.getElementById("registerName").value.trim();

  const username =
    document.getElementById("registerUsername")
      .value
      .trim()
      .toLowerCase();

  const email =
    document.getElementById("registerEmail").value.trim();

  const password =
    document.getElementById("registerPassword").value;

  if (username.length < 3) {

    showMessage(
      "Имя пользователя должно содержать минимум 3 символа."
    );

    return;
  }

  showMessage("Создаём аккаунт...");

  const {
    data,
    error
  } = await supabaseClient.auth.signUp({

    email: email,

    password: password,

    options: {
      data: {
        full_name: name,
        username: username
      }
    }

  });

  if (error) {

    showMessage(
      "Ошибка регистрации: " + error.message
    );

    return;
  }

  if (!data.session) {

    showMessage(
      "Аккаунт создан! Проверь Email для подтверждения."
    );

    return;
  }

  showMessage("Аккаунт создан!");

  setTimeout(() => {
    window.location.replace("app.html");
  }, 500);

});


supabaseClient.auth.onAuthStateChange(
  (event, session) => {

    if (event === "SIGNED_IN" && session) {

      if (!window.location.pathname.endsWith("app.html")) {
        window.location.replace("app.html");
      }

    }

  }
);
