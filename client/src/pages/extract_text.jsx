import { useState, useRef } from 'react';
import preprocessImage from './preprocess';
import Tesseract from 'tesseract.js';
import '../css/extract-text.css';
import Highlighter from "react-highlight-words";

function App() {
  const [image, setImage] = useState("");
  const [highlight, setHighligh] = useState("");
  const [text, setText] = useState("");
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [dates, setDates] = useState([]);
  const [creditCards, setCreditCards] = useState([])
  // const [pin, setPin] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  // Regex patterns to search for email, phone, date, and credit card number
  const emailRegex = /([a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9._-]+)/g;
  const phoneRegex = /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g;
  const dateRegex = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g;
  const creditCardRegex = /([0-9]{4}-){3}[0-9]{4}/g;

  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]))
    // setImage(`${window.location.origin}/${event.target.files[0].name}`);
    // const image = preprocessImage(canvasObj, event.target.files[0]);
  }

  const handleClick = () => {

    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas),0,0);
    const dataUrl = canvas.toDataURL("image/jpeg");
  
    Tesseract.recognize(
      dataUrl,'eng',
      {
        logger: m => console.log(m)
      }
    )
      .catch (err => {
        console.error(err);
      })
      .then(result => {      
        console.log(result)
        // Get Confidence score
        let confidence = result.confidence
        // Get full output
        let tex = JSON.stringify(result.data.text)
        let em = JSON.stringify(tex).match(emailRegex)
        setText(tex);
        setEmails(JSON.stringify(result.data.text).match(emailRegex))
        setPhones(JSON.stringify(result.data.text).match(phoneRegex))
        setDates(JSON.stringify(result.data.text).match(dateRegex))
        setCreditCards(JSON.stringify(result.data.text).match(creditCardRegex))

        result.data.words.forEach(function(item) {
          if ((item.text).indexOf(highlight) !== -1) {
            // boxes.push(item.bbox)
            setBoxes([...boxes, item.bbox])
          } 
        });
        boxes.forEach(box => {
          ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.stroke();
          console.log(box.x0);
        })
        ;
      });
  };

console.log(emails)
console.log(text)
  // Extract patterns using regex
//   const emails = text.match(emailRegex);
//   const phones = text.match(phoneRegex);
//   const dates = text.match(dateRegex);
//   const creditCards = text.match(creditCardRegex);
  
  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img 
           src={image} className="App-logo" alt="logo"
           ref={imageRef} 
           />
        <h3>Canvas</h3>
        <canvas ref={canvasRef} width={700} height={300}></canvas>
          <h3>Extracted text</h3>
        <div className="pin-box">
          {/* <p> {text} </p> */}
          <Highlighter
    highlightClassName="YourHighlightClass"
    searchWords={[highlight]}
    autoEscape={true}
    textToHighlight= {text}
  />


{text.length!==0 &&
<>
{emails &&
<>
<h1>Emails:</h1>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
      </>
}
{phones && 
<>
      <h1>Phone Numbers:</h1>
      <ul>
        {phones.map((phone, index) => (
          <li key={index}>{phone}</li>
        ))}
      </ul>
      </>
}
{dates &&
    <>
      <h1>Dates:</h1>
      <ul>
        {dates.map((date, index) => (
          <li key={index}>{date}</li>
        ))}
      </ul>
      </>
        }
{creditCards && 
<>
      <h1>Credit Card Numbers:</h1>
      <ul>
        {creditCards.map((creditCard, index) => (
          <li key={index}>{creditCard}</li>
        ))}
      </ul>
      </>
}
</>
}
        </div>

        <input type="file" onChange={handleChange} />
        <input type='text' onChange={(event)=>{
          setHighligh(event.target.value)
        }} style={{color: "black"}}/>
        <button onClick={handleClick} style={{height:50}}>Convert to text</button>
      </main>
    </div>
  );
}

export default App