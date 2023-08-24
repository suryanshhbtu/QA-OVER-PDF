
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
const pdf = require('pdf-parse');
const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

async function allInOne(req, res) {
  console.log("allInOne Called backend");
  if (req.method == 'POST') {
    // try {
    let extractedText = '';
    let pdfResult = '';
    try {
      console.log("BUNTY   " + req.body.pdfData);
      const base64Pdf = req.body.pdfData;
      const pdfData = Buffer.from(base64Pdf, 'base64');
      pdfResult = await pdf(pdfData);
      extractedText = pdfResult.text;
      console.log("RESULTPDF \n \n \n" + JSON.stringify(pdfResult));
      console.log(extractedText);

    } catch (error) {
      console.error('Error processing PDF:', error);
      res.status(502).json({ message: "Danger" });

    }

    console.log("data loaded/ \n \n \n" + pdfResult);

    // doc splitter
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 10,
    });

    console.log(textSplitter);

    console.log("extracted Text" + extractedText);
    const splitTexts = await textSplitter.splitText(extractedText);

    console.log(splitTexts);
    console.log(typeof splitTexts)
    // // embedding and vector store
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: key,
    });

    console.log("EMBEDDING LOADED");
    const vectorStore = await MemoryVectorStore.fromTexts(splitTexts,
      [{ name: "pdf" }],
      embeddings
    );


    console.log("VECTOR STORE me store ho gya");

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: key,
    });

    console.log("MODEL BAN GYA");
    const template = `Use the following pieces of context to answer the question at the end.
            If you don't know the answer, just say that you don't know, don't try to make up an answer.
            Use three sentences maximum and keep the answer as concise as possible.
            Always say "thanks for asking!" at the end of the answer.
            {context}
            Question: {question}
            Helpful Answer:`;

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
      prompt: PromptTemplate.fromTemplate(template),
    });

    const response = await chain.call({
      query: req.body.question
    });


    console.log(response);
    res.status(200).json({ response: response });

    // } catch {
    //   console.log("Error ");
    //   res.status(500).json({ message: "Error" });
    // }
  } else {

    console.log("Post do");
    res.status(500).json({ message: "SAFE SAFE" });
  }

}
export default allInOne;