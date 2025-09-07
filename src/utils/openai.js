const url = process.env.REACT_APP_CHATBOT_URL;

export async function sendMessageToAI(message) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) throw new Error("Server error");
    return await response.json();
  } catch (err) {
    console.error("sendMessageToAI error:", err);
    return { reply: "Lỗi khi gọi chatbot. Vui lòng thử lại." };
  }
}