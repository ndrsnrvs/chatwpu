import bot from './bot.svg';   //Bot image
import user from './user.svg'; //User image


const form = document.getElementById('form');  
//Specifically targetting the first form id (Questions)

const chatboxForm = document.getElementById('chatbox');
//Specifically targetting the chatbox id (Chatbox)

const chatContainer = document.querySelector('#chat_container');
//Get first element with #chat_container id. (Which is just the chat container)

let loadInterval; // loadInterval, loader() are currently not working as of 5/14/2023 will troubleshoot it a later time.
function loader(element) {
    element.textContent = '';
    
    loadInterval = setInterval(() => {
        element.textContent +='.';

        if(element.textContent === '....' ) {
            element.textContent = '';
        }
    }, 300)
}

function typeText(element, text) { //Makes the generated text drop in character by character

    let index = 0;
    
    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        }

        else {
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    
    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) { //Generates chat stripe on chat to designate between user and bot. 
  return (
      `
      <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
          <div class="profile">

          <img 
          src="${isAi ? bot : user}"
          alt="${isAi ? 'bot': 'user'}"/>

          </div>
          <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
      `
  )
}



const handleSubmit = async (e) => { //Handles the submission.  This async function 
  e.preventDefault();               //Prevents default action occuring, could possibly remove the event listeners on the HTML doc. 

  const form = e.target;
  const formId = form.getAttribute('id');
  console.log(form);
  console.log(formId);
  

  const data = new FormData(form);

  

  if (formId === 'form') {
    // Sending year data to the server
    try {
      const response = await fetch('https://chatwpu.onrender.com/save-year', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: data.get('year'),
          interest: data.get('interest'),
          question: data.get('question')
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        const savedYear = responseData.year;
        console.log('Year saved successfully:', savedYear);
        // Display the saved year on the webpage or perform any other actions
      } else {
        const yearErr = await response.text();
        console.log('Error saving year:', yearErr);
      }
    } catch (error) {
      console.log('Error occurred while saving year:', error);
    }
    } 
    
    
    
    
    
    
    
    else if (formId === 'chatbox') {
      // Sending prompt data to the server
      
      try {
        const response = await fetch('https://chatwpu.onrender.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: data.get('prompt')
          })
        });
  
        if (response.ok) {

  // Generating the user chat data stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  // Generating the bot's chat data stripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);


          const responseData = await response.json();
          const parsedData = responseData.bot.trim();
          await typeText(messageDiv, parsedData);
          // Handle the response as needed
        } else {
          const promptErr = await response.text();
          console.log('Error sending prompt:', promptErr);
        }
      } catch (error) {
        console.log('Error occurred while sending prompt:', error);
      }
    }
  };
  
form.addEventListener('submit', handleSubmit);
chatboxForm.addEventListener('submit', handleSubmit);
