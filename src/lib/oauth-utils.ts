declare global {
  interface Window {
    gapi?: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID as string | undefined;

const generateRandomString = (length = 32) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Array.from(window.crypto.getRandomValues(new Uint8Array(length / 2)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const ensureGoogleAuth = async () => {
  if (window.gapi?.auth2) return window.gapi.auth2;

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector("script[src='https://apis.google.com/js/api.js']");
    if (existingScript) {
      if (window.gapi) {
        window.gapi.load("auth2", { callback: () => resolve(), onerror: reject });
        return;
      }
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!window.gapi) return reject(new Error("Google API failed to load."));
      window.gapi.load("auth2", { callback: () => resolve(), onerror: reject });
    };
    script.onerror = () => reject(new Error("Failed to load Google API script."));
    document.head.appendChild(script);
  });

  return window.gapi.auth2;
};

export const getGoogleIdToken = async () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID environment variable.");
  }

  const auth2 = await ensureGoogleAuth();
  const instance = auth2.getAuthInstance ? auth2.getAuthInstance() : null;
  const googleAuth =
    instance ||
    (await auth2.init({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
    }));

  const googleUser = await googleAuth.signIn();
  const idToken = googleUser?.getAuthResponse()?.id_token;

  if (!idToken) {
    throw new Error("Google did not return an ID token.");
  }

  return idToken as string;
};

const parseHash = (hash: string) => {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return {
    id_token: params.get("id_token"),
    access_token: params.get("access_token"),
    state: params.get("state"),
    error: params.get("error"),
    error_description: params.get("error_description"),
  };
};

const openMicrosoftAuthPopup = async (url: string, expectedState: string) => {
  const popup = window.open(url, "_blank", "width=500,height=700");
  if (!popup) {
    throw new Error("Unable to open Microsoft login popup.");
  }

  return new Promise<{ idToken: string; accessToken?: string }>((resolve, reject) => {
    const interval = window.setInterval(() => {
      if (!popup || popup.closed) {
        window.clearInterval(interval);
        reject(new Error("Microsoft login popup was closed."));
        return;
      }

      let hash = "";
      try {
        if (popup.location.origin === window.location.origin) {
          hash = popup.location.hash;
        }
      } catch {
        return;
      }

      if (!hash) return;

      const { id_token, access_token, state, error, error_description } = parseHash(hash);
      if (error) {
        popup.close();
        window.clearInterval(interval);
        reject(new Error(error_description ?? error));
        return;
      }

      if (!id_token) return;
      if (state !== expectedState) {
        popup.close();
        window.clearInterval(interval);
        reject(new Error("Microsoft login state mismatch."));
        return;
      }

      popup.close();
      window.clearInterval(interval);
      resolve({ idToken: id_token, accessToken: access_token ?? undefined });
    }, 250);
  });
};

export const getMicrosoftIdToken = async () => {
  if (!MICROSOFT_CLIENT_ID) {
    throw new Error("Missing VITE_MICROSOFT_CLIENT_ID environment variable.");
  }

  const state = generateRandomString();
  const nonce = generateRandomString();
  const redirectUri = window.location.origin;
  const params = new URLSearchParams({
    client_id: MICROSOFT_CLIENT_ID,
    response_type: "id_token",
    redirect_uri: redirectUri,
    response_mode: "fragment",
    scope: "openid profile email",
    nonce,
    state,
    prompt: "select_account",
  });

  const endpoint = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  const { idToken, accessToken } = await openMicrosoftAuthPopup(endpoint, state);
  return { idToken, accessToken, nonce };
};