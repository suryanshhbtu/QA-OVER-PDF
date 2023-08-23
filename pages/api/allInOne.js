
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PromptTemplate } from "langchain/prompts";


const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

async function allInOne(req, res) {
    console.log("allInOne Called backend");
    if (req.method == 'POST') {
        // try {

            // Document loader
            // const loader = new PDFLoader("../../res/android-interview-questions.pdf");
            // Document loader
            
            const loader = new PDFLoader(`C:\\Users\\Suryansh Srivastava\\Desktop\\Suryansh\\QA and Chat over Documents\\QA_OVER_PDF\\res\\CourseFeeOnlineReceipt.pdf`, {
              splitPages: false,
            });

            
            
            // const docs = await loader.load();
            // const loader = new CheerioWebBaseLoader(
            //   req.body.url
            // );
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
              openAIApiKey: key,
            });
            const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
            console.log("vector store : "+vectorStore);
      
            // retrieve relavent split using similarity search
            // const relevantDocs = await vectorStore.similaritySearch("what is task decompostion?");
      
            // console.log(relevantDocs.length); // returns 4 as there are 4 task decompositions present in document
      
      
      
            const model = new ChatOpenAI({
              modelName: "gpt-3.5-turbo",
              openAIApiKey: key,
            });
            // const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
      
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
            

            // const response = await chain.call({
            //   query: req.body.question
            // });
            console.log(response);
            res.status(200).json({response: response});

        //   } catch {
        //     console.log("Error ");
        //     res.status(500).json({message: "Error"});
        //   }
    }
    console.log("Post do");
    
    // res.status(500).json({message: "SAFE SAFE"});
}
export default allInOne;