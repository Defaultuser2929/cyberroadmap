// ==========================================
// TELEGRAM + SUPABASE SYNC
// ==========================================

const TELEGRAM_SYNC_URL =
  "https://odkbzwztkmxnyfduuqbf.supabase.co/functions/v1/telegram-sync";

const tg = window.Telegram?.WebApp;

let telegramUser = null;
let cloudSyncEnabled = false;

async function initTelegramSync() {
  if (!tg) {
    console.log("Opened outside Telegram");
    return;
  }

  tg.ready();
  tg.expand();

  try {
    const initData = tg.initData;

    if (!initData) {
      console.log("Telegram initData unavailable");
      return;
    }

    const response = await fetch(TELEGRAM_SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initData,
      }),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("Telegram auth error:", result);
      return;
    }

    telegramUser = result.user;
    cloudSyncEnabled = true;

    console.log(
      "Telegram user connected:",
      telegramUser
    );

  } catch (error) {
    console.error(
      "Telegram sync failed:",
      error
    );
  }
}

initTelegramSync();
