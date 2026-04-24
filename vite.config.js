// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   base: "/love-apology/",
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Tailwind v4 သုံးထားတာမို့ ဒါလေးပါနိုင်ပါတယ်

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/love-apology/", // <--- ဒီစာကြောင်းကို အတိအကျ ထည့်ပေးပါ
});
