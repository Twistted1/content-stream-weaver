import runAIWorker from "./workers/aiWorker.js"
import runPublishWorker from "./workers/publishWorker.js"
import runImageWorker from "./workers/imageWorker.js"

setInterval(() => {
  runAIWorker()
  runImageWorker()
  runPublishWorker()
}, 60000) // every 60 seconds

console.log("System running...")
