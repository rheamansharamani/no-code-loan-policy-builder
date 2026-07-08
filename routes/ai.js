import { Router } from "express";
import { generateRuleFromPrompt } from "../services/aiGenerator.js";

const router = Router();

router.post("/generate", async (req, res) => {
    try {
        const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
        const forceFallback = req.body?.forceFallback === true;

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Please provide a prompt to generate a rule." });
        }

        const result = await generateRuleFromPrompt(prompt, { forceFallback });

        return res.json({ success: true, ...result });
    } catch (error) {
        console.error('AI generation error', error);
        return res.status(500).json({ success: false, message: error.message || "Unable to generate a rule right now." });
    }
});

router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export default router;
