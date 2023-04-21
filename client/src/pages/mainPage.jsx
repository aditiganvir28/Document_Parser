import React from "react";
import { useState, useRef } from 'react';
import preprocessImage from './preprocess';
import Tesseract from 'tesseract.js';
import '../css/main.css';
import '../css/extract-text.css'
import Highlighter from "react-highlight-words";
import { saveAs } from "file-saver";
import { pdf, Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Header from '../partials/Header';
import { useSpeechSynthesis } from "react-speech-kit";

// import img from '../images/plain-text-01.jpg'
function main() {
    const [imageUploaded, setImageUploaded] = useState(false)
    const [imagUrl, setImgUrl] = useState("")
    const [convertText, setConvertText] = useState(false)
    const [highlight, setHighlight] = useState("");
    const [text, setText] = useState("");
    const [emails, setEmails] = useState([]);
    const [phones, setPhones] = useState([]);
    const [dates, setDates] = useState([]);
    const [extractedText, setextractedText] = useState([]);
    const [summarizedtext, setsummarizedtext] = useState([]);
    const [words, setwords] = useState([]);
    const [label, setclassification] = useState([]);
    const [score, setscore] = useState([]);
    const [creditCards, setCreditCards] = useState([])
    const [transcript, setTranscript] = useState('');
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [loading, setLoadin] = useState(false)
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    // Regex patterns to search for email, phone, date, and credit card number
    const emailRegex = /([a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9._-]+)/g;
    const phoneRegex = /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g;
    const dateRegex = /([0-9]{4}-[0-9]{2}-[0-9]{2})/g;
    const creditCardRegex = /([0-9]{4}-){3}[0-9]{4}/g;
    const { speak, cancel, speaking, supported } = useSpeechSynthesis();
    const voices={
        default: true,
        lang: "en-AU",
        localService: true,
        name: "Karen",
        voiceURI: "Karen",
      }
    const handletts =(event) =>{
        const msg = new SpeechSynthesisUtterance()
        msg.text = summarizedtext
        window.speechSynthesis.speak(msg,voices);
}
    const handleChange = (event) => {
        console.log(event)
        setImgUrl(URL.createObjectURL(event.target.files[0]))
        setImageUploaded(true)
    }
    const handleImageLoad = (event) => {
        console.log(event.target)
        const { naturalWidth: width, naturalHeight: height } = event.target;
        setImageSize({ width, height });
      };
    console.log(imageSize)
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

    console.log(imageRef)
 
    const handleClick2 = async () => {
        const canvas = canvasRef.current;
        canvas.width = imageSize.width;
        canvas.height = imageSize.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageRef.current, 0, 0);
        ctx.putImageData(preprocessImage(canvas), 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        if(transcript.length!=0){
        const boxes = words
        .filter(item => ((item.text).indexOf(transcript) !== -1))
        .map(item => item.bbox);
        
        boxes.forEach(box => {
            ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
    })}
    }
    const handleClick = async () => {
        const canvas = canvasRef.current;
        canvas.width = imageSize.width;
        canvas.height = imageSize.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imageRef.current, 0, 0);
        ctx.putImageData(preprocessImage(canvas), 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");



        Tesseract.recognize(
            imagUrl, 'eng',
            {
                // logger: m => console.log(m)
            }
        )
            .catch(err => {
                console.error(err);
            })
            .then(async (result) => {
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

                setwords(result.data.words)
                const res2 = await fetchResult(result.data.text);
                // console.log(res2[0].summary_text)
                setsummarizedtext(res2[0].summary_text)
                console.log(res2.result)

                const res3 = await textClassification(result.data.tex);
                // console.log(res2[0].summary_text)
                console.log('res3')
                console.log(res3)
                let highestScoreLabel = "";
                let highestScore = 0;

                res3.forEach((it) => {
                    it.forEach((item) => {
                        if (item.score > highestScore) {
                            highestScore = item.score;
                            highestScoreLabel = item.label;
                        }
                    })
                });
                setclassification(highestScoreLabel)
                setscore(highestScore)
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
        <>
        {loading &&
        <div>Loading...</div>
        }
            <div className='h-12'>
                <Header />
            </div>
            {!convertText && !loading &&
                <div>
                    <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>
                        {/* 1st item */}
                        <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-anchor="[data-aos-id-blocks]">
                            <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                                <path className="stroke-current text-purple-100" d="M30 39.313l-4.18 2.197L27 34.628l-5-4.874 6.91-1.004L32 22.49l3.09 6.26L42 29.754l-3 2.924" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd" />
                                <path className="stroke-current text-purple-300" d="M43 42h-9M43 37h-9" strokeLinecap="square" strokeWidth="2" />
                            </svg>
                            <p className="text-lg text-gray-400 text-center h4 mb-2">Upload Document</p>
                        </div>

                        {/* 2nd item */}
                        <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="100" data-aos-anchor="[data-aos-id-blocks]">
                            <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <circle className="fill-current text-purple-600" cx="32" cy="32" r="32" />
                                <path className="stroke-current text-purple-100" strokeWidth="2" strokeLinecap="square" d="M21 23h22v18H21z" fill="none" fillRule="evenodd" />
                                <path className="stroke-current text-purple-300" d="M26 28h12M26 32h12M26 36h5" strokeWidth="2" strokeLinecap="square" />
                            </svg>
                            <p className="text-lg text-gray-400 text-center h4 mb-2">Extract to Text</p>
                        </div>

                        {/* 3rd item */}
                        <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-blocks]">
                            <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                                <g transform="translate(21 21)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                                    <ellipse className="stroke-current text-purple-300" cx="11" cy="11" rx="5.5" ry="11" />
                                    <path className="stroke-current text-purple-100" d="M11 0v22M0 11h22" />
                                    <circle className="stroke-current text-purple-100" cx="11" cy="11" r="11" />
                                </g>
                            </svg>
                            <p className="text-lg text-gray-400 text-center h4 mb-2">Download pdf</p>
                        </div>
                    </div>
                    <div className="w-3/4 h-96 mx-auto border-2 border-dotted border-blue-500 object-content lg:gap-16 my-4">
                        {!imageUploaded && <div className='flex mx-72 my-36'>
                            <div>
                                <input type='file' className='flex items-center justify-center my-4 mx-28' onChange={handleChange}></input>
                                <h4 className='font-bold text-2xl '>Select Your Files To Parse The Data</h4>
                            </div>
                        </div>}
                        {imageUploaded &&
                            <div className='object-content flex justify-center items-center h-100'>
                                <img src={imagUrl} onLoad={handleImageLoad} className='object-content h-96'></img>
                            </div>}
                    </div>
                    {imageUploaded &&
                        <div className='flex felx-end mx-40 mt-4'>
                            <input type='file' onChange={handleChange} ></input>
                        </div>}

                    <div className='my-8 mx-auto flex justify-center'>
                        <button className='bg-[#5D5DFF] px-8 py-2 rounded-lg text-xl font-bold' onClick={async()=>{
                            await setConvertText(true);
                            handleClick();
                            // setLoadin(true);
                            // setTimeout(()=>{
                            //     setLoadin(false)
                            // }, 3000 )
                        }}>Convert to Text</button>
                    </div>
                </div>
}
{convertText && !loading &&
            
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <div className='mt-6'>
                        <button className='back' onClick={()=>{
                            setConvertText(false)
                            setImgUrl('')
                            setImageUploaded(false)
                        }}>Back</button>
                    </div>
                    <div className='mx-28 my-4 flex justify-between w-96 h-12'>
                        <input type='text' placeholder="Search" className='rounded-md border-[#5D5DFF] border-2 text-black' value={transcript} onChange={(event) => {
                            setTranscript(event.target.value)
                        }} style={{ color: "black" }} ></input>
                        <button className='absolute ml-56 mt-2.5' onClick={handleVoiceInput}><i className="fa fa-microphone text-[#5D5DFF] relative text-2xl" aria-hidden="true"></i></button>
                        <button className='bg-[#5D5DFF] px-2 rounded-lg text-lg font-bold' onClick={handleClick2}>Search text</button>
                    </div>
                </div>
                <div className='flex justify-between mx-24'>
                    <div className='actual-img w-5/6'>
                        <h1 className='font-bold text-xl'>Actual image uploaded</h1>
                        <img
                            src={imagUrl} className="App-logo my-8"
                            ref={imageRef}
                        />
                    </div>
                    <div className='canvas-img w-5/6'>
                        <h3 className='font-bold text-xl'>Canvas</h3>
                        <canvas className='my-8' ref={canvasRef}></canvas>
                    </div>
                </div>
                <div className='mx-24 flex justify-between'>
                    <div className='w-5/6'>
                        <h1 className='text-2xl text-bold text-[#fec80a]'>Extracted Text :</h1>
                        <p className='pr-2'> <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={[transcript]}
                            autoEscape={true}
                            textToHighlight={text}
                        /></p>
                    </div>
                    <div className='w-5/6 ml-28'>
                        <h1 className='text-2xl text-bold text-[#fec80a] '>Summarized Text :</h1>
                        <p className='pr-2'>{summarizedtext}</p>
                        <br></br>
                        {text.length !== 0 &&
                            <>
                                {emails &&
                                    <>
                                        <h1 className='text-xl text-bold text-[#fec80a]'>Emails:</h1>
                                        <ul className='pr-2'>
                                            {emails.map((email, index) => (
                                                <li key={index}>{email}</li>
                                            ))}
                                        </ul>
                                    </>
                                }
                                {phones &&
                                    <>
                                        <h1 className='text-xl text-bold text-[#fec80a]'>Phone Numbers:</h1>
                                        <ul className='pr-2'>
                                            {phones.map((phone, index) => (
                                                <li key={index}>{phone}</li>
                                            ))}
                                        </ul>
                                    </>
                                }
                                {dates &&
                                    <>
                                        <h1 className='text-xl text-bold text-[#fec80a]'>Dates:</h1>
                                        <ul className='pr-2'>
                                            {dates.map((date, index) => (
                                                <li key={index}>{date}</li>
                                            ))}
                                        </ul>
                                    </>
                                }
                                {creditCards &&
                                    <>
                                        <h1 className='text-xl text-bold text-[#fec80a]'>Credit Card Numbers:</h1>
                                        <ul className='pr-2'>
                                            {creditCards.map((creditCard, index) => (
                                                <li key={index}>{creditCard}</li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            </>
                        }

                        <br></br>
                        <h1 className='text-xl text-bold text-[#fec80a]'>Semantic Classification : <p className='text-white text-base'>{label}: {score}</p></h1>
                        <button onClick={handletts}>Text to Speech</button>
                        <button onClick={cancel}>Stop</button>
                    </div>
                </div>
                <div className='m-4 mr-28'>
                    <button className='bg-[#5D5DFF] px-8 py-2 rounded-lg text-lg font-bold float-right' onClick={() => generatePDFDocument("doc name")} >Extract to PDF!!</button>
                </div>
            </div>
}

        </>
    )
}

export default main