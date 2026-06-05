import { initBuildPlanner } from "./buildPlannerUI.js"

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("build-planner-root")
  if (root) {
    initBuildPlanner()
  }
})
