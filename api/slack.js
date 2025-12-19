const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const payload = JSON.parse(req.body.payload);

      if (payload.actions[0].action_id === "run_leetcode_now") {
        // Trigger your GitHub workflow
        await fetch(
          "https://api.github.com/repos/Abdul1028/LeetCode-Reminder-MS/actions/workflows/leetcode-daily-reminder.yaml/dispatches",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
              "Accept": "application/vnd.github+json"
            },
            body: JSON.stringify({ ref: "main" })
          }
        );

        return res.status(200).json({ text: "🚀 LeetCode workflow triggered!" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ text: "Error triggering workflow" });
    }
  }

  res.status(200).json({ text: "Action ignored" });
};
