# **DocSavvy**

---
### **Contents**
- [Introduction](#Introduction)
- [Run Locally](#Run-Locally)
- [Features](#Features)
- [Tech Stacks & Libraries](#Tech-Stacks-&-Libraries)
- [Model API's](#Model-API's)

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
- Semantic classification of text into classes: positive and negative 
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
- NodeJS
- Tesseract.js
- React-pdf, React-speech, React-speech-kit

--- 
### **Model API's**
- [BART model](https://huggingface.co/facebook/bart-large-cnn)
- [DistilBERT base uncased finetuned SST-2](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english)

---