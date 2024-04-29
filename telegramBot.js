const TelegramBot = require('node-telegram-bot-api'); 
const token = 'YOUR_TELEGRAM_BOT_TOKEN'; 
const bot = new TelegramBot(token, { polling: false }); 

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    
    if (body.inline_query) {
      const query = body.inline_query.query.trim(); 
      const results = []; 
      const operations = ['+', '-', '*', '/']; 
     
      operations.forEach((op) => { 
        const parts = query.split(op); 
        if (parts.length === 2) { 
          const left = parseFloat(parts[0].trim()); 
          const right = parseFloat(parts[1].trim()); 
     
          if (!isNaN(left) && !isNaN(right)) { 
            let result; 
            switch (op) { 
              case '+': 
                result = left + right; 
                break; 
              case '-': 
                result = left - right; 
                break; 
              case '*': 
                result = left * right; 
                break; 
              case '/': 
                result = right !== 0 ? left / right : 'Cannot divide by zero'; 
                break; 
            } 
     
            results.push({ 
              type: 'article', 
              id: `${left}${op}${right}`, // Unique identifier 
              title: `${left} ${op} ${right} = ${result}`, 
              input_message_content: { 
                message_text: `${left} ${op} ${right} = ${result}` 
              } 
            }); 
          } 
        } 
      }); 
     
      return {
        statusCode: 200,
        body: JSON.stringify({ inline_query_id: body.inline_query.id, results }),
      };
    } else if (body.message && body.message.text) {
      const msgText = body.message.text.toLowerCase();
      if (msgText === "hi") { 
        await bot.sendMessage(body.message.chat.id, "Hello dear user");
      }
      
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Message processed successfully" }),
      };
    } else {
      return { statusCode: 400, body: "Invalid request" };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
