
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

async function allInOne(req, res) {
    console.log("allInOne Called backend");
    if (req.method == 'POST') {
        try {

            // Document loader
            // const loader = new PDFLoader("../../res/android-interview-questions.pdf");
            // Document loader
            
            const loader = new PDFLoader('C:\Users\Suryansh Srivastava\Desktop\Suryansh\QA and Chat over Documents\QA_OVER_PDF\res\CourseFeeOnlineReceipt.pdf', {
              splitPages: false,
            });
            
            // const docs = await loader.load();
            // const loader = new CheerioWebBaseLoader(
            //   req.body.url
            // );
            
            console.log("loadeder"+load);
            const data = await loader.load();
            console.log("data loaded"+data);
            // doc splitter
            const textSplitter = new RecursiveCharacterTextSplitter({
              chunkSize: 500,
              chunkOverlap: 0,
            });
            const splitDocs = await textSplitter.splitDocuments(data);
            console.log(splitDocs);
      
            // embedding and vector store
            const embeddings = new OpenAIEmbeddings({
              openAIApiKey: "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",
            });
            const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
            console.log("vector store : "+vectorStore);
      
            // retrieve relavent split using similarity search
            // const relevantDocs = await vectorStore.similaritySearch("what is task decompostion?");
      
            // console.log(relevantDocs.length); // returns 4 as there are 4 task decompositions present in document
      
      
      
            const model = new ChatOpenAI({
              modelName: "gpt-3.5-turbo",
              openAIApiKey: "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",
              temperature: 0
            });
            const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
      
            const response = await chain.call({
              query: req.body.question
            });
            console.log(response);
            res.status(200).json({response: response});

          } catch {
            console.log("Error ");
            res.status(500).json({message: "Error"});
          }
    }
    console.log("Post do");
    
    // res.status(500).json({message: "SAFE SAFE"});
}
export default allInOne;