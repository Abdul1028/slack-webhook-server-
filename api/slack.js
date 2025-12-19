const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ text: "Action ignored" });
  }

  try {
    const payload = JSON.parse(req.body.payload);

    if (payload.actions[0].action_id !== "run_leetcode_now") {
      return res.status(200).json({ text: "Action ignored" });
    }

    // Trigger GitHub workflow
    const workflowUrl =
      "https://api.github.com/repos/Abdul1028/LeetCode-Reminder-MS/actions/workflows/leetcode-daily-reminder.yaml/dispatches";

    const response = await fetch(workflowUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({ ref: "main" }), // make sure 'main' matches your repo's default branch
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub workflow dispatch failed:", errorText);
      return res
        .status(500)
        .json({ text: "Failed to trigger workflow", details: errorText });
    }

    return res.status(200).json({ text: "🚀 LeetCode workflow triggered!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ text: "Error triggering workflow" });
  }
};
