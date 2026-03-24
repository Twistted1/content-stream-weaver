import runAIWorker from "./workers/aiWorker.js"
import runPublishWorker from "./workers/publishWorker.js"
import runImageWorker from "./workers/imageWorker.js"

async function runWorkerCycle() {
  try {
    console.log("--- Starting Worker Cycle ---")
    await runAIWorker()
    await runImageWorker()
    await runPublishWorker()
    console.log("--- Cycle Complete ---")
  } catch (error) {
    console.error("Critical worker error:", error)
  }
}

// Initial run
runWorkerCycle()

// Schedule runs
setInterval(runWorkerCycle, 60000) // every 60 seconds

console.log("System running...")
