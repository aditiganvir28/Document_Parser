# **DocSavvy**

---
### **Contents**
- [Introduction](#Introduction)
- [Run Locally](#Run-Locally)
- [Features](#Features)
- [Tech Stacks & Libraries](#Tech-Stacks-&-Libraries)
- [Model API's](#Model-API's)
- [Acknowledgement](#Acknowledgement)
- [Team Members](#Team-Members)
- [Link to SRS](#Link-to-SRS)
- [References](#References)

---
### **Introduction**
Document Parsing involves examining the data in a document and extracting useful information. The purpose of this web application is to provide an interface that extracts text from an image, then search for a specific phrase also returns its position in the given image.A document parser can automate the process of extracting information from large volumes of unstructured text documents, which can save time and reduce manual laborcosts. It can reduce the risk of errors and inconsistencies that can occur when information is manually extracted from documents. It can provide a scalable solution for organizations that need to process a large number of documents

---

---
### **Run Locally**
Clone the repo in virtual environment and open the website using the following commands:
```bash
git clone https://github.com/aditiganvir28/Document_Parser.git
cd Document_Parser/client
npm install
npm run dev
```
---

### **Features**
- Text extraction from image/pdf
- Extraction of emails, phone numbers
- Summarization of extracted text 
- Sentiment classification of text into classes: positive and negative 
- Highlighting location of input word/phrase in extracted text as well as in the input image through formation of bounding boxes in all its appearances
- Voice input for search function
- Extracted text to Speech Conversion
- Exporting the information to a pdf document which can be downloaded by the user 


---

### **Tech Stacks & Libraries**
- ReactJS
- Hyper Text Markup Language (HTML)
- Cascading Style Sheets (CSS)
- Javascript
- Tesseract.js
- React-pdf, React-speech, React-speech-kit

--- 
### **Model API's**
- [BART model](https://huggingface.co/facebook/bart-large-cnn)
- [DistilBERT base uncased finetuned SST-2](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english)

---

### **Acknowledgement**
This software project was developed as a part of the course CS258(Software Management) under the guidance of Dr.Puneet Gupta, Assistant Professor Discipline of Computer Science and Engineering at IIT Indore.


---
### **Team Members**
Group-15
1. [Aditi Ganvir](https://github.com/AditiGanvir)(210001016)
2. [Prajakta Darade](https://github.com/prajakta-1527)(210001052)
3. [Princy Sondarva](https://github.com/2pri8ncy)(210001068)
4. [Tanisha Sahu](https://github.com/10isha)(210001071)

---
### **Link to SRS**
- [SRS Document](https://www.overleaf.com/read/mkjwhshmgdgp)

---
### **Images**

<img width="600" alt="Screenshot 2023-07-18 at 12 33 00 AM" src="https://github.com/aditiganvir28/Document_Parser/assets/107802412/17aff786-ba23-4ee0-ad07-0596fc749c30">
<br></br>
<img width="600" alt="Screenshot 2023-07-18 at 12 32 54 AM" src="https://github.com/aditiganvir28/Document_Parser/assets/107802412/39126a7b-2ef0-4afe-9220-371ff819ca74">
<br></br>
<img width="600" alt="Screenshot 2023-07-18 at 12 33 42 AM" src="https://github.com/aditiganvir28/Document_Parser/assets/107802412/ad8bbf9b-54cc-42da-bf48-a44126f08fea">
<br></br>
<img width="600" alt="Screenshot 2023-07-18 at 12 33 15 AM" src="https://github.com/aditiganvir28/Document_Parser/assets/107802412/2a86a0ac-33cd-4609-bea4-c75074241f6c">
<br></br>
<img width="600" src="https://github.com/aditiganvir28/Document_Parser/assets/107802412/6d957dc8-f08c-4270-a470-911e7d5a7d0a">
<br></br>
<img width="600" src="https://github.com/aditiganvir28/Document_Parser/assets/107802412/c025e995-3469-4355-a6d8-4c95f677748e">


### **References**
- https://tesseract.projectnaptha.com
