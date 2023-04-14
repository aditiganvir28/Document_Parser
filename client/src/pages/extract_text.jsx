import { useState, useRef } from 'react';
import preprocessImage from './preprocess';
import Tesseract from 'tesseract.js';
import '../css/extract-text.css';
import Highlighter from "react-highlight-words";
import { saveAs } from "file-saver";
import { pdf, Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faCoffee } from '@fortawesome/free-solid-svg-icons'



function App() {
  const [image, setImage] = useState("");
  const [highlight, setHighlight] = useState("");
  const [text, setText] = useState("");
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [dates, setDates] = useState([]);
  const [extractedText, setextractedText] = useState([]);
  const [summarizedtext, setsummarizedtext] = useState([]);
  const [label, setclassification] = useState([]);
  const [score, setscore] = useState([]);
  const [creditCards, setCreditCards] = useState([])
  const [transcript, setTranscript] = useState('');
  // const [pin, setPin] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
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
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
    },
    section: {
      flexGrow: 1,
    },
  });

  const generatePDFDocument = async () => {
    const blob = await pdf(
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {console.log(phones)}
            <Text>  {text} </Text>
          </View>
          {/* <View style={styles.section}>
          <Text>We're inside a PDF!</Text>
        </View> */}
        </Page>
      </Document>


    ).toBlob();

    console.log(blob);

    saveAs(blob, "pageName");
  };

  const handleClick = async () => {

    const canvas = canvasRef.current;
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas), 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    Tesseract.recognize(
      dataUrl, 'eng',
      {
        // logger: m => console.log(m)
      }
    )
      .catch(err => {
        console.error(err);
      })
      .then(result => {
        // console.log(result)
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
        setextractedText(result.data.text)

        const boxes = result.data.words
          .filter(item => ((item.text).indexOf(transcript) !== -1))
          .map(item => item.bbox);

        boxes.forEach(box => {
          ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.stroke();
          // console.log(box.x0);
        })
          ;
      });
  };
  const summarize = async () => {
    const res2 = await fetchResult(extractedText);
    // console.log(res2[0].summary_text)
    setsummarizedtext(res2[0].summary_text)
    console.log(res2.result)
  }
  const classifytext = async () => {
    const res2 = await textClassification(extractedText);
    // console.log(res2[0].summary_text)
    console.log('res2')
    console.log(res2)
    let highestScoreLabel = "";
    let highestScore = 0;

    res2.forEach((it) => {
      it.forEach((item) => {
        if (item.score > highestScore) {
          highestScore = item.score;
          highestScoreLabel = item.label;
        }
      })
    });
    setclassification(highestScoreLabel)
    setscore(highestScore)
  }
  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.start();
  };

  const API_TOKEN = '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'
  async function fetchResult(script) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(script),
      }
    );
    const result = await response.json();
    setsummarizedtext(result)
    return result;
  }
  async function textClassification(script) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        method: "POST",
        body: JSON.stringify(script),
      }
    );
    const result = await response.json();
    setclassification(result)
    return result;
  }

  return (
    <div className="App">
      <main className="App-main">
        <div className='one'>
          <input type="file" onChange={handleChange} />
          <button onClick={handleClick}>Convert to text</button>
        </div>
        <div className='img'>
          <div className='actual-img'>
            <h3>Actual image uploaded</h3>
            <img
              src={image} className="App-logo"
              ref={imageRef}
            />
          </div>
          <div className='canvas-img'>
            <h3>Canvas</h3>
            <canvas ref={canvasRef}></canvas>
          </div>
        </div>
        <div className='two'>
          <input type='text' placeholder="Enter the word to be searched..." value={transcript} onChange={(event) => {
            setTranscript(event.target.value)
          }} style={{ color: "black" }} />
          <button onClick={handleVoiceInput}>Start Voice Input</button>
          <FontAwesomeIcon icon="fa-regular fa-microphone-lines" />
          <br></br>
          {/* <p>{transcript}</p> */}
        </div>
        <div className='text'>
          <div className='extract-text'>
            <h3>Extracted text</h3>
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={[transcript]}
              autoEscape={true}
              textToHighlight={text}
            />
            {text.length !== 0 &&
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
          <div className="pin-box">
            <button onClick={summarize} className='sum'>Summarize</button>
            <br></br>
            <h3>Summarized Text</h3>
            <p> {summarizedtext} </p>
            <br></br>

            <button onClick={classifytext} className='sem'>classifytext</button>
            <br></br>
            <p> Semantic classification </p>
            <p> {label}: {score} </p>
            <br></br>
          </div>
        </div>

        
        <div className='download'>
          <button onClick={() => generatePDFDocument("doc name")} className='down'>
            Download Here Now!!
          </button>
        </div>
      </main>
    </div>
  );
}

export default App