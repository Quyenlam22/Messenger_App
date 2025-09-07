// import functions from "firebase-functions";
// import admin from "firebase-admin";
// import fetch from "node-fetch";
// import "dotenv/config";

// admin.initializeApp();
// const db = admin.firestore();

// export const chatbot = functions.https.onRequest(async (req, res) => {
//   try {
//     // ✅ Chỉ cho phép POST
//     if (req.method !== "POST") {
//       return res.status(405).send({ error: "Method Not Allowed" });
//     }

//     const { message } = req.body;
//     if (!message) {
//       return res.status(400).send({ error: "Message required" });
//     }

//     // ✅ Kiểm tra API Key
//     const OPENAI_KEY = process.env.OPENAI_KEY;
//     if (!OPENAI_KEY) {
//       console.error("❌ OPENAI_KEY chưa được cấu hình trong .env");
//       return res.status(500).send({ error: "Missing OpenAI API Key" });
//     }

//     // ✅ Gửi request tới OpenAI
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${OPENAI_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Bạn là một trợ lý AI, trả lời ngắn gọn bằng tiếng Việt hoặc tiếng Anh tuỳ theo ngôn ngữ của người dùng.",
//           },
//           { role: "user", content: message },
//         ],
//       }),
//     });

//     const data = await response.json();

//     // ✅ Log toàn bộ response để debug
//     console.log("🔍 OpenAI raw response:", JSON.stringify(data, null, 2));

//     // ✅ Kiểm tra dữ liệu trả về
//     if (!data.choices || !data.choices.length || !data.choices[0].message?.content) {
//       console.error("⚠️ OpenAI trả về dữ liệu trống hoặc không hợp lệ");
//       return res.status(500).send({
//         error: "OpenAI không trả lời",
//         raw: data, // gửi về để debug
//       });
//     }

//     const reply = data.choices[0].message.content;

//     // ✅ Lưu vào Firestore (tùy chọn)
//     try {
//       await db.collection("messages").add({
//         text: reply,
//         sender: "bot",
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       });
//     } catch (dbError) {
//       console.error("⚠️ Không thể lưu vào Firestore:", dbError);
//       // Không throw — vẫn trả về reply cho client
//     }

//     return res.status(200).send({ reply });
//   } catch (error) {
//     console.error("🔥 Cloud Function error:", error);
//     return res.status(500).send({ error: "AI API failed", details: error.message });
//   }
// });

import functions from "firebase-functions";
import admin from "firebase-admin";
import fetch from "node-fetch";
import "dotenv/config";

admin.initializeApp();
const db = admin.firestore();

export const chatbot = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const {message} = req.body;
  if (!message) {
    return res.status(400).send("Message required");
  }

  try {
    const GEMINI_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      "gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_KEY;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {text: message},
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (
      !data?.candidates?.[0]?.content?.parts?.[0]
          ?.text
    ) {
      return res.status(500).send({
        error: "Gemini không trả lời",
        raw: data,
      });
    }

    const reply =
      data.candidates[0].content.parts[0].text;

    await db.collection("messages").add({
      text: reply,
      sender: "bot",
      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).send({reply});
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).send({
      error: "Gemini API failed",
    });
  }
});
