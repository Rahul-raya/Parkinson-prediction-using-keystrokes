export const typingPrompts = [
  "The morning sun cast long shadows across the quiet street. Coffee shops opened their doors, releasing the rich aroma of freshly brewed coffee. Children walked to school with backpacks bouncing, while parents rushed to catch their morning commute.",
  
  "Technology has transformed every aspect of modern society. Smartphones connect us to information and people across the globe instantly. Artificial intelligence assists us in tasks ranging from simple scheduling to complex problem solving. The digital revolution continues to evolve rapidly.",
  
  "Nature operates in cycles that have persisted for millions of years. Forests act as the lungs of our planet, absorbing carbon dioxide and producing oxygen. Oceans regulate climate patterns and provide habitat for countless species. Each element of nature is interconnected.",
  
  "Education shapes the foundation of human potential and drives societal progress. Quality learning experiences empower individuals to think critically and solve problems creatively. Teachers inspire curiosity and foster a love of learning. Modern education must adapt to prepare students for tomorrow.",
  
  "The art of cooking transcends mere sustenance, representing culture and creativity. Every cuisine tells a story of geography, history, and tradition passed down through generations. Spices that once drove global trade now flavor dishes around the world. Cooking brings people together.",
  
  "Music has been an integral part of human expression since ancient times. From tribal drums to symphony orchestras, music evolves while maintaining its power to move us emotionally. Musicians spend countless hours perfecting their craft and mastering their instruments.",
  
  "Space exploration represents humanity's boldest venture into the unknown. We have sent probes to distant planets, landed robots on Mars, and placed telescopes that peer billions of years into the past. The International Space Station demonstrates international cooperation in pursuit of knowledge.",
  
  "Historical events shape our present in ways both obvious and subtle. Understanding history helps us learn from past mistakes and appreciate the struggles that secured rights and freedoms. Ancient civilizations developed innovations in governance, engineering, and philosophy that still influence society.",
  
  "The ocean covers more than seventy percent of Earth's surface. Marine ecosystems support incredible biodiversity, from tiny plankton to massive whales. Coral reefs provide habitat for thousands of species. Protecting our oceans is essential for the future of our planet.",
  
  "Books open windows to different worlds and perspectives. Reading expands our vocabulary, improves our imagination, and develops critical thinking skills. Libraries have served as centers of knowledge and learning for centuries. Stories connect us to the human experience across time and cultures.",
  
  "Physical exercise benefits both body and mind. Regular activity strengthens the heart, builds muscle, and improves flexibility. Exercise releases endorphins that boost mood and reduce stress. Finding enjoyable activities makes it easier to maintain a consistent fitness routine throughout life.",
  
  "Climate change affects every corner of our planet. Rising temperatures impact weather patterns, sea levels, and ecosystems worldwide. Renewable energy sources offer sustainable alternatives to fossil fuels. Individual actions combined with systemic changes can make a meaningful difference for future generations.",
];

export function getRandomPrompt(): string {
  const randomIndex = Math.floor(Math.random() * typingPrompts.length);
  return typingPrompts[randomIndex];
}
